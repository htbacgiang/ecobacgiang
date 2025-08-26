import React from 'react';
import {
  User as UserIcon,
  Bell,
  ShoppingBag,
  Heart,
  MapPin,
  CreditCard,
  Lock,
  ChevronRight,
  LogOut,
  MessageCircle
} from 'lucide-react';
import Image from 'next/image';

export default function UserSidebar({ selectedTab, onTabClick, userName, userImage }) {
  const menuItems = [
    {
      id: "account",
      icon: UserIcon,
      title: "Thông tin tài khoản",
      subtitle: "Cập nhật thông tin cá nhân",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      activeBg: "bg-green-100",
      activeBorder: "border-green-300"
    },
    {
      id: "notifications",
      icon: Bell,
      title: "Thông báo của tôi",
      subtitle: "Quản lý thông báo hệ thống",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      activeBg: "bg-green-100",
      activeBorder: "border-green-300"
    },
    {
      id: "orders",
      icon: ShoppingBag,
      title: "Quản lý đơn hàng",
      subtitle: "Theo dõi và quản lý đơn hàng",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      activeBg: "bg-green-100",
      activeBorder: "border-green-300"
    },

    {
      id: "addresses",
      icon: MapPin,
      title: "Sổ địa chỉ",
      subtitle: "Quản lý địa chỉ giao hàng",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      activeBg: "bg-green-100",
      activeBorder: "border-green-300"
    },
    {
      id: "payment",
      icon: CreditCard,
      title: "Thông tin thanh toán",
      subtitle: "Quản lý phương thức thanh toán",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      activeBg: "bg-green-100",
      activeBorder: "border-green-300"
    },
    {
      id: "change-password",
      icon: Lock,
      title: "Đổi mật khẩu",
      subtitle: "Cập nhật bảo mật tài khoản",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      activeBg: "bg-green-100",
      activeBorder: "border-green-300"
    },

  ];

  return (
    <div className="w-80 bg-white h-full">

      {/* Menu Items */}
      <div className="p-6">
        <div className="space-y-3">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = selectedTab === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onTabClick(item.id)}
                className={`group relative overflow-hidden rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:scale-[1.02] ${
                  isActive
                    ? `${item.activeBg} ${item.activeBorder} shadow-lg`
                    : `${item.borderColor} bg-white hover:border-gray-300 hover:shadow-md`
                }`}
              >
                <div className="flex items-center p-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-all duration-300 ${
                    isActive ? item.bgColor : item.bgColor
                  } group-hover:scale-110 shadow-sm`}>
                    <IconComponent className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-semibold truncate transition-colors duration-300 ${
                      isActive ? 'text-gray-900' : 'text-gray-800 group-hover:text-gray-900'
                    }`}>
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">{item.subtitle}</p>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-all duration-300 flex-shrink-0 ${
                    isActive ? 'text-gray-600' : 'text-gray-400 group-hover:text-gray-600'
                  } group-hover:translate-x-1`} />
                </div>
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-400 to-green-600 rounded-r-full"></div>
                )}
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Logout Section */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="group relative overflow-hidden rounded-2xl border-2 border-red-200 bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:scale-[1.02]">
            <div className="flex items-center p-4">
              <div className="w-12 h-12 rounded-xl bg-red-200 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <LogOut className="w-6 h-6 text-red-700" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-black group-hover:text-red-900 transition-colors duration-300">
                  Đăng xuất
                </h3>
                <p className="text-sm text-black mt-0.5">Thoát khỏi tài khoản</p>
              </div>
            </div>
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
}