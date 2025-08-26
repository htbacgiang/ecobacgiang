import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import User from "../../../models/User";
import db from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Kết nối database
    await db.connectDb();

    // Kiểm tra session
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Kiểm tra xem user hiện tại có phải là admin không
    const currentUser = await User.findById(session.user.id);
    if (!currentUser || currentUser.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    const { userId, newRole } = req.body;

    if (!userId || !newRole) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Kiểm tra role hợp lệ
    if (!["user", "admin"].includes(newRole)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Cập nhật role của user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      }
    });

  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
