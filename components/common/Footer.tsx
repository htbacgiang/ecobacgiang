import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaBoxOpen, FaHandHoldingHeart, FaLeaf, FaTruck, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";

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
      title: "Nông nghiệp thông minh",
      description: "Vì một tương lai bền vững",
      icon: <FaBoxOpen className="text-green-600" />,
    },
    {
      title: "Thân thiện môi trường",
      description: "Cam kết phương pháp bền vững",
      icon: <FaHandHoldingHeart className="text-green-600" />,
    },
    {
      title: "Thực phẩm tươi sạch",
      description: "100% hữu cơ tự nhiên",
      icon: <FaLeaf className="text-green-600" />,
    },
    {
      title: "Giao hàng trong ngày",
      description: "Tươi ngon tận nhà",
      icon: <FaTruck className="text-green-600" />,
    },
  ];

  return (
    <div className="bg-white">
      {/* Features Section */}
      <section className="border-b border-gray-100">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 base:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-2xl mb-4 group-hover:bg-green-100 transition-colors duration-300">
                  <div className="text-2xl">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="bg-gradient-to-br from-green-50 to-green-100">
        <div className="container mx-auto max-w-7xl px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-3">
              <Link href="/" className="inline-block">
                <Image
                  src="/logo1.png"
                  alt="Eco Bac Giang Logo"
                  width={140}
                  height={50}
                  className="mb-6"
                />
              </Link>
              <p className="text-gray-700 leading-relaxed text-base">
                Eco Bắc Giang là nền tảng tiên phong trong lĩnh vực nông nghiệp thông minh và sản xuất hữu cơ bền vững tại Việt Nam
              </p>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <FaMapMarkerAlt className="text-white text-base" />
                  </div>
                  <span className="text-gray-700 text-base font-medium">Tân An, Yên Dũng, Bắc Giang</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <FaPhone className="text-white text-base" />
                  </div>
                  <span className="text-gray-700 text-base font-medium">0866.572.271</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <FaEnvelope className="text-white text-base" />
                  </div>
                  <span className="text-gray-700 text-base font-medium">lienhe@ecobacgiang.vn</span>
                </div>
              </div>
{/* 
              <div className="pt-4">
                <Image
                  src="/thongbaoBCT.png"
                  alt="Bộ Công Thương Logo"
                  width={120}
                  height={40}
                  className="opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
              </div> */}
            </div>

            {/* About Us */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-gray-800 border-b-2 border-green-600 pb-2 inline-block">
                Về chúng tôi
              </h4>
              <ul className="space-y-3">
                {[
                  { href: "/about", label: "Về Eco Bắc Giang" },
                  { href: "/blog", label: "Blog sống xanh" },
                  { href: "#", label: "Địa chỉ Maps" },
                  { href: "#", label: "Tuyển Dụng" },
                  { href: "#", label: "FAQ" }
                ].map((item, index) => (
                  <li key={index}>
                    <Link 
                      href={item.href}
                      className="text-gray-700 hover:text-green-600 font-medium text-base transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Support */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-gray-800 border-b-2 border-green-600 pb-2 inline-block">
                Hỗ trợ khách hàng
              </h4>
              <ul className="space-y-3">
                {[
                  "Hướng dẫn đặt hàng",
                  "Chính sách bảo mật", 
                  "Chính sách đổi trả",
                  "Chính sách giao hàng"
                ].map((item, index) => (
                  <li key={index}>
                    <Link 
                      href="#"
                      className="text-gray-700 hover:text-green-600 font-medium text-base transition-colors duration-300 flex items-center group"
                    >
                      <span className="w-2 h-2 bg-green-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Google Maps */}
            <div className="space-y-6">
              <h4 className="text-xl font-bold text-gray-800 border-b-2 border-green-600 pb-2 inline-block">
                Vị trí của chúng tôi
              </h4>
              <div className="w-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3207.660320715124!2d105.83861376595286!3d20.691144069113736!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135cbbd49100805%3A0xf7bd8a83a0cf059c!2zRWNvIELhuq9jIEdpYW5nIC0gTsO0bmcgVHLhuqFpIEjhu691IEPGoQ!5e1!3m2!1svi!2s!4v1755957385053!5m2!1svi!2s" 
                  width="100%" 
                  height="200" 
                  style={{border:0}} 
                  allowFullScreen={true}
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg shadow-md"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-green-200 bg-white">
          <div className="container mx-auto max-w-7xl px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 text-base text-gray-600">
                <span>Vị trí: <span className="font-semibold text-green-600">{location.city}, {location.country}</span></span>
              </div>
              <div className="text-base text-gray-600">
                © 2025 <span className="font-semibold text-green-600">ecobacgiang.vn</span>. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
