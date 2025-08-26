// components/tantruonggiang/AboutNavigation.js
import Image from "next/image";
import { useState } from "react";

export default function AboutNavigation() {
  // State to track the active menu item
  const [activeItem, setActiveItem] = useState("Triết Lý Kinh Doanh");

  // Updated menu items data
  const menuItems = [
    {
      title: "Triết Lý Kinh Doanh",
      description:
        "GreenLa Home mang đến giải pháp nội thất hiện đại, sáng tạo, ứng dụng công nghệ AI, tạo không gian sống và làm việc lý tưởng.",
    },
    {
      title: "Tầm Nhìn",
      description:
        "Trở thành doanh nghiệp hàng đầu trong thiết kế, thi công nội thất hiện đại tại Việt Nam, đổi mới sáng tạo, nâng cao giá trị sống và phát triển bền vững.",
    },
    {
      title: "Sứ Mệnh",
      description:
        "Cung cấp giải pháp nội thất hiện đại, ứng dụng AI, xây dựng môi trường làm việc chuyên nghiệp, đóng góp cho sự phát triển bền vững của cộng đồng.",
    },
    {
      title: "Giá Trị Cốt Lõi",
      description:
        "Chất lượng, uy tín, sáng tạo, trách nhiệm xã hội, và hợp tác phát triển bền vững.",
    },
  ];

  return (
    <section className="relative h-[600px] md:h-[700px] bg-gray-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/banner5.png"
          alt="About Navigation Background"
          layout="fill"
          objectFit="cover"
          className="brightness-75"
        />
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        {/* Left Navigation Menu */}
        <div className="w-full md:w-2/4 space-y-4">
          {menuItems.map((item) => (
            <div
              key={item.title}
              onClick={() => setActiveItem(item.title)}
              className={`cursor-pointer p-4 rounded-lg transition-all duration-300 ${
                activeItem === item.title
                  ? "bg-orange-500 bg-opacity-20 border-l-4 border-orange-500"
                  : "hover:bg-gray-800"
              }`}
            >
              <h3
                className={`text-lg font-bold uppercase tracking-widest mb-2 ${
                  activeItem === item.title ? "text-orange-500" : "text-white"
                }`}
              >
                {item.title}
              </h3>
              <p
                className={`text-base  ${
                  activeItem === item.title ? "text-white" : "text-gray-300"
                }`}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>

     
      </div>
    </section>
  );
}