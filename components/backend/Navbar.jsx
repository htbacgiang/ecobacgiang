import {
  AlignJustify,
  Bell,
  Layout,
  LogOut,
  Settings,
  Sun,
  User,
  Moon,
  X,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../src/components/ui/dropdown-menu";
import { useThemeSwitch } from "../../components/common/nav/useThemeSwitch";
import Link from "next/link";
import { cx } from "../../utils";

export default function Navbar({ setShowSidebar, showSidebar }) {
  const [mode, setMode] = useThemeSwitch();
  const [notificationCount, setNotificationCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/contact/stream");
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "new_contact") {
        setNotificationCount((prev) => prev + 1);
        setNotifications((prev) => [
          {
            name: data.contact.name,
            submittedAt: data.contact.submittedAt,
          },
          ...prev,
        ]);
      }
    };

    return () => eventSource.close();
  }, []);

  const handleOpenDropdown = () => {
    setNotificationCount(0);
  };

  return (
    <div
      className="flex items-center justify-between bg-white dark:bg-slate-800 
      text-slate-50 h-16 px-8 py-4 z-50
      fixed top-0 w-full sm:left-60 left-0 right-0"
    >
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="text-[#105d97] dark:text-white"
      >
        <AlignJustify />
      </button>
      <div className="flex">
        <button
          onClick={() => setMode(mode === "light" ? "dark" : "light")}
          className={cx(
            "w-16 ease flex items-center justify-center rounded-full dark:text-white text-[#105d97]",
            mode === "light" ? "bg-dark text-light" : "bg-light text-dark"
          )}
          aria-label="theme-switcher"
        >
          {mode === "light" ? (
            <Sun className={"fill-dark"} />
          ) : (
            <Moon className={"fill-dark"} />
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger onClick={handleOpenDropdown}>
            <div
              type="button"
              className="relative inline-flex items-center p-3 text-sm font-medium text-center bg-transparent rounded-lg"
            >
              <Bell className="dark:text-white text-[#105d97]" />
              {notificationCount > 0 && (
                <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-normal text-white bg-orange-500 rounded-full top-0 end-1 dark:border-gray-900">
                  {notificationCount}
                </div>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="px-4 py-4 mr-6">
            <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length > 0 ? (
              notifications.map((notif, index) => (
                <DropdownMenuItem key={index}>
                  <div className="flex items-center space-x-2">
                    <Image
                      height={200}
                      width={200}
                      className="w-8 h-8 rounded-full"
                      alt="avatar"
                      src="/avatar.jpg"
                    />
                    <div className="flex flex-col space-y-1">
                      <p>{notif.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(notif.submittedAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    <button>
                      <X />
                    </button>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem>
                <p>Không có thông báo mới</p>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>

 
      </div>
    </div>
  );
}