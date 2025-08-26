import React, { useState, useEffect } from "react";

const Intro = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-16 bg-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-300 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      <div className="relative container mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center px-4 py-2 bg-green-600 text-white text-base font-bold rounded-full shadow-lg mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
            Triết Lý Sản Xuất
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-800 mb-4 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Sản Xuất Hữu Cơ{" "}
            <span className="text-green-700">Thuận Tự Nhiên</span>
          </h2>
          <div className={`w-20 h-1 bg-green-600 rounded-full mx-auto transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Organic Principles */}
          <div className={`space-y-4 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-green-700 mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                5 Nguyên Tắc KHÔNG
              </h3>
              
              <div className="space-y-2">
                {[
                  "KHÔNG THUỐC BẢO VỆ THỰC VẬT HOÁ HỌC",
                  "KHÔNG PHÂN BÓN HOÁ HỌC", 
                  "KHÔNG CÂY TRỒNG BIẾN ĐỔI GEN",
                  "KHÔNG CHẤT KÍCH THÍCH SINH TRƯỞNG",
                  "KHÔNG THUỐC DIỆT CỎ"
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-3 p-4 bg-white/70 rounded-xl shadow-base transition-all duration-1000 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                    }`}
                    style={{ transitionDelay: `${900 + index * 100}ms` }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <span className="text-gray-700 font-medium text-base">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`bg-white/80 backdrop-blur-base rounded-2xl p-6 shadow-lg border border-green-100 transition-all duration-1000 delay-1400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <p className="text-gray-700 leading-relaxed">
                Triết lý của chúng tôi bắt nguồn từ sự tôn trọng tự nhiên.{" "}
                <strong className="text-green-700 font-semibold">Eco Bắc Giang</strong> sản xuất các loại rau theo hướng hữu cơ với 5 nguyên tắc KHÔNG, 
                đảm bảo sản phẩm an toàn và chất lượng cao nhất cho người tiêu dùng.
              </p>
            </div>
          </div>

          {/* Right Column - Smart Technology */}
          <div className={`space-y-4 transition-all duration-1000 delay-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Công Nghệ Thông Minh
              </h3>

              <div className="space-y-3">
                {[
                  {
                    title: "Internet Vạn Vật (IoT)",
                    description: "Bên cạnh việc giữ gìn những giá trị truyền thống, Eco Bắc Giang còn là biểu tượng của sự đổi mới. Chúng tôi sử dụng các công nghệ hiện đại như Internet Vạn Vật (IoT) để quản lý và tối ưu hóa nông nghiệp. Các cảm biến được đặt chiến lược trên các cánh đồng để thu thập dữ liệu về độ ẩm, nhiệt độ và dinh dưỡng trong đất."
                  },
                  {
                    title: "Robot Nông Nghiệp",
                    description: "Đặc biệt, Eco Bắc Giang còn phát triển và ứng dụng các giải pháp robot hiện đại trong nông nghiệp. Những robot này được thiết kế để thực hiện các công việc như gieo hạt, thu hoạch và chăm sóc cây trồng với độ chính xác cao, giảm bớt sức lao động thủ công và tăng cường hiệu quả sản xuất."
                  }
                ].map((tech, index) => (
                  <div 
                    key={index}
                    className={`bg-white/70 rounded-xl p-3 shadow-base transition-all duration-1000 ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}
                    style={{ transitionDelay: `${1200 + index * 200}ms` }}
                  >
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                      {tech.title}
                    </h4>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {tech.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
