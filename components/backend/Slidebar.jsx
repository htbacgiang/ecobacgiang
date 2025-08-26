"use client";
import Link from "next/link";
import React, { useState } from "react";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
import styles from "./Sidebar.module.css";

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
  Mail,
  MessageSquare,
} from "lucide-react";

import { useRouter } from "next/router";

export default function Sidebar() {
  const router = useRouter();
  const pathname = router.pathname;
  const { data: session, status } = useSession();

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
      title: "Email đăng ký",
      icon: Mail,
      href: "/dashboard/danh-sach-email",
    },
    {
      title: "Conversations",
      icon: MessageSquare,
      href: "/dashboard/conversations",
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
    await signOut({ callbackUrl: "/" });
  };

  // Nếu đang tải trạng thái phiên, hiển thị loading
  if (status === "loading") {
    return <div className={styles.loadingContainer}>Đang tải...</div>;
  }

  return (
    <div className={styles.sidebar}>
      <Link 
        className={styles.logoContainer} 
        href="/"
      >
        <Image height={120} width={120} alt="avatar" src="/logoecobacgiang.png" />
      </Link>

      <div className={styles.navContainer}>
        <Link
          href="/dashboard"
          className={`${styles.navLink} ${
            pathname === "/dashboard" ? styles.active : ""
          }`}
        >
          <LayoutGrid />
          <span>DashBoard</span>
        </Link>

        {sildebarLinks.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link
              href={item.href}
              key={i}
              className={`${styles.navLink} ${
                item.href === pathname ? styles.active : ""
              }`}
            >
              <Icon />
              <span>{item.title}</span>
            </Link>
          );
        })}

        {/* Hiển thị nút Đăng xuất chỉ khi người dùng đã đăng nhập */}
        {session && (
          <div className={styles.logoutContainer}>
            <button
              onClick={handleSignOut}
              className={styles.logoutButton}
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