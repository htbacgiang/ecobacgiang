import React from "react";
import Link from "next/link";
import Image from "next/image";
import img from "../../public/images/menu-banner-1.jpg"
const ProductDropdown = () => {
  return (
    <div className="relative group">
      {/* Trigger Button */}
      <Link href="/san-pham" className="cursor-pointer uppercase text-gray-700 hover:text-green-600 font-heading font-semibold">
        Sản phẩm
      </Link>

      {/* Dropdown Content */}
      <div className="absolute left-1/2 top-full transform -translate-x-1/2 border-t-4 border-green-600 bg-white shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-300 z-50 w-[800px]">
        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Column 1 */}
          <div className="">
            <div className="font-bold mb-4 text-gray-900 bg-gray-100 border-b border-green-500 border-dotted  ">
              <Link href="/">
              <h3 className="p-2">Thực phẩm hữu cơ</h3>
              </Link>
            </div>
            <ul className="space-y-3 pl-2">
              <li>
                <Link href="/gallery" className="hover:text-green-600 py-2">
                  Rau ăn lá
                </Link>
              </li>
              <li>
                <Link href="/gallery-2" className="hover:text-green-600  py-2">
                  Hoa củ quả
                </Link>
              </li>
              <li>
                <Link href="/team" className="hover:text-green-600 py-2">
                  Rau gia vị
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-green-600  py-2">
                  Sản phẩm khô
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
          <div className="font-bold mb-4 text-gray-900 bg-gray-100 border-b border-green-500 border-dotted  ">
              <Link href="/">
              <h3 className="p-2">IoT và Robots</h3>
              </Link>
            </div>
            <ul className="space-y-3 pl-2">
              <li>
                <Link href="/history" className="hover:text-green-600 py-2">
                  Thiết bị IoT
                </Link>
              </li>
              <li>
                <Link href="/coming-soon" className="hover:text-green-600 py-2">
                  Robots
                </Link>
              </li>
              <li>
                <Link href="/appointment" className="hover:text-green-600 py-2">
                  Phần mềm quản lý nông trại
                </Link>
              </li>
              <li>
                <Link href="/google-map" className="hover:text-green-600 py-2">
                  Hệ thống điều khiển tự động
                </Link>
              </li>
           
            </ul>
          </div>

          {/* Column 3 */}
          {/* <div>
          <div className="font-bold mb-4 text-gray-900 bg-gray-100 border-b border-green-500 border-dotted ">
              <Link href="/">
              <h3 className="p-2">Năng lượng tái tạo</h3>
              </Link>
            </div>

            <ul className="space-y-3 pl-2">
              <li>
                <Link href="/shop" className="hover:text-green-600">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/shop-left-sidebar" className="hover:text-green-600">
                  Shop Left Sidebar
                </Link>
              </li>
              <li>
                <Link href="/shop-right-sidebar" className="hover:text-green-600">
                  Shop Right Sidebar
                </Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-green-600">
                  Cart
                </Link>
              </li>
            </ul>
          </div> */}

          {/* Column 4: Image */}
          <div className="flex items-center justify-center">
            <Image
              src={img} // Đường dẫn tới hình ảnh của bạn
              alt="Sản phẩm nổi bật"
              width={200}
              height={200}
              className="rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDropdown;
