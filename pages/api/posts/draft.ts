import { NextApiHandler } from "next";
import db from "../../../utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import Post from "../../../models/Post";
import formidable from "formidable";
import cloudinary from "../../../lib/cloudinary";
import { IncomingPost } from "../../../utils/types";

export const config = {
  api: { 
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "POST":
      return saveDraft(req, res);
    case "PUT":
      return updateDraftStatus(req, res);
    case "GET":
      return getDrafts(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const saveDraft: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập để lưu nháp!" });
  }

  try {
    // Xử lý FormData (cho việc upload file)
    const { files, fields } = await readFile<IncomingPost>(req);
    let tags: string[] = [];
    
    try {
      if (fields.tags && typeof fields.tags === 'string') {
        tags = JSON.parse(fields.tags);
      }
    } catch (parseError) {
      console.error("Lỗi parse tags:", parseError);
      tags = [];
    }

    const { title, content, slug, meta, category } = fields;
    const postId = (fields as any).postId;

      await db.connectDb();

      // Xử lý FormData logic...
      // Nếu có postId, cập nhật bài viết hiện có
      if (postId) {
        const existingPost = await Post.findById(postId);
        if (!existingPost) {
          return res.status(404).json({ error: "Không tìm thấy bài viết!" });
        }

        // Kiểm tra quyền sở hữu
        if (existingPost.author.toString() !== session.user.sub) {
          return res.status(403).json({ error: "Bạn không có quyền chỉnh sửa bài viết này!" });
        }

        // Cập nhật bài viết
        existingPost.title = title || existingPost.title;
        existingPost.content = content || existingPost.content;
        existingPost.meta = meta || existingPost.meta;
        existingPost.tags = tags;
        existingPost.category = category || existingPost.category;
        existingPost.isDraft = true;

        // Nếu có thumbnail mới, upload lên Cloudinary
        if (files.thumbnail) {
          const thumbnail = files.thumbnail as formidable.File;
          const { secure_url: url, public_id } = await cloudinary.uploader.upload(
            thumbnail.filepath,
            { folder: "ecobacgiang" }
          );
          existingPost.thumbnail = { url, public_id };
        }

        await existingPost.save();
        return res.json({ post: existingPost, message: "Đã lưu nháp thành công!" });
      }

      // Tạo bài viết nháp mới
      const newDraft = new Post({
        title: title || "Nháp bài viết",
        content: content || "",
        slug: slug || `draft-${Date.now()}`,
        meta: meta || "",
        tags,
        category: category || "",
        author: session.user.sub,
        isDraft: true,
      });

      // Nếu có thumbnail, upload lên Cloudinary
      if (files.thumbnail) {
        const thumbnail = files.thumbnail as formidable.File;
        const { secure_url: url, public_id } = await cloudinary.uploader.upload(
          thumbnail.filepath,
          { folder: "ecobacgiang" }
        );
        newDraft.thumbnail = { url, public_id };
      }

      await newDraft.save();
      res.json({ post: newDraft, message: "Đã tạo nháp mới!" });
  } catch (error: any) {
    console.error("Lỗi lưu nháp:", error);
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
};

const updateDraftStatus: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập!" });
  }

  try {
    const body = await parseJsonBody(req);
    const { postId, isDraft } = body;
    
    await db.connectDb();

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Không tìm thấy bài viết!" });
    }

    // Kiểm tra quyền sở hữu
    if (post.author.toString() !== session.user.sub) {
      return res.status(403).json({ error: "Bạn không có quyền chỉnh sửa bài viết này!" });
    }

    post.isDraft = isDraft;
    await post.save();

    res.json({ post, message: isDraft ? "Đã chuyển về nháp!" : "Đã xuất bản!" });
  } catch (error: any) {
    console.error("Lỗi cập nhật trạng thái:", error);
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
};



const getDrafts: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập!" });
  }

  try {
    await db.connectDb();

    const drafts = await Post.find({ 
      author: session.user.sub, 
      isDraft: true 
    }).sort({ updatedAt: -1 });

    res.json({ drafts });
  } catch (error: any) {
    console.error("Lỗi lấy danh sách nháp:", error);
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
};

// Helper function để đọc file từ formidable
const readFile = async <T>(req: any): Promise<{ fields: T; files: any }> => {
  return new Promise((resolve, reject) => {
    const form = formidable();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields: fields as T, files });
    });
  });
};

// Helper function để parse JSON body
const parseJsonBody = async (req: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk: any) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        resolve(parsed);
      } catch (error) {
        reject(error);
      }
    });
  });
};

export default handler;
