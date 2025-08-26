import { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { getToken } from "next-auth/jwt";

const handler: NextApiHandler = async (req, res) => {
  try {
    console.log("Test session direct API called");
    console.log("Request headers:", req.headers);
    
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = token ? { user: token } : null;
    console.log("Direct session result:", session);
    
    return res.status(200).json({ 
      success: true,
      session: session,
      hasSession: !!session,
      hasUser: !!(session && session.user),
      userRole: session?.user?.role || "no role"
    });
  } catch (error: any) {
    console.error("Test session direct error:", error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
};

export default handler;
