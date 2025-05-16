import Link from "next/link";
import { FC, ReactNode, useState } from "react";
import {
  AiOutlineDashboard,
  AiOutlineContainer,
  AiOutlineTeam,
  AiOutlineMail,
  AiOutlineContacts,
  AiOutlineFileAdd,
} from "react-icons/ai";
import { IoIdCardSharp } from "react-icons/io5";
import AppHead from "../common/AppHead";
import AdminSecondaryNav from "../common/nav/AdminSecondaryNav";
import Slidebar from '../backend/Slidebar';
import Navbar from '../backend/Navbar';
interface Props {
  children: ReactNode;
  title?: string;
}

const navItems = [
  { href: "/admin", icon: AiOutlineDashboard, label: "Dashboard" },
  { href: "/admin/products", icon: IoIdCardSharp , label: "Sản phẩm" },
  { href: "/admin/posts", icon: AiOutlineContainer, label: "Bài viết" },
  { href: "/admin/users", icon: AiOutlineTeam, label: "Người dùng" },
];

const AdminLayout: FC<Props> = ({ title, children }): JSX.Element => {
  const [showSidebar, setShowSidebar] = useState(false);
  return (
    <>
      <AppHead title={title} />
      <div className="flex">
        <Slidebar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <div className={`lg:ml-60 ml-0 flex-grow bg-slate-100 min-h-screen`}>
        {/* Correctly pass setShowSidebar to Navbar */}
        <Navbar showSidebar={showSidebar} setShowSidebar={setShowSidebar} />
        <main className="p-2 bg-white dark:bg-slate-900 min-h-screen mt-16">
          {children}
        </main>
      </div>
        {/* create button */}
        {/* <Link href="/admin/posts/create" legacyBehavior>
          <a className="bg-secondary-dark dark:bg-secondary-light text-primary dark:text-primary-dark fixed z-10 right-10 bottom-10 p-3 rounded-full hover:scale-90 shadow-sm transition">
            <AiOutlineFileAdd size={24} />
          </a>
        </Link> */}
      </div>
    </>
  );
};

export default AdminLayout;
