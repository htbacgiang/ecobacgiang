import React, { useState, useEffect } from "react";

const BusinessPhilosophy = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-16 bg-gradient-to-br from-green-50 to-green-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-10 left-10 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>

      <div className="relative container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className="space-y-8">
            {/* Section Badge */}
            <div className={`inline-flex items-center px-4 py-2 bg-green-600 text-white text-base font-bold rounded-full shadow-lg transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              Chiến Lược Phát Triển
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h2 className={`text-3xl md:text-4xl font-bold text-gray-800 leading-tight transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                Định Hướng{" "}
                <span className="text-green-700">Chuyển Đổi Kép</span>
              </h2>
              <div className={`w-20 h-1 bg-green-600 rounded-full transition-all duration-1000 delay-500 ${
                isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
              }`}></div>
            </div>

            {/* Description */}
            <div className="space-y-6">
              <p className={`text-lg text-gray-700 leading-relaxed transition-all duration-1000 delay-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                Một trong những chiến lược quan trọng của{" "}
                <strong className="text-green-700 font-semibold">Eco Bắc Giang</strong> là chuyển đổi kép, 
                bao gồm{" "}
                <span className="text-green-700 font-semibold uppercase">chuyển đổi số</span> và{" "}
                <span className="text-green-700 font-semibold uppercase">chuyển đổi xanh</span>.
              </p>

              {/* Features */}
              <div className="space-y-4">
                {[
                  {
                    title: "Nâng Cao Hiệu Quả",
                    description: "Việc áp dụng chiến lược này không chỉ giúp chúng tôi nâng cao năng suất và hiệu quả kinh tế, mà còn đảm bảo bảo vệ môi trường, nâng cao chất lượng cuộc sống và góp phần vào mục tiêu phát triển bền vững của quốc gia."
                  },
                  {
                    title: "Công Nghệ Tiên Tiến",
                    description: "Chuyển đổi số cho phép tối ưu hóa các quy trình sản xuất qua việc sử dụng dữ liệu và công nghệ IoT, Robots… trong khi chuyển đổi xanh nhấn mạnh vào việc sử dụng các phương pháp sản xuất thân thiện với môi trường."
                  }
                ].map((feature, index) => (
                  <div 
                    key={index}
                    className={`flex items-start space-x-4 p-6 bg-white/70 backdrop-blur-base rounded-xl shadow-lg transition-all duration-1000 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                    }`}
                    style={{ transitionDelay: `${900 + index * 200}ms` }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-base leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image Section */}
          <div className={`relative transition-all duration-1000 delay-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent z-10"></div>
              <img
                src="/images/tam-nhin.jpg"
                alt="Tầm nhìn Eco Bắc Giang"
                className="w-full h-96 object-cover rounded-2xl"
              />
              
              {/* Overlay Content */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="bg-white/90 backdrop-blur-base rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-bold text-green-700 mb-2">
                    Tầm Nhìn 2050
                  </h3>
                  <p className="text-gray-700 text-base">
                    Hướng tới mục tiêu Net Zero và phát triển bền vững
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessPhilosophy;
