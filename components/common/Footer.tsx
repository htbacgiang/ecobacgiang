import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBoxOpen, FaHandHoldingHeart, FaLeaf, FaTruck } from "react-icons/fa";

const Footer = () => {
  const [location, setLocation] = useState({ ip: "", city: "", country: "" });
  useEffect(() => {
    fetch("/api/location")
      .then((res) => res.json())
      .then((data) => setLocation(data))
      .catch(() => setLocation({ ip: "Không xác định", city: "N/A", country: "N/A" }));
  }, []);


  const features = [
    {
      title: "Nông nghiệp thông minh – Vì một tương lai bền vững",
      description: "Mỗi sản phẩm đều là kết quả của sự sáng tạo và nỗ lực trong việc cải tiến kỹ thuật canh tác, để mang lại sản phẩm chất lượng nhất",
      icon: <FaBoxOpen className="text-green-500 text-4xl" />,
    },
    {
      title: "Thân thiện với môi trường",
      description: "Chúng tôi cam kết phương pháp canh tác bền vững, bảo vệ môi trường.",
      icon: <FaHandHoldingHeart className="text-green-500 text-4xl" />,
    },
    {
      title: "Thực phẩm tươi sạch",
      description: "100% tươi ngon, tự nhiên và hữu cơ. Đảm bảo hài lòng",
      icon: <FaLeaf className="text-green-500 text-4xl" />,
    },
    {
      title: "Giao hàng trong ngày",
      description: "Rau củ hữu cơ tươi ngon được giao tận nhà ngay trong ngày đặt hàng.",
      icon: <FaTruck className="text-green-500 text-4xl" />,
    },
  ];

  return (
    <div>
      {/* Features Section */}
      <div className="bg-white p-8 items-center justify-center">
        <div className="max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 ">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`flex items-start space-x-4 text-left border-r-0 md:border-r ${index === features.length - 1 ? "lg:border-r-0" : "lg:border-r border-gray-300"
                }`}
            >
              <div>{feature.icon}</div>
              <div>
                <h3 className="text-lg font-bold">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#f9f9f9] pt-10 pb-20 md:pb-10">
        <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-5 md:pl-1 pl-5">
          {/* Cột Logo và địa chỉ */}
          <div className="flex flex-col items-start ">
            <Link href="/">
              <Image
                src="/logo1.png" // Đường dẫn logo (trong thư mục public)
                alt="Eco Bac Giang Logo"
                width={120} // Chiều rộng logo
                height={40} // Chiều cao logo
                className="mb-4"
              />
            </Link>
            <p className="text-sm text-gray-600 mb-4">
              Eco Bắc Giang là nền tảng tiên phong trong lĩnh vực nông nghiệp thông minh và sản xuất hữu cơ bền vững tại Việt Nam
            </p>
            <p className="text-sm text-gray-600 mb-2 font-semibold">
              📍Tân An, Yên Dũng, Bắc Giang
            </p>
            <p className="text-sm text-gray-600 mb-2 font-semibold">
              📞 0866.572.271
            </p>
            <p className="text-sm text-gray-600 font-semibold">
              📧 lienhe@ecobacgiang.vn
            </p>
            <Link href="/">
              <Image
                src="/thongbaoBCT.png" // Đường dẫn logo Bộ Công Thương
                alt="Bộ Công Thương Logo"
                width={120}
                height={40}
                className="mt-4"
              />
            </Link>
          </div>

          {/* Cột Company */}
          <div className="flex flex-col items-start">
            <h4 className="text-lg font-semibold mb-4 cursor-pointer">
              Về chúng tôi
            </h4>
            <ul className="text-sm text-gray-600 space-y-2 font-semibold">
              <li className="hover:text-green-500 hover:translate-x-2 transition-all duration-300 cursor-pointer">
                <Link href="/about">Về Eco Bắc Giang</Link>
              </li>
              <li className="hover:text-green-500 hover:translate-x-2 transition-all duration-300 cursor-pointer">
                <Link href="/blog">Blog sống xanh</Link>
              </li>
              <li className="hover:text-green-500 hover:translate-x-2 transition-all duration-300 cursor-pointer">
                Địa chỉ Maps
              </li>
              <li className="hover:text-green-500 hover:translate-x-2 transition-all duration-300 cursor-pointer">
                Tuyển Dụng
              </li>
              <li className="hover:text-green-500 hover:translate-x-2 transition-all duration-300 cursor-pointer">
                FAQ
              </li>
            </ul>
          </div>

          {/* Cột Services */}
          <div className="flex flex-col items-start">
            <h4 className="text-lg font-semibold mb-4">Hỗ trợ khách hàng</h4>
            <ul className="text-sm text-gray-600 space-y-2 font-semibold">
              <li className="hover:text-green-500 hover:translate-x-2 transition-all duration-300 cursor-pointer">
                Hướng dẫn đặt hàng
              </li>
              <li className="hover:text-green-500 hover:translate-x-2 transition-all duration-300 cursor-pointer">
                Chính sách bảo mật
              </li>
              <li className="hover:text-green-500 hover:translate-x-2 transition-all duration-300 cursor-pointer">
                Chính sách bảo mật
              </li>
              <li className="hover:text-green-500 hover:translate-x-2 transition-all duration-300 cursor-pointer">
                Chính sách giao hàng
              </li>
            </ul>
          </div>


        </div>

        {/* Footer bản quyền */}
        {/* Footer bản quyền */}
        <div className="flex flex-col md:flex-row justify-center items-center text-gray-600 text-sm gap-3 p-2">
          <p>Vị trí: <span className="font-bold">{location.city}, {location.country}</span></p>
          <p>© 2025 ecobacgiang.vn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
