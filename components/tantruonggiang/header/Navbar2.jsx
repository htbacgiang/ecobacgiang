// components/common/Navbar.js
import Link from "next/link";
import Image from "next/image";
import { FaSearch, FaUser, FaShoppingCart } from "react-icons/fa";

export default function Navbar2() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-transparent">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/greenlahomelogo.png"
            alt="Green LA Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <Link href="/" className="text-white text-xl font-bold">
            Tân Trường Giang
          </Link>
        </div>

        {/* Menu Items */}
        <ul className="hidden md:flex space-x-8 text-white text-sm font-medium">
          <li>
            <Link href="/" className="hover:text-orange-500 transition-colors">
              TRANG CHỦ
            </Link>
          </li>
          <li>
            <Link href="/dich-vu" className="hover:text-orange-500 transition-colors">
              DỊCH VỤ
            </Link>
          </li>
          <li>
            <Link href="/san-pham" className="hover:text-orange-500 transition-colors">
              SẢN PHẨM
            </Link>
          </li>
          <li>
            <Link href="/du-an" className="hover:text-orange-500 transition-colors">
              DỰ ÁN
            </Link>
          </li>
          <li>
            <Link href="/blog" className="hover:text-orange-500 transition-colors">
              BLOG
            </Link>
          </li>
          <li>
            <Link href="/lien-he" className="hover:text-orange-500 transition-colors">
              LIÊN HỆ
            </Link>
          </li>
        </ul>

        {/* Icons */}
        <div className="flex space-x-4 text-white">
          <FaSearch className="cursor-pointer hover:text-orange-500" />
          <FaUser className="cursor-pointer hover:text-orange-500" />
          <FaShoppingCart className="cursor-pointer hover:text-orange-500" />
        </div>
      </div>
    </nav>
  );
}