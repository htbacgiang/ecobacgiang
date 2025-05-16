import React from "react";

const BusinessPhilosophy = () => {
  return (
    <div className="w-full relative flex items-center h-[600px] bg-green-800 mt-5 md:p-0 p-2">
      {/* Hình nền */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/tam-nhin.jpg')", // Đường dẫn ảnh của bạn
          backgroundSize: "cover",
          backgroundPosition: "right",
        }}
      ></div>

      {/* Phần nội dung */}
      <div
        className="relative z-10 bg-green-700  p-8 md:p-12 rounded-tl-3xl rounded-br-3xl shadow-lg max-w-2xl"
        style={{
          backgroundImage: "url('/images/2859254.png')", // Đường dẫn ảnh của bạn
          backgroundSize: "cover",
        }}
      >
        <h2 className="text-2xl md:text-2xl font-bold text-white mb-4">
          Định Hướng Chuyển Đổi Kép
        </h2>
        <p className="text-yellow-300 font-semibold mb-6">
          Một trong những chiến lược quan trọng của Eco Bắc Giang là chuyển đổi
          kép, bao gồm <span className="uppercase">chuyển đổi số</span> và <span className="uppercase">chuyển đổi xanh</span>.
        </p>{" "}
        <ul className="space-y-4 text-white">
          <li className="flex items-start">
            <p>
            Việc áp dụng chiến lược này không chỉ giúp chúng tôi nâng cao năng suất và hiệu quả kinh tế, mà còn đảm bảo bảo vệ môi trường, nâng cao chất lượng cuộc sống và góp phần vào mục tiêu phát triển bền vững của quốc gia. 
            </p>
          </li>
          <li className="flex items-start">
            <p>
            Chuyển đổi số cho phép tối ưu hóa các quy trình sản xuất qua việc sử dụng dữ liệu và công nghệ IoT, Robots… trong khi chuyển đổi xanh nhấn mạnh vào việc sử dụng các phương pháp sản xuất thân thiện với môi trường.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BusinessPhilosophy;
