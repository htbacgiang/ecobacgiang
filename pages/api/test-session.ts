import { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { getToken } from "next-auth/jwt";

const handler: NextApiHandler = async (req, res) => {
  try {
    console.log("Testing session...");
    
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = token ? { user: token } : null;
    console.log("Session result:", session);
    
    if (!session || !session.user) {
      return res.status(401).json({ 
        error: "Bạn cần đăng nhập!",
        session: null,
        headers: req.headers
      });
    }

    return res.status(200).json({ 
      success: true,
      user: session.user,
      session: session
    });
  } catch (error: any) {
    console.error("Session test error:", error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
};

export default handler;
