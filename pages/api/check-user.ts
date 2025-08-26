import { NextApiHandler } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { getToken } from "next-auth/jwt";

const handler: NextApiHandler = async (req, res) => {
  try {
    console.log("Check user API called");
    
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const session = token ? { user: token } : null;
    console.log("Session in check-user:", session);
    
    if (!session || !session.user) {
      return res.status(401).json({ 
        error: "Không có session",
        session: null
      });
    }

    // Serialize user data
    const userData = {
      id: session.user.sub || session.user.id,
      name: session.user.name,
      role: session.user.role,
      email: session.user.email,
      image: session.user.picture || session.user.image,
      emailVerified: session.user.email_verified || session.user.emailVerified,
      gender: session.user.gender,
      phone: session.user.phone,
      dateOfBirth: session.user.dateOfBirth,
      hasAddresses: session.user.hasAddresses,
      hasWishlist: session.user.hasWishlist
    };

    return res.status(200).json({ 
      success: true,
      user: userData,
      isAdmin: session.user.role === "admin"
    });
  } catch (error: any) {
    console.error("Check user error:", error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
};

export default handler;
