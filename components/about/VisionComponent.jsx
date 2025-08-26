import React, { useState, useEffect } from "react";

const VisionComponent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-100 overflow-hidden">
      <div className="p-8 lg:p-12">
        <div className="text-center mb-12">
          <h2 className={`text-xl md:text-3xl font-bold text-gray-800 mb-4 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Tầm <span className="text-green-600">Nhìn</span>
          </h2>
          <div className={`w-16 h-1 bg-green-600 rounded-full mx-auto mb-6 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}></div>
          <p className={`text-lg text-gray-600 max-w-2xl mx-auto transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Định hướng phát triển tương lai của Eco Bắc Giang trong lĩnh vực nông nghiệp thông minh và bền vững
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Section */}
          <div className={`relative transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent z-10"></div>
              <img
                src="/images/tam-nhin.jpg"
                alt="Tầm nhìn Eco Bắc Giang"
                className="w-full h-auto object-cover rounded-2xl"
              />
              
              {/* Overlay Content */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20">
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-green-700 mb-1">
                      Tương Lai Xanh
                    </h3>
                    <div className="w-8 h-0.5 bg-green-500 rounded-full mx-auto mb-1"></div>
                    <p className="text-gray-700 text-sm">
                      Hướng tới Net Zero 2050
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            {[
              {
                title: "Thương Hiệu Dẫn Đầu",
                content: "Eco Bắc Giang hướng tới trở thành thương hiệu dẫn đầu trong lĩnh vực nông nghiệp thông minh và sản xuất hữu cơ bền vững tại Việt Nam."
              },
              {
                title: "Kinh Tế Xanh",
                content: "Chúng tôi cam kết phát triển mô hình kinh tế xanh, tôn trọng quy luật tự nhiên, đồng thời góp phần vào mục tiêu Net Zero 2050."
              },
              {
                title: "Nông Nghiệp Bền Vững",
                content: "Bằng việc ứng dụng công nghệ hiện đại, chúng tôi mong muốn xây dựng một nền nông nghiệp bền vững, hài hòa giữa lợi ích kinh tế, trách nhiệm xã hội và bảo vệ môi trường."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className={`bg-green-50/50 rounded-2xl p-6 border border-green-100 transition-all duration-1000 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}
                style={{ transitionDelay: `${900 + index * 200}ms` }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  {item.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionComponent;
