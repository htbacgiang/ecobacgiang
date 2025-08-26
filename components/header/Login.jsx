import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      
      <div 
        className="relative flex items-center justify-center min-h-screen bg-cover bg-center" 
      >

        <div className="relative bg-white p-6 sm:p-8 rounded-lg shadow-lg">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center">Đăng Nhập</h2>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                Nhập Email / Số điện thoại
              </label>
              <input
                type="text"
                id="email"
                className="mt-1 block w-full border-green-500 rounded-lg shadow-md focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm px-4 py-2 bg-gray-50"
                placeholder="Email hoặc Số điện thoại"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
                Mật khẩu
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="mt-1 block w-full border-green-500 rounded-lg shadow-md focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm px-4 py-2 bg-gray-50 pr-10"
                placeholder="Nhập Mật Khẩu"
              />
              <div
                className="absolute inset-y-0 mt-3 right-4 flex items-center justify-center h-full cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEyeInvisible size={23} /> : <AiOutlineEye size={23} />}
              </div>
            </div>

            <div className="text-right text-sm text-indigo-600 hover:underline">
              <Link href="/forgot-password">
                Quên mật khẩu
              </Link>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Đăng Nhập
            </button>

            <div className="text-center text-gray-500 my-2">Hoặc đăng nhập bằng</div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none w-full sm:w-auto"
              >
                <img src="/google.png" alt="Google" className="w-5 h-5 mr-2" />
                Google
              </button>

              <button
                type="button"
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none w-full sm:w-auto"
              >
                <img src="/facebook.png" alt="Facebook" className="w-5 h-5 mr-2" />
                Facebook
              </button>
            </div>
          </form>

          <div className="text-center text-gray-600 mt-2">
            Chưa có tài khoản? 
            <Link  className="text-indigo-600 hover:underline" href="/register">
              Đăng ký ngay
            </Link>
          </div>

          <footer className="text-center text-gray-400 text-xs mt-2 gap-2">
            &copy; Bản quyền thuộc về Eco Bắc Giang 2025 | <Link href="/privacy-policy" className="hover:underline"> Chính sách bảo mật</Link>
          </footer>
        </div>
      </div>
    </>
  );
}
