import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import db from "../../utils/db";
import User from "../../models/User";

const handler = async (req, res) => {
  try {
    console.log("Check user DB API called");
    
    const session = await getServerSession(req, res, authOptions);
    console.log("Session in check-user-db:", session);
    
    if (!session || !session.user || !session.user.id) {
      return res.status(401).json({ 
        error: "Không có session hoặc thiếu user ID",
        session: null
      });
    }

    await db.connectDb();
    
    // Lấy user từ database
    const user = await User.findById(session.user.id);
    console.log("User from DB:", user);
    
    if (!user) {
      return res.status(404).json({ 
        error: "Không tìm thấy user trong database"
      });
    }

    return res.status(200).json({ 
      success: true,
      sessionUser: {
        id: session.user.id,
        name: session.user.name,
        role: session.user.role,
        email: session.user.email
      },
      dbUser: {
        id: user._id,
        name: user.name,
        role: user.role,
        email: user.email
      },
      isAdmin: user.role === "admin",
      sessionRole: session.user.role,
      dbRole: user.role
    });
  } catch (error) {
    console.error("Check user DB error:", error);
    return res.status(500).json({ 
      error: error.message,
      stack: error.stack
    });
  }
};

export default handler;
