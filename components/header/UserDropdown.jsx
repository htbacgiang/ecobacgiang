import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaRegUser, FaDownload, FaHeart, FaUpload, FaSignOutAlt } from "react-icons/fa";
import { MdSubscriptions } from "react-icons/md";
import { useSession, signIn, signOut } from "next-auth/react";

const UserDropdown = ({ userDropdownOpen, toggleUserDropdown }) => {
  const { data: session } = useSession();


  if (!userDropdownOpen) return null;

  return (
    <div className="absolute right-0 top-14 mt-2 w-72 bg-white text-gray-800 rounded-md shadow-lg z-50">
      {session ? (
        <>
          {/* User Info */}
          <div className="p-4 flex items-center">
            <img src={session.user.image || "/avatar.jpg"} alt="User Avatar" width={50} height={50} className="rounded-full aspect-square" />
            <div className="ml-4">
              <h4 className="font-bold">{session.user.name}</h4>
              <p className="text-sm text-gray-500">{session.user.email}</p>
            </div>
          </div>
    {/* Promotion Button */}
          <div className="p-4">
            <button className="w-full bg-green-600 text-white py-2 rounded-md font-bold uppercase">Giảm đến 50% </button>
          </div>
          {/* Navigation Links */}
          <ul className="text-sm mb-2">
            <li className="px-4 py-2 hover:bg-gray-100 flex items-center">
              <FaRegUser className="mr-2" />
              <Link href="/tai-khoan">Thông tin tài khoản</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 flex items-center">
              <FaDownload className="mr-2" />
              <Link href="/cart">Giỏ hàng</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 flex items-center">
              <FaHeart className="mr-2" />
              <Link href="/san-pham-yeu-thich">Sản phẩm yêu thích</Link>
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 flex items-center text-red-500">
              <FaSignOutAlt className="mr-2" />
              <button onClick={() => signOut()}> Đăng xuất</button>
            </li>
          </ul>
        </>
      ) : (
        <div className="p-4 text-center">
          <p className="text-gray-700">Bạn chưa đăng nhập</p>
          <button onClick={() => signIn()} className="mt-2 bg-blue-500 text-white py-2 px-4 rounded">Đăng nhập</button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;