import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import img1 from "../../../public/images/menu-banner-1.jpg";
import img2 from "../../../public/images/menu-banner-4.png";

const ProductDropdown = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const images = [
    { src: img1, alt: "Sản phẩm nổi bật 1", title: "Thực phẩm hữu cơ", desc: "Tươi ngon, an toàn" },
    { src: img2, alt: "Sản phẩm nổi bật 2", title: "IoT và Robots", desc: "Công nghệ hiện đại" },
  ];

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative group">
      {/* Trigger Button */}
      <Link 
        href="/san-pham" 
        className="cursor-pointer uppercase text-gray-700 hover:text-green-600 font-heading font-semibold transition-all duration-300 relative group"
      >
        Sản phẩm
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all duration-300 group-hover:w-full"></span>
      </Link>

      {/* Dropdown Content */}
      <div className="absolute left-1/2 top-full transform -translate-x-1/2 bg-white shadow-2xl rounded-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 z-50 w-[900px] border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-3 gap-8 p-8">
          {/* Column 1 */}
          <div className="space-y-4">
            <div className="font-bold text-lg text-gray-900 bg-green-50 border-l-4 border-green-600 rounded-r-lg">
              <Link href="/san-pham">
                <h3 className="p-4 text-green-800 hover:text-green-600 transition-colors duration-200">
                  Thực phẩm hữu cơ
                </h3>
              </Link>
            </div>
            <ul className="space-y-3 pl-4">
              <li className="hover:text-green-600 cursor-pointer transition-all duration-200 hover:translate-x-2 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                Rau ăn lá
              </li>
              <li className="hover:text-green-600 cursor-pointer transition-all duration-200 hover:translate-x-2 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                Hoa củ quả
              </li>
              <li className="hover:text-green-600 cursor-pointer transition-all duration-200 hover:translate-x-2 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                Rau gia vị
              </li>
              <li className="hover:text-green-600 cursor-pointer transition-all duration-200 hover:translate-x-2 flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                Sản phẩm khô
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="space-y-4">
            <div className="font-bold text-lg text-gray-900 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
              <Link href="/">
                <h3 className="p-4 text-blue-800 hover:text-blue-600 transition-colors duration-200">
                  IoT và Robots
                </h3>
              </Link>
            </div>
            <ul className="space-y-3 pl-4">
              <li className="hover:text-blue-600 cursor-pointer transition-all duration-200 hover:translate-x-2 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                Thiết bị IoT
              </li>
              <li className="hover:text-blue-600 cursor-pointer transition-all duration-200 hover:translate-x-2 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                Robots
              </li>
              <li className="hover:text-blue-600 cursor-pointer transition-all duration-200 hover:translate-x-2 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                Phần mềm quản lý nông trại
              </li>
              <li className="hover:text-blue-600 cursor-pointer transition-all duration-200 hover:translate-x-2 flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
                Hệ thống điều khiển tự động
              </li>
            </ul>
          </div>

          {/* Column 3: Image Slider */}
          <div className="flex items-center justify-center">
            <div className="relative w-full h-[250px] rounded-xl overflow-hidden group/slider">
              {/* Images */}
              <div className="relative w-full h-full">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                      index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover rounded-xl"
                    />
                    <div className="absolute mx-auto justify-center items-center inset-0 bg-black/30 rounded-xl"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h4 className="font-semibold text-sm mb-1">{image.title}</h4>
                      <p className="text-xs text-gray-200">{image.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10"
                aria-label="Previous image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300 z-10"
                aria-label="Next image"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDropdown;
