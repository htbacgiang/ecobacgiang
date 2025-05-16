import React from "react";

const VisionComponent = () => {
  return (
    <div
      className="relative text-black py-10 md:px-6 px-2"
      style={{
        position: "relative",
        backgroundImage: "url('/images/hoa-van-3.png')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right",
        backgroundSize: "initial",
      }}
    >
      <div className="relative flex flex-col md:flex-row items-center">
        {/* Image Section */}
        <div className="w-full md:w-1/2 mb-6 md:mb-0 md:pr-6 relative">
          <div
            className="rounded-xl overflow-hidden shadow-md"
            style={{
              backgroundColor: "#fff",
              aspectRatio: "4 / 3",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src="/images/tam-nhin.jpg"
              alt="Eco Vision"
              className="object-cover w-full h-full"
            />
          </div>
          {/* Overlay Leaf Image */}
          <img
            src="/images/trai-dat.png"
            alt="Leaf Overlay"
            className="absolute bottom-0 right-[-20px] w-36 h-20 md:w-36 md:h-20 transform"
          />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 md:text-left relative">
        <h2 className="text-2xl font-semibold text-green-500 mb-4">Tầm nhìn</h2>
         
          <p className="text-base mb-6">
            Eco Bắc Giang hướng tới trở thành thương hiệu dẫn đầu trong lĩnh vực{" "}
            <strong className="text-orange-600">nông nghiệp thông minh</strong> và{" "}
            <strong className="text-green-600">sản xuất hữu cơ bền vững</strong> tại Việt Nam. Chúng tôi cam kết phát triển mô hình{" "}
            <strong className="">kinh tế xanh</strong>, tôn trọng quy luật tự nhiên, đồng thời góp phần vào mục tiêu{" "}
            <strong className="text-green-600">Net Zero 2050</strong>.
          </p>
          <p className="text-base mb-4">
            Bằng việc ứng dụng công nghệ hiện đại, chúng tôi mong muốn xây dựng
            một nền nông nghiệp bền vững, hài hòa giữa{" "}
            <strong className="">lợi ích kinh tế</strong>,{" "}
            <strong className="">trách nhiệm xã hội</strong> và{" "}
            <strong className="">bảo vệ môi trường</strong>.
          </p>
          {/* Small illustrative icons */}
          <div className="flex justify-center gap-4 mt-4">
            <img
              src="/images/icon-la.png"
              alt="Icon 1"
              className="w-20 h-20 object-contain"
            />
            <img
              src="/images/icon-la-2.png"
              alt="Icon 2"
              className="w-20 h-20 object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionComponent;
