import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import bcrypt from "bcryptjs";
import User from "../../../models/User";
import clientPromise from "../../../lib/mongodb";
import db from "../../../utils/db";

db.connectDb().catch((error) => console.error("MongoDB connection error:", error));

// Hàm tạo mật khẩu mặc định: tên_user + số_ngẫu_nhiên_5_chữ_số
function generateDefaultPassword(userName) {
  // Loại bỏ dấu tiếng Việt và chuyển thành chữ thường
  const normalizedName = userName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/[^a-zA-Z0-9]/g, "") // Chỉ giữ chữ cái và số
    .toLowerCase();
  
  // Tạo số ngẫu nhiên 5 chữ số
  const randomNumber = Math.floor(Math.random() * 90000) + 10000; // 10000-99999
  
  return `${normalizedName}${randomNumber}`;
}

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith@example.com" },
        phone: { label: "Phone", type: "text", placeholder: "0123456789" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, phone, password } = credentials;
          if (!password) {
            throw new Error("Vui lòng nhập mật khẩu.");
          }
          if (!email && !phone) {
            throw new Error("Vui lòng nhập email hoặc số điện thoại.");
          }
          const user = await User.findOne({
            $or: [
              email ? { email } : null,
              phone ? { phone } : null,
            ].filter(Boolean),
          });
          if (!user) {
            throw new Error("Email hoặc số điện thoại không tồn tại.");
          }
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            throw new Error("Mật khẩu không đúng.");
          }
          return user;
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error(error.message || "Lỗi máy chủ.");
        }
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      allowDangerousEmailAccountLinking: true, // Cho phép liên kết email trùng lặp
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true, // Cho phép liên kết email trùng lặp
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Xử lý khi user đăng nhập bằng Google/Facebook
      if (account?.provider === "google" || account?.provider === "facebook") {
        try {
          console.log(`OAuth signIn for ${user.email} via ${account.provider}`);
          
          // Kiểm tra xem user đã tồn tại chưa
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // User mới - tạo với các trường bắt buộc
            const defaultPassword = generateDefaultPassword(user.name);
            const hashedPassword = await bcrypt.hash(defaultPassword, 12);
            
            console.log(`Generated default password for ${user.name}: ${defaultPassword}`);
            
            const newUser = new User({
              name: user.name,
              email: user.email,
              image: user.image,
              emailVerified: true,
              agree: true,
              role: "user",
              password: hashedPassword,
              phone: `0${Math.floor(Math.random() * 900000000) + 100000000}`,
              address: [],
              wishlist: [],
              gender: "Nam",
              dateOfBirth: null,
              defaultPaymentMethod: "",
            });
            
            await newUser.save();
            console.log("Created new OAuth user with required fields");
          } else {
            // User đã tồn tại - cập nhật thông tin và đảm bảo có các trường cần thiết
            const updateFields = {};
            
            // Kiểm tra và khởi tạo các trường mảng nếu chưa có
            if (!existingUser.address) updateFields.address = [];
            if (!existingUser.wishlist) updateFields.wishlist = [];
            
            // Đảm bảo có mật khẩu (nếu user cũ không có)
            if (!existingUser.password) {
              const defaultPassword = generateDefaultPassword(existingUser.name);
              const hashedPassword = await bcrypt.hash(defaultPassword, 12);
              updateFields.password = hashedPassword;
              console.log(`Generated default password for existing user ${existingUser.name}: ${defaultPassword}`);
            }
            
            // Đảm bảo có số điện thoại (nếu user cũ không có)
            if (!existingUser.phone) {
              updateFields.phone = `0${Math.floor(Math.random() * 900000000) + 100000000}`;
            }
            
            // Đảm bảo có gender hợp lệ
            if (!existingUser.gender || !["Nam", "Nữ", "Khác"].includes(existingUser.gender)) {
              updateFields.gender = "Nam";
            }
            
            // Các trường khác
            if (!existingUser.dateOfBirth) updateFields.dateOfBirth = null;
            if (!existingUser.defaultPaymentMethod) updateFields.defaultPaymentMethod = "";
            if (!existingUser.agree) updateFields.agree = true;
            
            // Cập nhật thông tin mới nhất từ OAuth
            if (user.image && user.image !== existingUser.image) {
              updateFields.image = user.image;
            }
            if (user.name && user.name !== existingUser.name) {
              updateFields.name = user.name;
            }
            
            // Chỉ cập nhật nếu có thay đổi
            if (Object.keys(updateFields).length > 0) {
              await User.findByIdAndUpdate(existingUser._id, updateFields);
              console.log("Updated existing OAuth user with missing fields");
            }
          }
          
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false;
        }
      }
      
      return true;
    },
    
    // Callback để xử lý việc liên kết tài khoản OAuth
    async linkAccount({ user, account, profile }) {
      try {
        return true;
      } catch (error) {
        console.error("Error linking account:", error);
        return false;
      }
    },
    
    // Callback để xử lý việc tạo JWT token
    async jwt({ token, user, account, profile }) {
      
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
      }
      
      // Log token mỗi lần được gọi
      return token;
    },
    
    async session({ session, token }) {
      try {
        
        if (token?.id) {
          const user = await User.findById(token.id);
          
          if (user) {
            session.user.id = token.id;
            session.user.name = user.name;
            session.user.role = user.role || "user";
            session.user.emailVerified = user.emailVerified || false;
            session.user.image = user.image;
            session.user.gender = user.gender || "Nam";
            // Convert Date to string for serialization
            session.user.dateOfBirth = user.dateOfBirth ? user.dateOfBirth.toISOString() : null;
            session.user.phone = user.phone || "";
            
            // Đảm bảo các trường mảng luôn có giá trị
            session.user.hasAddresses = user.address && user.address.length > 0;
            session.user.hasWishlist = user.wishlist && user.wishlist.length > 0;
            
            console.log("Session callback - final session:", session);
          } else {
            console.log("User not found in database for token ID:", token.id);
          }
        } else {
          console.log("Token has no ID");
        }
        
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
  },
  pages: {
    signIn: "/dang-nhap",
    error: "/loi-dang-nhap",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-key-for-development",
  // Thêm cấu hình để xử lý OAuth tốt hơn
  debug: process.env.NODE_ENV === "development",
  // Cho phép liên kết tài khoản với email trùng lặp
  allowDangerousEmailAccountLinking: true,
};

export default NextAuth(authOptions);