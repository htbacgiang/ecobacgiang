"use client";
import React, { useState, useEffect, useRef } from "react";
import logo from "../../public/logoecobacgiang.png";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { IoSearch, IoCartOutline } from "react-icons/io5";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import ProductDropdown from "../fontend/products/ProductDropdown";
import ShoppingCart from "../fontend/products/ShoppingCart";
import ResponsiveNavbar from "./ResponsiveNavbar";
import UserDropdown from "./UserDropdown";
import CrowdfundingSection from "./CrowdfundingSection"; // Import ContactForm
import { useSession } from "next-auth/react";
import { setCart } from "../../store/cartSlice";
import { useSelector, useDispatch } from "react-redux";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isCrowdFundingOpen, setIsCrowdFundingOpen] = useState(false); // New state for popup
  const { data: session } = useSession();

  const dropdownRef = useRef(null);

  // Redux cart state
  const cartItems = useSelector((state) => state.cart.cartItems) || [];
  const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
  const dispatch = useDispatch();

  // Sync cart with backend on login
  useEffect(() => {
    async function syncCart() {
      if (session?.user?.id) {
        try {
          const res = await axios.get(`/api/cart?userId=${session.user.id}`);
          dispatch(setCart(res.data));
        } catch (error) {
          console.error("Error syncing cart:", error);
        }
      }
    }
    syncCart();
  }, [session?.user?.id, dispatch]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sticky navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle functions
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleCart = () => setCartOpen(!cartOpen);
  const toggleSearch = () => setSearchOpen(!searchOpen);
  const toggleUserDropdown = () => setUserDropdownOpen(!userDropdownOpen);
  const toggleCrowdFunding = () => setIsCrowdFundingOpen(!isCrowdFundingOpen); // New toggle

  return (
    <nav
      className={`fixed w-full h-16 z-50 transition-all duration-500 ${
        isSticky ? "shadow-sm bg-white" : "bg-transparent"
      }`}
    >
      <div className="flex justify-between items-center h-full w-full px-4 md:px-16">
        {/* Logo */}
        <Link href="/">
          <Image
            src={logo}
            alt="Eco Bắc Giang logo"
            width={150}
            height={45}
            className="cursor-pointer"
            priority
            objectFit="contain"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden sm:flex">
          <ul className="hidden sm:flex space-x-6">
            <li>
              <Link
                href="/"
                className="text-gray-700 uppercase hover:text-green-600 font-heading font-semibold"
              >
                Trang chủ
              </Link>
            </li>
            <li
              className="relative group"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <p className="text-gray-700 cursor-pointer uppercase hover:text-green-600 font-heading font-semibold">
                Về Eco Bắc Giang
              </p>
              {aboutDropdownOpen && (
                <ul className="absolute top-6 left-0 bg-white rounded-md shadow-md z-50 w-60 max-w-60 border-t-4 border-green-600">
                  <li className="hover:bg-gray-100 px-4 py-2">
                    <Link href="/gioi-thieu-ecobacgiang">Giới thiệu</Link>
                  </li>
                  <li className="hover:bg-gray-100 px-4 py-2">
                    <Link href="/tam-nhin-su-menh">Tầm nhìn, Sứ mạng</Link>
                  </li>
                  <li className="hover:bg-gray-100 px-4 py-2">
                    <Link href="/y-nghia-logo-ecobacgiang">Ý nghĩa Logo</Link>
                  </li>
                  <li className="hover:bg-gray-100 px-4 py-2">
                    <Link href="/doi-ngu">Đội ngũ</Link>
                  </li>
                  <li className="hover:bg-gray-100 px-4 py-2">
                    <Link href="/giai-thuong-va-chung-nhan">
                      Giải thưởng & Chứng nhận
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link
                href="/bai-viet"
                className="text-gray-700 uppercase hover:text-green-600 font-heading font-semibold"
              >
                Blog sống xanh
              </Link>
            </li>
            <li>
              <ProductDropdown />
            </li>
            <li>
              <Link
                href="/lien-he"
                className="text-gray-700 uppercase hover:text-green-600 font-heading font-semibold"
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Icons */}
        <div className="hidden lg:flex items-center space-x-4">
          <button
            onClick={toggleCrowdFunding}
            className="bg-green-600 animate-blink py-3 font-heading text-white px-4 rounded font-semibold uppercase"
            aria-label="Open Crowd Funding form"
          >
            Crowd Funding
          </button>
          <div
            className="bg-white p-3 rounded shadow hover:bg-slate-100 cursor-pointer"
            onClick={toggleSearch}
            aria-label="Open search"
          >
            <IoSearch />
          </div>
          <div className="relative">
            <div
              className="bg-white p-3 rounded shadow hover:bg-slate-100 cursor-pointer"
              onClick={toggleCart}
              aria-label={`Shopping cart with ${totalQuantity} items`}
            >
              <IoCartOutline />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalQuantity}
                </span>
              )}
            </div>
          </div>
          <div className="relative" ref={dropdownRef}>
            <div
              className="cursor-pointer bg-white p-3 rounded shadow hover:bg-slate-100"
              onClick={toggleUserDropdown}
              role="button"
              aria-expanded={userDropdownOpen}
              aria-controls="user-dropdown"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && toggleUserDropdown()}
            >
              <FaRegUser />
            </div>
            <UserDropdown
              userDropdownOpen={userDropdownOpen}
              toggleUserDropdown={toggleUserDropdown}
            />
          </div>
        </div>

        {/* Hamburger Menu */}
        <div className="md:hidden cursor-pointer pl-24" onClick={toggleMenu}>
          {menuOpen ? <AiOutlineClose size={25} /> : <AiOutlineMenu size={25} />}
        </div>
      </div>

      {/* Mobile Menu */}
      <ResponsiveNavbar isOpen={menuOpen} toggleMenu={toggleMenu} />

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-start justify-center"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-[800px] bg-white h-[50px] flex items-center px-4 mt-20 rounded-full shadow-lg animate-fall"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, danh mục, bài viết..."
              className="w-full border-none outline-none text-gray-700"
            />
          </div>
        </div>
      )}

      {/* Shopping Cart */}
      {cartOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-start justify-end"
          onClick={() => setCartOpen(false)}
        >
          <div
            className="w-[300px] bg-white h-full flex flex-col shadow-lg animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 bg-green-600 text-white">
              <h2 className="font-bold">Shopping Cart</h2>
              <AiOutlineClose
                className="cursor-pointer"
                size={25}
                onClick={() => setCartOpen(false)}
              />
            </div>
            <ShoppingCart cartOpen={cartOpen} toggleCart={toggleCart} />
          </div>
        </div>
      )}

      {/* Crowd Funding Popup */}
      {isCrowdFundingOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={() => setIsCrowdFundingOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Crowd Funding Form"
        >
          <div
            className="bg-white rounded-2xl shadow-lg max-w-5xl w-full mx-4 animate-slide-up"

            onClick={(e) => e.stopPropagation()}
          >
          
            <div className="flex justify-end items-center border-b">
              <AiOutlineClose
                className="cursor-pointer"
                size={25}
                onClick={() => setIsCrowdFundingOpen(false)}
                aria-label="Close Crowd Funding form"

              />
            </div>
            <CrowdfundingSection />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;