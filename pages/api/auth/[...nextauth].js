import NextAuth from "next-auth";
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import bcrypt from "bcrypt";
import User from "../../../models/User";
import clientPromise from "./lib/mongodb";
import db from "../../../utils/db";

db.connectDb().catch((error) => console.error("MongoDB connection error:", error));

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
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      try {
        const user = await User.findById(token.sub);
        if (!user) throw new Error("User not found.");
        session.user.id = token.sub || user._id.toString();
        session.user.name = user.name;
        session.user.role = user.role || "user";
        session.user.emailVerified = user.emailVerified || false;
        session.user.image = user.image;
        session.user.gender = user.gender;
        session.user.dateOfBirth = user.dateOfBirth;
        session.user.phone = user.phone;
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
  secret: process.env.JWT_SECRET,
};

export default NextAuth(authOptions);