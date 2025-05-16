import React from "react";

const AboutUsSection = () => {
  return (
    <section
      className="relative bg-gray-100 py-12 overflow-hidden"
      style={{
        backgroundImage: `url('/images/background-pattern.jpg')`, // Đường dẫn đến ảnh họa tiết
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.8, // Độ mờ để giữ họa tiết chìm
      }}
    >
      <div className="absolute inset-0 bg-white bg-opacity-80"></div>
      <div className="container mx-auto px-6 lg:px-20 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Text Section */}
        <div>
          <h3 className="text-green-600 font-semibold mb-3 text-center md:text-left">
            Về chúng tôi
          </h3>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight text-center md:text-left">
            Chúng tôi tin vào chất lượng tự nhiên và hữu cơ
          </h2>
          <p className="text-gray-600 mt-4 text-center md:text-left">
            Chúng tôi đã đạt được những thành tựu lớn trong việc tạo ra môi
            trường bền vững, vì bầu trời trở nên trong xanh và các vì sao vẫn
            sáng rực. Tất cả được xây dựng dựa trên niềm tin vào tương lai xanh
            cho thế hệ sau.
          </p>
          <div className="flex items-center mt-6 space-x-4 justify-center md:justify-start">
            <div className="flex items-center">
              <span className=" text-white p-2 rounded-full">
              
              <img
                  src="./images/icon-cay-con.png"
                  alt="icon cây con"
                  className="w-24"
                />
              </span>
              <p>
                <strong className="text-gray-800">Chất lượng 100% tự nhiên</strong>
                <br />
                <span className="text-gray-600">
                  Các vì sao sáng rực, đánh dấu một tương lai phát triển xanh và
                  bền vững hơn.
                </span>
              </p>
            </div>
          </div>
          <div className="flex justify-center md:justify-start">
            <button className="mt-6 bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700">
              Tìm hiểu thêm
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="flex flex-col space-y-4">
              <div className="bg-green-700 p-4 shadow-md rounded-tl-2xl rounded-br-2xl">

                <blockquote className="text-white italic">
                &quot;Thực phẩm hữu cơ thực sự rất tốt cho cơ thể của con người&quot;
                </blockquote>
                <p className="text-white mt-2 text-right">- Daniel Nirob</p>
              </div>
              <img
                src="/images/2.jpg"
                alt="Người làm nông"
                className="rounded-lg shadow w-full object-cover"
              />
            </div>

            {/* Right Column */}
            <div className="relative">
              <img
                src="/images/nong-dan-ecobacgiang.jpg"
                alt="Nông dân làm việc"
                className="rounded-lg shadow w-full object-cover"
              />
            </div>
          </div>

          {/* 100% Organic Logo */}
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <img
              src="/images/logooarganic.png" // Cập nhật đường dẫn logo sau khi có
              alt="Logo 100% Hữu cơ"
              className="md:w-32 md:h-32 h-20 w-20 object-contain bg-white opacity-80 rounded-full shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
