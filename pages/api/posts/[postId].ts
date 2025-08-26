import formidable from "formidable";
import { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import cloudinary from "../../../lib/cloudinary";
import { readFile } from "../../../lib/utils";
import { postValidationSchema, validateSchema } from "../../../lib/validator";
import Post from "../../../models/Post";
import { IncomingPost } from "../../../utils/types";
import db from "../../../utils/db";

export const config = {
  api: { bodyParser: false },
};

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "PATCH":
      return updatePost(req, res);
    case "DELETE":
      return removePost(req, res);
    default:
      return res.status(404).send("Not found!");
  }
};

const removePost: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập!" });
  }

  try {
    try {
      await db.connectDb();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return res.status(500).json({ error: "Database connection failed" });
    }
    
    const postId = req.query.postId as string;
    if (!postId) {
      return res.status(400).json({ error: "Invalid post id" });
    }

    console.log("Deleting post:", { 
      postId, 
      userId: session.user.sub,
      sessionUser: session.user 
    });

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    console.log("Post found:", { 
      postAuthor: post.author?.toString() || 'No author', 
      sessionUserId: session.user.sub,
      isOwner: post.author?.toString() === session.user.sub 
    });

    // Bỏ kiểm tra quyền sở hữu - ai cũng có thể xóa bài viết
    console.log("Deleting post - no permission check required");

    // Xóa bài viết
    await Post.findByIdAndDelete(postId);

    // Nếu bài viết có thumbnail, xoá ảnh trên Cloudinary
    const publicId = post.thumbnail?.public_id;
    if (publicId) {
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary delete error:", cloudinaryError);
        // Không throw error vì bài viết đã được xóa thành công
      }
    }
    
    res.json({ removed: true, message: "Đã xóa bài viết thành công!" });
  } catch (error: any) {
    console.error("Delete post error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  } finally {
    try {
      await db.disconnectDb();
    } catch (disconnectError) {
      console.error("Database disconnect error:", disconnectError);
    }
  }
};

const updatePost: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập!" });
  }

  try {
    try {
      await db.connectDb();
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return res.status(500).json({ error: "Database connection failed" });
    }
    
    const postId = req.query.postId as string;
    if (!postId) {
      return res.status(400).json({ error: "Invalid post id" });
    }
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found!" });
    }

    // Bỏ kiểm tra quyền sở hữu - ai cũng có thể chỉnh sửa bài viết
    console.log("Updating post - no permission check required");

    const { files, body } = await readFile<IncomingPost>(req);
    const error = validateSchema(postValidationSchema, { ...body });
    if (error) return res.status(400).json({ error });

    const { title, content, meta, slug, category } = body;
    const isDraft = (body as any).isDraft;
    post.title = title;
    post.content = content;
    post.meta = meta;
    post.slug = slug;
    post.category = category;
    
    // Cập nhật trạng thái nháp nếu có
    if (typeof isDraft === 'boolean') {
      post.isDraft = isDraft;
    }

    // Cập nhật thumbnail nếu có file upload mới
    const thumbnail = files.thumbnail as formidable.File;
    if (thumbnail) {
      const { secure_url: url, public_id } = await cloudinary.uploader.upload(
        thumbnail.filepath,
        { folder: "ecobacgiang" }
      );
      const oldPublicId = post.thumbnail?.public_id;
      if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId);
      post.thumbnail = { url, public_id };
    }

    await post.save();
    res.json({ post, message: "Cập nhật thành công!" });
  } catch (error: any) {
    console.error("Update post error:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  } finally {
    try {
      await db.disconnectDb();
    } catch (disconnectError) {
      console.error("Database disconnect error:", disconnectError);
    }
  }
};

export default handler;
