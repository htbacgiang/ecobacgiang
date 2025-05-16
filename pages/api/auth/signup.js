import bcrypt from "bcrypt";
import validator from "validator";
import db from "../../../utils/db";
import User from "../../../models/User";
import { createActivationToken } from "../../../utils/tokens";
import { sendEmail } from "../../../utils/sendEmails";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    console.log("Starting registration process...");

    // Parse request body
    const { name, email, password, conf_password, phone, agree } = req.body;

    // Kiểm tra đầu vào
    if (!name || !email || !phone || !password || !conf_password) {
      return res.status(400).json({ message: "Vui lòng điền hết các trường." });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Địa chỉ email không hợp lệ." });
    }
    if (password !== conf_password) {
      return res.status(400).json({ message: "Mật khẩu không khớp." });
    }
    if (agree !== true) { // Sửa ở đây: kiểm tra agree là true
      return res
        .status(400)
        .json({
          message: "Bạn phải đồng ý với Điều khoản & Chính sách bảo mật.",
        });
    }
    if (!/^\d{10,11}$/.test(phone)) {
      return res
        .status(400)
        .json({ message: "Số điện thoại không hợp lệ (10-11 chữ số)." });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
    }

    // Kết nối database
    await db.connectDb();
    console.log("DB connected");

    // Kiểm tra email và phone
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Địa chỉ email đã tồn tại." });
    }
    if (await User.findOne({ phone })) {
      return res
        .status(400)
        .json({ message: "Số điện thoại đã được đăng ký." });
    }

    // Mã hóa mật khẩu
    const cryptedPassword = await bcrypt.hash(password, 12);

    // Tạo người dùng mới
    const newUser = new User({
      name,
      email,
      phone,
      password: cryptedPassword,
      agree, // Lưu giá trị boolean
    });
    const addedUser = await newUser.save();
    console.log("User added to the database");

    // Tạo token kích hoạt tài khoản
    const activation_token = createActivationToken({ id: addedUser._id.toString() });
    const url = `${process.env.BASE_URL}/activate?token=${activation_token}`;

    // Gửi email kích hoạt
    await sendEmail(email, url, "", "Kích hoạt tài khoản.");
    // Cập nhật thời gian gửi email xác nhận
    addedUser.emailVerificationSentAt = new Date();
    await addedUser.save();

    // Ngắt kết nối database
    await db.disconnectDb();

    return res.status(200).json({
      message: "Đăng ký thành công! Hãy kiểm tra email để kích hoạt tài khoản.",
    });
  } catch (error) {
    console.error("Error:", error.stack || error.message);
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi trong quá trình đăng ký." });
  }
}