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
import CrowdfundingSection from "./CrowdfundingSection";
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
  const [isCrowdFundingOpen, setIsCrowdFundingOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularSearches, setPopularSearches] = useState([]);
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
  const toggleCrowdFunding = () => setIsCrowdFundingOpen(!isCrowdFundingOpen);

  // Load recent searches and popular searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
    
    // Load popular searches (could be from analytics in the future)
    setPopularSearches(['Rau cải', 'Cà chua', 'Dưa leo', 'Cà rốt', 'Khoai tây', 'Rau muống']);
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = (query) => {
    if (!query.trim()) return;
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Search function
  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Handle search selection
  const handleSearchSelect = (item) => {
    saveRecentSearch(searchQuery);
    setSearchOpen(false);
    setSearchQuery("");
    // Navigate to product or category
    if (item.type === 'product') {
      window.location.href = `/san-pham/${item.slug}`;
    } else if (item.type === 'category') {
      window.location.href = `/san-pham?category=${item.slug}`;
    }
  };

  // Keyboard support for search
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && searchOpen) {
        setSearchOpen(false);
        setSearchQuery("");
      }
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen]);

  return (
    <nav
      className={`fixed w-full h-20 z-[9999] transition-all duration-500 ${
        isSticky 
          ? "shadow-xl bg-white/95 backdrop-blur-md border-b border-gray-100" 
          : "bg-white shadow-lg border-b border-gray-100"
      }`}
    >
      <div className="flex justify-between items-center h-full w-full px-4 md:px-16">
        {/* Left Side - Logo */}
        <div className="flex-shrink-0">
          <Link href="/">
            <Image
              src={logo}
              alt="Eco Bắc Giang logo"
              width={150}
              height={45}
              className="cursor-pointer transition-transform duration-300 hover:scale-105"
              priority
              objectFit="contain"
            />
          </Link>
        </div>

        {/* Center - Navigation Links */}
        <div className="hidden lg:flex">
          <ul className="flex items-center space-x-8">
            <li>
              <Link
                href="/"
                className="text-gray-700 uppercase hover:text-green-600 font-heading font-semibold transition-all duration-300 relative group"
              >
                Trang chủ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li
              className="relative group"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <p className="text-gray-700 cursor-pointer uppercase hover:text-green-600 font-heading font-semibold transition-all duration-300 relative">
                Về Eco Bắc Giang
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </p>
              {aboutDropdownOpen && (
                <ul className="absolute top-10 left-0 bg-white rounded-xl shadow-2xl z-[10000] w-72 border border-gray-100 overflow-hidden">
                  <li className="hover:bg-green-50 transition-colors duration-200">
                    <Link href="/gioi-thieu-ecobacgiang" className="block px-6 py-3 text-gray-700 hover:text-green-600">
                      Giới thiệu
                    </Link>
                  </li>
                  <li className="hover:bg-green-50 transition-colors duration-200">
                    <Link href="/tam-nhin-su-menh" className="block px-6 py-3 text-gray-700 hover:text-green-600">
                      Tầm nhìn, Sứ mạng
                    </Link>
                  </li>
                  <li className="hover:bg-green-50 transition-colors duration-200">
                    <Link href="/y-nghia-logo-ecobacgiang" className="block px-6 py-3 text-gray-700 hover:text-green-600">
                      Ý nghĩa Logo
                    </Link>
                  </li>
                  <li className="hover:bg-green-50 transition-colors duration-200">
                    <Link href="/doi-ngu" className="block px-6 py-3 text-gray-700 hover:text-green-600">
                      Đội ngũ
                    </Link>
                  </li>
                  <li className="hover:bg-green-50 transition-colors duration-200">
                    <Link href="/giai-thuong-va-chung-nhan" className="block px-6 py-3 text-gray-700 hover:text-green-600">
                      Giải thưởng & Chứng nhận
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <Link
                href="/bai-viet"
                className="text-gray-700 uppercase hover:text-green-600 font-heading font-semibold transition-all duration-300 relative group"
              >
                Blog sống xanh
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            <li>
              <ProductDropdown />
            </li>
            <li>
              <Link
                href="/lien-he"
                className="text-gray-700 uppercase hover:text-green-600 font-heading font-semibold transition-all duration-300 relative group"
              >
                Liên hệ
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Side - Actions */}
        <div className="hidden lg:flex items-center space-x-3">
          <button
            onClick={toggleCrowdFunding}
            className="bg-green-600 hover:bg-green-700 py-3 font-heading text-white px-6 rounded-full font-semibold uppercase transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            aria-label="Open Crowd Funding form"
          >
            CrowdFunding
          </button>
          <div
            className="bg-white p-3 rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 cursor-pointer transition-all duration-300 transform hover:scale-110 border border-gray-100 relative group"
            onClick={toggleSearch}
            aria-label="Open search"
            title="Tìm kiếm (Ctrl+K)"
          >
            <IoSearch className="text-gray-600 text-lg" />
            {/* Keyboard shortcut hint */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Ctrl+K
            </div>
          </div>
          <div className="relative">
            <div
              className="bg-white p-3 rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 cursor-pointer transition-all duration-300 transform hover:scale-110 border border-gray-100"
              onClick={toggleCart}
              aria-label={`Shopping cart with ${totalQuantity} items`}
            >
              <IoCartOutline className="text-gray-600 text-lg" />
              {totalQuantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full animate-pulse">
                  {totalQuantity}
                </span>
              )}
            </div>
          </div>
          <div className="relative" ref={dropdownRef}>
            <div
              className="cursor-pointer bg-white p-3 rounded-full shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-110 border border-gray-100"
              onClick={toggleUserDropdown}
              role="button"
              aria-expanded={userDropdownOpen}
              aria-controls="user-dropdown"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && toggleUserDropdown()}
            >
              <FaRegUser className="text-gray-600 text-lg" />
            </div>
            <UserDropdown
              userDropdownOpen={userDropdownOpen}
              toggleUserDropdown={toggleUserDropdown}
            />
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center space-x-2">
          <div
            className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={toggleSearch}
            title="Tìm kiếm"
          >
            <IoSearch size={20} className="text-gray-700" />
          </div>
          <div className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors duration-200" onClick={toggleMenu}>
            {menuOpen ? <AiOutlineClose size={25} className="text-gray-700" /> : <AiOutlineMenu size={25} className="text-gray-700" />}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <ResponsiveNavbar isOpen={menuOpen} toggleMenu={toggleMenu} />

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-[10000] flex items-start justify-center"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-[600px] bg-white mt-20 mx-4 rounded-2xl shadow-2xl animate-fall border border-gray-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Header */}
            <div className="flex items-center px-6 py-4 border-b border-gray-100">
              <IoSearch className="text-gray-400 text-xl mr-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm, danh mục, bài viết..."
                className="w-full border-none outline-none text-gray-700 text-lg placeholder-gray-400"
                autoFocus
              />
              {isSearching && (
                <div className="ml-3 animate-spin">
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-green-600 rounded-full"></div>
                </div>
              )}
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery("");
                }}
                className="ml-3 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <AiOutlineClose size={20} className="text-gray-500" />
              </button>
            </div>
            
            {/* Search Results */}
            <div className="max-h-[400px] overflow-y-auto">
              {/* Search Results */}
              {searchQuery.trim() && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    {isSearching ? 'Đang tìm kiếm...' : `Kết quả tìm kiếm (${searchResults.length})`}
                  </h3>
                  {searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleSearchSelect(item)}
                          className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 text-left group"
                        >
                          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3 overflow-hidden">
                            {item.type === 'product' ? (
                              item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-lg">🥬</span>
                              )
                            ) : item.type === 'category' ? (
                              <span className="text-lg">📁</span>
                            ) : (
                              <span className="text-lg">📄</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 truncate">{item.title}</div>
                            <div className="text-sm text-gray-500 truncate">{item.description}</div>
                            {item.type === 'product' && item.price && (
                              <div className="text-sm text-green-600 font-semibold mt-1">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 capitalize ml-2">
                            {item.type === 'product' ? 'Sản phẩm' : item.type === 'category' ? 'Danh mục' : 'Bài viết'}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : !isSearching && (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <IoSearch className="text-gray-400 text-xl" />
                      </div>
                      <p className="text-gray-500 mb-2">Không tìm thấy kết quả cho</p>
                      <p className="text-gray-700 font-medium">&quot;{searchQuery}&quot;</p>
                      <p className="text-sm text-gray-400 mt-2">Thử từ khóa khác hoặc kiểm tra chính tả</p>
                    </div>
                  )}
                </div>
              )}

              {/* Popular Searches */}
              {!searchQuery.trim() && (
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Tìm kiếm phổ biến</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => setSearchQuery(term)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-green-100 hover:text-green-700 transition-colors duration-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
                              {/* Categories */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Danh mục</h3>
                  <div className="space-y-2">
                    {[
                      { name: 'Rau xanh', icon: '🥬', slug: 'rau-xanh' },
                      { name: 'Củ quả', icon: '🥕', slug: 'cu-qua' },
                      { name: 'Trái cây', icon: '🍎', slug: 'trai-cay' },
                      { name: 'Gia vị', icon: '🧄', slug: 'gia-vi' }
                    ].map((category) => (
                      <button
                        key={category.name}
                        onClick={() => {
                          saveRecentSearch(category.name);
                          setSearchOpen(false);
                          setSearchQuery("");
                          window.location.href = `/san-pham?category=${category.slug}`;
                        }}
                        className="w-full flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      >
                        <span className="text-lg mr-3">{category.icon}</span>
                        <span className="text-gray-700">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="px-6 py-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Tìm kiếm gần đây</h3>
                  <div className="space-y-2">
                    {recentSearches.map((term, index) => (
                      <button
                        key={index}
                        onClick={() => setSearchQuery(term)}
                        className="w-full flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      >
                        <IoSearch className="text-gray-400 mr-3" size={16} />
                        <span className="text-gray-700">{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart */}
      {cartOpen && (
        <ShoppingCart toggleCart={toggleCart} />
      )}

      {/* Crowd Funding Popup */}
      {isCrowdFundingOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
          onClick={() => setIsCrowdFundingOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Crowd Funding Form"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 animate-slide-up border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end items-center border-b border-gray-100 p-4">
              <AiOutlineClose
                className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors duration-200"
                size={24}
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