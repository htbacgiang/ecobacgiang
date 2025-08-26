import { NextApiHandler } from "next";
import db from "../../../utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import { postValidationSchema, validateSchema } from "../../../lib/validator";
import { formatPosts, readFile, readPostsFromDb } from "../../../lib/utils";
import Post from "../../../models/Post";
import formidable from "formidable";
import cloudinary from "../../../lib/cloudinary";
import { IncomingPost } from "../../../utils/types";

export const config = {
  api: { bodyParser: false },
};

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  switch (method) {
    case "GET":
      return readPosts(req, res);
    case "POST":
      return createNewPost(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
};

const createNewPost: NextApiHandler = async (req, res) => {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập để đăng bài!" });
  }

  try {
    const { files, body } = await readFile<IncomingPost>(req);
    let tags = body.tags ? JSON.parse(body.tags as string) : [];

    // Kiểm tra dữ liệu đầu vào
    const error = validateSchema(postValidationSchema, { ...body, tags });
    if (error) return res.status(400).json({ error });

    const { title, content, slug, meta, category } = body;

    await db.connectDb();

    const alreadyExists = await Post.findOne({ slug });
    if (alreadyExists) {
      return res.status(400).json({ error: "Slug phải là duy nhất!" });
    }

    // Tạo bài viết mới
    const newPost = new Post({
      title,
      content,
      slug,
      meta,
      tags,
      category,
      author: session.user.sub,
      isDraft: false, // Bài viết được đăng sẽ không phải là nháp
    });

    // Nếu có thumbnail, upload lên Cloudinary
    if (files.thumbnail) {
      const thumbnail = files.thumbnail as formidable.File;
      const { secure_url: url, public_id } = await cloudinary.uploader.upload(
        thumbnail.filepath,
        { folder: "ecobacgiang" }
      );
      newPost.thumbnail = { url, public_id };
    }

    await newPost.save();
    res.json({ post: newPost });
  } catch (error: any) {
    console.error("Lỗi tạo bài viết:", error);
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
};

const readPosts: NextApiHandler = async (req, res) => {
  try {
    const { limit, pageNo, skip, includeDrafts } = req.query as {
      limit: string;
      pageNo: string;
      skip: string;
      includeDrafts?: string;
    };
    
    // Mặc định không hiển thị nháp, chỉ admin mới có thể xem nháp khi có tham số includeDrafts=true
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = token ? { user: token } : null;
    const isAdmin = session?.user?.role === 'admin';
    const shouldIncludeDrafts = includeDrafts === 'true' && isAdmin;
    
    const posts = await readPostsFromDb(
      parseInt(limit),
      parseInt(pageNo),
      parseInt(skip),
      shouldIncludeDrafts
    );
    res.json({ posts: formatPosts(posts) });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export default handler;
