"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react"; // Thêm NextAuth để xử lý đăng xuất

import {
  LayoutGrid,
  Notebook,
  Settings,
  Users2,
  LogOut,
  ShoppingCart,
  FolderPlus,
  SquarePen,
  TicketPercent,
  ShoppingBasket,
} from "lucide-react";

import { useRouter } from "next/router";

export default function Sidebar({ showSidebar, setShowSidebar }) {
  const router = useRouter();
  const pathname = router.pathname;
  const { data: session, status } = useSession(); // Lấy trạng thái phiên từ NextAuth

  const sildebarLinks = [
    {
      title: "Bài viết",
      icon: Notebook,
      href: "/dashboard/bai-viet",
    },
    {
      title: "Thêm bài viết",
      icon: SquarePen,
      href: "/dashboard/them-bai-viet",
    },
    {
      title: "Khách hàng",
      icon: Users2,
      href: "/dashboard/khach-hang",
    },
    {
      title: "Sản phẩm",
      icon: ShoppingCart,
      href: "/dashboard/san-pham",
    },
    {
      title: "Thêm sản phẩm",
      icon: FolderPlus,
      href: "/dashboard/them-san-pham",
    },
    {
      title: "Danh sách orders",
      icon: ShoppingBasket,
      href: "/dashboard/danh-sach-order",
    },
    {
      title: "Mã giảm giá",
      icon: TicketPercent,
      href: "/dashboard/ma-giam-gia",
    },
    {
      title: "Cài đặt",
      icon: Settings,
      href: "/cai-dat",
    },
  ];

  const catalogueLinks = [

  

  ];
  const [openMenu, setOpenMenu] = useState(false);

  // Hàm xử lý đăng xuất
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" }); // Chuyển hướng về trang chủ sau khi đăng xuất
  };

  // Nếu đang tải trạng thái phiên, hiển thị loading
  if (status === "loading") {
    return <div>Đang tải...</div>;
  }

  return (
    <div
      className={
        showSidebar
          ? "hidden sm:block mt-16 sm:mt-0 dark:bg-slate-700 bg-slate-50 space-y-6 w-60 h-screen dark:text-slate-50 text-slate-800 fixed left-0 top-0 shadow-md overflow-y-scroll"
          : "mt-16 hidden sm:mt-0 sm:block dark:bg-slate-700 bg-slate-50 space-y-6 w-60 h-screen dark:text-slate-50 text-slate-800 fixed left-0 top-0 shadow-md overflow-y-scroll"
      }
    >
      <Link onClick={() => setShowSidebar(false)} className="mb-6 justify-center mx-auto flex mt-2" href="/">
        <Image height={100} width={100} alt="avatar" src="/logoecobacgiang.png" />
      </Link>

      <div className="space-y-3 flex flex-col mt-14">
        <Link
          href="/dashboard"
          className={
            pathname === "/dashboard"
              ? "flex items-center space-x-3 py-2 px-6 border-l-4 border-[#105d97] text-[#105d97]"
              : "flex items-center space-x-3 py-2 px-6 "
          }
        >
          <LayoutGrid />
          <span>DashBoard</span>
        </Link>


        {sildebarLinks.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              onClick={() => setShowSidebar(false)}
              href={item.href}
              key={i}
              className={
                item.href === pathname
                  ? "flex items-center space-x-3 py-2 px-6 border-l-4 border-[#105d97] text-[#105d97]"
                  : "flex items-center space-x-3 py-2 px-6 "
              }
            >
              <Icon />
              <span>{item.title}</span>
            </Link>
          );
        })}

        {/* Hiển thị nút Đăng xuất chỉ khi người dùng đã đăng nhập */}
        {session && (
          <div className="px-6 py-2">
            <button
              onClick={handleSignOut} // Gắn hàm đăng xuất
              className="bg-[#105d97] rounded-md dark:text-slate-50 text-slate-50 flex items-center space-x-3 px-4 py-3"
            >
              <LogOut />
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}