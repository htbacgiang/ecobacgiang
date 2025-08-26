import Link from "next/link";
import { FaLock, FaHome, FaSignInAlt } from "react-icons/fa";

export default function AccessDenied({ 
  title = "Truy cập bị từ chối", 
  message = "Bạn không có quyền truy cập trang này.",
  showLoginButton = true,
  showHomeButton = true 
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FaLock className="text-red-600 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="space-y-3">
          {showLoginButton && (
            <Link
              href="/dang-nhap"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaSignInAlt className="mr-2" />
              Đăng nhập
            </Link>
          )}
          
          {showHomeButton && (
            <Link
              href="/"
              className="inline-flex items-center justify-center w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <FaHome className="mr-2" />
              Về trang chủ
            </Link>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <p>Nếu bạn nghĩ đây là lỗi, vui lòng liên hệ quản trị viên.</p>
        </div>
      </div>
    </div>
  );
}
