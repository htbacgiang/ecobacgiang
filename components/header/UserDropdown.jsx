import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaRegUser, FaHeart, FaSignOutAlt, FaCrown, FaGift, FaShoppingBag, FaHistory, FaMapMarkerAlt, FaCreditCard, FaHeadset } from "react-icons/fa";
import { MdSubscriptions, MdLocalOffer, MdNotifications } from "react-icons/md";
import { useSession, signIn, signOut } from "next-auth/react";

const UserDropdown = ({ userDropdownOpen, toggleUserDropdown }) => {
  const { data: session } = useSession();

  if (!userDropdownOpen) return null;

  return (
    <div className="absolute right-0 top-14 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 z-50 overflow-hidden backdrop-blur-md">
      {session ? (
        <>
          {/* User Info Section */}
          <div className="bg-green-50 p-6 border-b border-green-200">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl overflow-hidden bg-green-500 flex items-center justify-center shadow-lg ring-4 ring-green-100">
                  {session.user.image ? (
                    <img 
                      src={session.user.image} 
                      alt="User Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                      {session.user.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h4 className="font-bold text-gray-900 text-lg">{session.user.name}</h4>
                <p className="text-sm text-gray-600">{session.user.email}</p>
                <div className="flex items-center mt-2">
                  <span className="text-xs text-green-600 font-medium uppercase">{session.user.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Promotion Banner */}
          <div className="p-4 bg-green-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaCrown className="text-yellow-300 w-5 h-5 mr-2" />
                <div>
                  <h5 className="text-white font-bold text-sm">Khách hàng VIP</h5>
                  <p className="text-green-100 text-xs">Miễn phí vận chuyển</p>
                </div>
              </div>
              <FaGift className="text-white w-5 h-5" />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4">
            <div className="space-y-2">
              {/* Thông tin tài khoản */}
              <Link href="/tai-khoan">
                <div className="flex items-center p-3 rounded-2xl hover:bg-green-50 transition-all duration-300 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                    <FaRegUser className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                      Thông tin tài khoản
                    </h5>
                    <p className="text-xs text-gray-500">Quản lý thông tin cá nhân</p>
                  </div>
                </div>
              </Link>

              {/* Đơn hàng của tôi */}
              <Link href="/lich-su">
                <div className="flex items-center p-3 rounded-2xl hover:bg-green-50 transition-all duration-300 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                    <FaHistory className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                      Đơn hàng của tôi
                    </h5>
                    <p className="text-xs text-gray-500">Xem lịch sử mua hàng</p>
                  </div>
                </div>
              </Link>

              {/* Sản phẩm yêu thích */}
              <Link href="/san-pham-yeu-thich">
                <div className="flex items-center p-3 rounded-2xl hover:bg-green-50 transition-all duration-300 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                    <FaHeart className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                      Sản phẩm yêu thích
                    </h5>
                    <p className="text-xs text-gray-500">Danh sách rau củ đã lưu</p>
                  </div>
                </div>
              </Link>

             
              {/* Hỗ trợ khách hàng */}
              <Link href="/lien-he">
                <div className="flex items-center p-3 rounded-2xl hover:bg-green-50 transition-all duration-300 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                    <FaHeadset className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                      Hỗ trợ khách hàng
                    </h5>
                    <p className="text-xs text-gray-500">Liên hệ và tư vấn</p>
                  </div>
                </div>
              </Link>

              {/* Thông báo */}
              <Link href="/tai-khoan?tab=notifications">
                <div className="flex items-center p-3 rounded-2xl hover:bg-green-50 transition-all duration-300 group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                    <MdNotifications className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors duration-300">
                      Thông báo
                    </h5>
                    <p className="text-xs text-gray-500">Cập nhật đơn hàng và khuyến mãi</p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Logout Section */}
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button 
                onClick={() => signOut()}
                className="w-full flex items-center p-3 rounded-2xl hover:bg-red-50 transition-all duration-300 group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                  <FaSignOutAlt className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1 text-left">
                  <h5 className="font-semibold text-red-700 group-hover:text-red-800 transition-colors duration-300">
                    Đăng xuất
                  </h5>
                  <p className="text-xs text-red-500">Thoát khỏi tài khoản</p>
                </div>
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaRegUser className="w-8 h-8 text-white" />
          </div>
          <h4 className="text-lg font-bold text-gray-900 mb-2">Chào mừng bạn!</h4>
          <p className="text-gray-600 text-sm mb-6">Đăng nhập để tiếp tục mua sắm rau củ hữu cơ</p>
          <button 
            onClick={() => signIn()} 
            className="w-full bg-green-600 text-white py-3 px-6 rounded-2xl font-bold hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Đăng nhập ngay
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;