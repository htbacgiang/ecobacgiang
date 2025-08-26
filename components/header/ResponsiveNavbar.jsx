import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineClose, AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { FaRegUser, FaHeart, FaFacebook, FaTwitter, FaLinkedin, FaInstagram,FaChevronUp,FaAngleDown  } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import logo from "../../public/logoecobacgiang.png";

const ResponsiveMenu = ({ isOpen, toggleMenu }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const menuItems = [
    { name: "Trang chủ", link: "/" },
    {
      name: "Về Eco Bắc Giang",
      dropdown: [
        { name: "Giới thiệu", link: "/gioi-thieu-ecobacgiang" },
        { name: "Tầm nhìn, Sứ mạng", link: "/tam-nhin-su-menh" },
        { name: "Ý nghĩa Logo", link: "/y-nghia-logo-ecobacgiang" },
        { name: "Gọi vốn cộng đồng", link: "/goi-von-cong-dong" },
        { name: "Đội ngũ", link: "/doi-ngu" },
        { name: "Giải thưởng & Chứng nhận", link: "/giai-thuong-va-chung-nhan" },
      ],
    },
    { name: "Blog Sống xanh", link: "/bai-viet" },
    {
      name: "Sản phẩm",
      link: "/san-pham",
      dropdown: [
        { name: "Thực phẩm hữu cơ", link: "/san-pham" },
        { name: "IoT và Robots", link: "/" },
        { name: "Năng lượng tái tạo", link: "/" },
      ],
    },
    { name: "Liên hệ", link: "/lien-he" },
  ];

  return (
    <>
      {/* Enhanced Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-500 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      ></div>

      {/* Enhanced Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 w-[70%] max-w-sm h-full bg-white shadow-2xl z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-all duration-500 ease-in-out overflow-hidden`}
      >
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-green-600 to-green-700 p-6 shadow-lg">
          <div className="flex justify-between items-center">
            <Image 
              src={logo} 
              alt="Logo" 
              width={150} 
              height={70} 
              className=""
            />
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-300 group"
            >
              <AiOutlineClose
                size={24}
                className="text-white group-hover:scale-110 transition-transform duration-300"
              />
            </button>
          </div>
        </div>

        {/* Enhanced Search */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent shadow-sm transition-all duration-300"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Enhanced Menu Items */}
        <div className="flex-1 overflow-y-auto">
          <ul className="space-y-2 p-6">
            {menuItems.map((item, index) => (
              <li key={index} className="group">
                {!item.dropdown ? (
                  <Link 
                    href={item.link} 
                    className="flex items-center px-4 py-2 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-green-600 font-medium transition-all duration-300 group-hover:translate-x-2"
                    onClick={toggleMenu}
                  >
                    <span className="text-lg">{item.name}</span>
                  </Link>
                ) : (
                  <div className="space-y-2">
                    <button
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-green-600 font-medium transition-all duration-300 group-hover:translate-x-2"
                      onClick={() => toggleDropdown(index)}
                      aria-expanded={activeDropdown === index}
                    >
                      <span className="text-lg">{item.name}</span>
                      <div className={`transition-transform duration-300 ${activeDropdown === index ? 'rotate-180' : ''}`}>
                        <FaAngleDown size={18} className="text-gray-400 group-hover:text-green-600" />
                      </div>
                    </button>
                    
                    {/* Enhanced Dropdown */}
                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${
                        activeDropdown === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul className="space-y-1 pl-6">
                        {item.dropdown.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              href={subItem.link}
                              className="flex items-center px-2 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-green-600 text-base transition-all duration-300 hover:translate-x-2"
                              onClick={toggleMenu}
                            >
                              <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                              {subItem.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Enhanced Social Media Links */}
        <div className="p-6 border-t border-gray-200 bg-white">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Theo dõi chúng tôi
          </h3>
          <div className="flex justify-center space-x-6">
            {[
              { icon: FaFacebook, color: "hover:text-blue-600", href: "#" },
              { icon: FaTwitter, color: "hover:text-blue-400", href: "#" },
              { icon: FaLinkedin, color: "hover:text-blue-700", href: "#" },
              { icon: FaInstagram, color: "hover:text-pink-600", href: "#" }
            ].map((social, index) => (
              <Link
                key={index}
                href={social.href}
                className={`p-3 bg-gray-50 rounded-full shadow-lg text-gray-600 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-xl`}
              >
                <social.icon size={20} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponsiveMenu;
