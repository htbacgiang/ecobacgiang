import React from "react";
import { User, Bell, Package, CreditCard, Settings, LogOut } from "lucide-react";

export default function AccountSettingsList({ handleTabClick, onSignOut }) {
  const menuItems = [
    {
      id: "profile",
      label: "Hồ sơ cá nhân",
      icon: User,
      description: "Thông tin cá nhân và tài khoản",
      color: "emerald"
    },
    {
      id: "notifications",
      label: "Thông báo",
      icon: Bell,
      description: "Quản lý thông báo và cập nhật",
      color: "blue"
    },

    {
      id: "payment",
      label: "Thanh toán",
      icon: CreditCard,
      description: "Thông tin thanh toán và ví",
      color: "orange"
    },
    {
      id: "settings",
      label: "Cài đặt",
      icon: Settings,
      description: "Cài đặt tài khoản và bảo mật",
      color: "gray"
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      emerald: "bg-emerald-100 text-emerald-600",
      blue: "bg-blue-100 text-blue-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      gray: "bg-gray-100 text-gray-600"
    };
    return colorMap[color] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mx-4 mt-4">
      <div className="bg-gradient-to-br from-slate-50 to-slate-200 px-6 py-6 border-b border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Quản lý tài khoản</h2>
      </div>
      
      <div className="p-4 space-y-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <div
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className="flex items-center justify-between py-4 border-b border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors rounded-xl px-4 last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getColorClasses(item.color)}`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{item.label}</div>
                  <div className="text-sm text-slate-600">{item.description}</div>
                </div>
              </div>
              <div className="text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          );
        })}
        
        <div className="pt-4">
          <div
            onClick={onSignOut}
            className="flex items-center justify-between py-4 cursor-pointer hover:bg-red-50 transition-colors rounded-xl px-4 border border-red-200"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <div className="font-semibold text-red-600">Đăng xuất</div>
                <div className="text-sm text-red-500">Thoát khỏi tài khoản</div>
              </div>
            </div>
            <div className="text-red-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}