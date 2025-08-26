import { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { getToken } from "next-auth/jwt";
import db from "../../../utils/db";
import Post from "../../../models/Post";
import { formatPosts } from "../../../lib/utils";

const handler: NextApiHandler = async (req, res) => {
  const { method } = req;
  
  if (method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const session = token ? { user: token } : null;

  if (!session || !session.user) {
    return res.status(401).json({ error: "Bạn cần đăng nhập!" });
  }

  // Chỉ admin mới có thể xem danh sách nháp
  if (session.user.role !== 'admin') {
    return res.status(403).json({ error: "Bạn không có quyền truy cập!" });
  }

  try {
    await db.connectDb();

    const { limit = "10", pageNo = "0", skip = "0" } = req.query as {
      limit: string;
      pageNo: string;
      skip: string;
    };

    const finalSkip = parseInt(skip) || parseInt(limit) * parseInt(pageNo);
    const finalLimit = Math.min(parseInt(limit), 50); // Giới hạn tối đa 50 bài

    // Chỉ lấy bài viết nháp
    const drafts = await Post.find({ isDraft: true })
      .sort({ updatedAt: "desc" })
      .select("-content")
      .skip(finalSkip)
      .limit(finalLimit)
      .populate('author', 'name email');

    const totalDrafts = await Post.countDocuments({ isDraft: true });

    res.json({ 
      drafts: formatPosts(drafts),
      total: totalDrafts,
      page: parseInt(pageNo),
      limit: finalLimit,
      hasMore: finalSkip + finalLimit < totalDrafts
    });
  } catch (error: any) {
    console.error("Lỗi lấy danh sách nháp:", error);
    res.status(500).json({ error: "Lỗi máy chủ!" });
  }
};

export default handler;
