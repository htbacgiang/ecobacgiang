import bcrypt from "bcryptjs";
import User from "../../../models/User";
import db from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Kết nối database
    await db.connectDb();

    // Kiểm tra xem đã có admin nào chưa
    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      return res.status(400).json({ 
        message: "Admin account already exists. Cannot create another admin account." 
      });
    }

    const { name, email, phone, password } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ 
        message: "Missing required fields: name, email, phone, password" 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate phone format
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: "Invalid phone format" });
    }

    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Kiểm tra email và phone đã tồn tại chưa
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: "Email or phone number already exists" 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Tạo admin user
    const adminUser = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
      emailVerified: true,
      agree: true,
      address: [],
      wishlist: [],
      gender: "Nam",
      dateOfBirth: null,
      defaultPaymentMethod: "",
    });

    await adminUser.save();

    res.status(201).json({
      message: "Admin account created successfully",
      user: {
        id: adminUser._id,
        name: adminUser.name,
        email: adminUser.email,
        phone: adminUser.phone,
        role: adminUser.role
      }
    });

  } catch (error) {
    console.error("Error creating admin account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
