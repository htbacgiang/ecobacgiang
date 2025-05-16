import React from "react";
import { User, MapPin, FileText, Bell, ToggleRight, LogOut, ChevronRight } from "lucide-react";

const AccountSettingsList = ({ handleTabClick, onSignOut }) => {
  return (
    <div className="bg-white rounded-lg mx-4 mt-4 p-4 shadow">
      <h2 className="text-lg font-semibold mb-4">Tài khoản của tơi</h2>
      <ul>
        <li className="flex items-center justify-between py-3 border-b border-gray-200" onClick={() => handleTabClick("account")}>
          <div className="flex items-center">
            <User className="w-5 h-5 text-green-600 mr-3" />
            <span>Quản lý thông tin</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </li>
        <li className="flex items-center justify-between py-3 border-b border-gray-200" onClick={() => handleTabClick("addresses")}>
          <div className="flex items-center">
            <MapPin className="w-5 h-5 text-green-600 mr-3" />
            <span>Địa chỉ giao hàng</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </li>
        <li className="flex items-center justify-between py-3 border-b border-gray-200" onClick={() => handleTabClick("orders")}>
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-green-600 mr-3" />
            <span>Lịch sử đơn hàng</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </li>
        <li className="flex items-center justify-between py-3 border-b border-gray-200">
          <div className="flex items-center">
            <Bell className="w-5 h-5 text-green-600 mr-3" />
            <span>Nhận thông báo</span>
          </div>
          <ToggleRight className="w-5 h-5 text-gray-400" />
        </li>
        <li className="flex items-center justify-between py-3 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-5 h-5 text-green-600 mr-3">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6z" />
              </svg>
            </div>
            <span>Chế độ tối</span>
          </div>
          <ToggleRight className="w-5 h-5 text-gray-400" />
        </li>
        <li className="flex items-center justify-between py-3 cursor-pointer" onClick={onSignOut}>
          <div className="flex items-center">
            <LogOut className="w-5 h-5 text-green-600 mr-3" />
            <span>Đăng xuất</span>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default AccountSettingsList;