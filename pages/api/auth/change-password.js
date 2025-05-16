import bcrypt from "bcrypt";
import { unstable_getServerSession } from "next-auth/next";
import db from "../../../utils/db";
import User from "../../../models/User";
import { authOptions } from "./[...nextauth]"; // Import authOptions từ [...nextauth].js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    console.log("Starting change password process...");

    // Kiểm tra session
    const session = await unstable_getServerSession(req, res, authOptions);
    console.log("Session in API:", session); // Debug session

    if (!session) {
      console.log("No session found, user not authenticated");
      return res.status(401).json({ message: "Vui lòng đăng nhập để đổi mật khẩu." });
    }

    // Parse request body
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Kiểm tra đầu vào
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "Vui lòng điền hết các trường." });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Mật khẩu mới không khớp." });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Mật khẩu mới phải có ít nhất 6 ký tự." });
    }

    // Kết nối database
    await db.connectDb();
    console.log("DB connected");

    // Tìm người dùng
    const user = await User.findById(session.user.id);
    if (!user) {
      await db.disconnectDb();
      return res.status(404).json({ message: "Người dùng không tồn tại." });
    }

    // So sánh mật khẩu hiện tại
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      await db.disconnectDb();
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng." });
    }

    // Kiểm tra mật khẩu mới không được trùng với mật khẩu hiện tại
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      await db.disconnectDb();
      return res.status(400).json({ message: "Mật khẩu mới không được trùng với mật khẩu hiện tại." });
    }

    // Mã hóa mật khẩu mới
    const cryptedNewPassword = await bcrypt.hash(newPassword, 12);

    // Cập nhật mật khẩu
    user.password = cryptedNewPassword;
    await user.save();
    console.log("Password updated in the database");

    // Ngắt kết nối database
    await db.disconnectDb();

    return res.status(200).json({
      message: "Đổi mật khẩu thành công!",
    });
  } catch (error) {
    console.error("Error:", error.stack || error.message);
    await db.disconnectDb();
    return res.status(500).json({ message: "Đã xảy ra lỗi trong quá trình đổi mật khẩu." });
  }
}