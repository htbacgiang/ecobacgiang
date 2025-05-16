import { useState, useEffect } from "react";
import logo from "../../../public/greenlahomelogo.png"; // Adjust path as needed
import Image from "next/image";
import Link from "next/link";
import { FaChevronDown, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaAngleDown, FaChevronUp, FaAngleRight } from "react-icons/fa";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";

export default function Header() {
  const [scrolling, setScrolling] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const menuItems = [
    { name: "Trang chủ", link: "/" },
    { name: "Giới Thiệu", link: "/gioi-thieu" },
    {
      name: "Thiết Kế Nội Thất",
      dropdown: [
        { name: "Thiết kế nội thất nhà phố", link: "/thiet-ke-noi-that-nha-pho" },
        { name: "Thiết kế nội thất chung cư", link: "/thiet-ke-noi-that-chung-cu" },
      ],
    },
    {
      name: "Thi Công Nội Thất Trọn Gói", link: "/thi-cong-noi-that-tron-goi"
    },
    { name: "Dự Án", link: "/du-an" },
    { name: "Góc phong thủy", link: "/bai-viet" },
    { name: "Góc chuyên gia", link: "/bai-viet" },
    { name: "Liên Hệ", link: "/lien-he" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full transition-all duration-300 ease-in-out z-50 ${
          scrolling ? "bg-black shadow-md py-2 md:py-4" : "bg-black p-2 md:p-3"
        }`}
      >
        <div className="container mx-auto flex flex-col items-center justify-between">
          {/* Logo Row */}
          <div className="relative flex items-center justify-center w-full px-4">
            <Link href="/" className="flex justify-center">
              <Image
                src={logo}
                alt="logo"
                width={80}
                height={40}
                className={`cursor-pointer filter brightness-0 invert transition-all duration-300 ease-in-out ${
                  scrolling ? "md:opacity-0 md:-translate-y-4 md:h-0 md:overflow-hidden" : "opacity-100 translate-y-0 h-auto"
                }`}
                priority
              />
            </Link>
            {/* Hamburger Menu (Right-Aligned, visible on mobile) */}
            <div className="md:hidden absolute right-4 flex items-center">
              <AiOutlineMenu size={25} className="text-white cursor-pointer" onClick={toggleMenu} />
            </div>
          </div>

          {/* Desktop Menu Row (Hidden on Mobile, Centered) */}
          <nav className="hidden md:flex justify-center w-full transition-all duration-300 ease-in-out">
            <ul className="flex flex-wrap justify-center space-x-2 md:space-x-4 text-sm md:text-base uppercase font-semibold py-1 md:py-2">
              <li>
                <Link href="/" className="text-yellow-500 hover:text-yellow-400 transition-colors duration-200">
                  Trang Chủ
                </Link>
              </li>
              <li className="relative group">
                <Link href="/gioi-thieu" className="text-white hover:text-yellow-400 flex items-center transition-colors duration-200">
                  Giới Thiệu
                </Link>
              </li>
              <li className="relative group">
                <Link href="/thiet-ke-noi-that" className="text-white hover:text-yellow-400 flex items-center transition-colors duration-200">
                  Thiết Kế Nội Thất
                  <FaChevronDown className="ml-1 text-white group-hover:text-yellow-400 transition-transform duration-200 group-hover:rotate-180" size={12} />
                </Link>
                <div className="absolute left-0 hidden group-hover:block bg-black text-white w-64 md:w-72 p-2 md:p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 rounded-md">
                  <ul className="space-y-2">
                    {menuItems[2].dropdown.map((subItem, subIndex) => (
                      <li key={subIndex} className="flex items-center justify-between py-1 mt-1">
                        <Link href={subItem.link} className="hover:text-yellow-400 transition-colors duration-200 text-sm md:text-base uppercase">
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
              <li className="relative group">
                <Link href="/thi-cong-noi-that-tron-goi" className="text-white hover:text-yellow-400 flex items-center transition-colors duration-200">
                  Thi Công Nội Thất Trọn Gói
                </Link>
              </li>
              <li>
                <Link href="/du-an" className="text-white hover:text-yellow-400 transition-colors duration-200">
                  Dự Án
                </Link>
              </li>
              <li>
                <Link href="/goc-phong-thuy" className="text-white hover:text-yellow-400 transition-colors duration-200">
                  Góc phong thủy
                </Link>
              </li>
              <li>
                <Link href="/goc-chuyen-gia" className="text-white hover:text-yellow-400 transition-colors duration-200">
                  Góc chuyên gia
                </Link>
              </li>
              <li>
                <Link href="/lien-he" className="text-white hover:text-yellow-400 transition-colors duration-200">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Mobile Sidebar Menu */}
      <>
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
            menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={toggleMenu}
        ></div>

        {/* Sidebar Menu */}
        <div
          className={`fixed top-0 left-0 w-[70%] h-full max-h-full overflow-y-auto bg-black z-50 transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300`}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4">
            <Image src={logo} alt="Logo" width={150} height={70} />
            <AiOutlineClose size={25} className="cursor-pointer text-white" onClick={toggleMenu} />
          </div>

          {/* Search */}
          <div className="mb-4 px-4">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full px-3 py-2 border border-gray-600 bg-black text-white rounded focus:outline-none focus:ring-2 focus:ring-yellow-400 placeholder-gray-400"
            />
          </div>

          {/* Menu Items */}
          <ul className="space-y-4 px-4 border-b border-gray-700 pb-4 uppercase">
            {menuItems.map((item, index) => (
              <li key={index}>
                {!item.dropdown ? (
                  <Link href={item.link} className="text-white text-lg font-medium hover:text-yellow-400">
                    {item.name}
                  </Link>
                ) : (
                  <>
                    <div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleDropdown(index)}
                      role="button"
                      aria-expanded={activeDropdown === index}
                    >
                      <span className="text-white text-lg font-medium hover:text-yellow-400">{item.name}</span>
                      <span className="text-white">
                        {activeDropdown === index ? <FaChevronUp size={20} /> : <FaAngleDown size={20} />}
                      </span>
                    </div>
                    <ul
                      className={`pl-4 mt-2 ${
                        activeDropdown === index ? "max-h-96" : "max-h-0"
                      } overflow-hidden transition-all duration-300 space-y-2`} // Hiển thị xuống dòng
                    >
                      {item.dropdown.map((subItem, subIndex) => (
                        <li key={subIndex} className="flex items-center justify-between">
                          <Link
                            href={subItem.link}
                            className="py-1 text-gray-300 hover:text-yellow-400 uppercase"
                          >
                            {subItem.name}
                          </Link>
                          <FaAngleRight className="text-gray-300" size={12} />
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </li>
            ))}
          </ul>

          {/* Social Media Links */}
          <div className="flex space-x-4 justify-center mt-6">
            <Link href="https://facebook.com" className="text-white text-xl hover:text-blue-600">
              <FaFacebook />
            </Link>
            <Link href="https://twitter.com" className="text-white text-xl hover:text-blue-400">
              <FaTwitter />
            </Link>
            <Link href="https://linkedin.com" className="text-white text-xl hover:text-blue-700">
              <FaLinkedin />
            </Link>
            <Link href="https://instagram.com" className="text-white text-xl hover:text-pink-600">
              <FaInstagram />
            </Link>
          </div>
        </div>
      </>
    </>
  );
}