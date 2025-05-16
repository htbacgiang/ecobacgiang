import formidable from "formidable";
import { NextApiHandler } from "next";
import cloudinary from "../../../lib/cloudinary";
import { readFile } from "../../../lib/utils";
import { postValidationSchema, validateSchema } from "../../../lib/validator";
import Post from "../../../models/Post";
import { IncomingPost } from "../../../utils/types";

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
  try {
    // Lấy postId từ query (vd: /api/posts/1234567890)
    const postId = req.query.postId as string;
    if (!postId) {
      return res.status(400).json({ error: "Invalid post id" });
    }

    const post = await Post.findByIdAndDelete(postId);
    if (!post) return res.status(404).json({ error: "Post not found!" });

    // Nếu bài viết có thumbnail, xoá ảnh trên Cloudinary
    const publicId = post.thumbnail?.public_id;
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
    res.json({ removed: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const updatePost: NextApiHandler = async (req, res) => {
  try {
    const postId = req.query.postId as string;
    if (!postId) {
      return res.status(400).json({ error: "Invalid post id" });
    }
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found!" });

    const { files, body } = await readFile<IncomingPost>(req);
    const error = validateSchema(postValidationSchema, { ...body });
    if (error) return res.status(400).json({ error });

    const { title, content, meta, slug, category } = body;
    post.title = title;
    post.content = content;
    post.meta = meta;
    post.slug = slug;
    post.category = category;

    // Cập nhật thumbnail nếu có file upload mới
    const thumbnail = files.thumbnail as formidable.File;
    if (thumbnail) {
      const { secure_url: url, public_id } = await cloudinary.uploader.upload(
        thumbnail.filepath,
        { folder: "gktanphat" }
      );
      const oldPublicId = post.thumbnail?.public_id;
      if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId);
      post.thumbnail = { url, public_id };
    }

    await post.save();
    res.json({ post });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
