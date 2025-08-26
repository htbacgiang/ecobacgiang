import React, { useState, useEffect } from "react";

const QualityPolicy = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

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
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center px-4 py-2 bg-green-600 text-white text-base font-bold rounded-full shadow-lg mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
            Tầm Nhìn & Sứ Mệnh
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold text-gray-800 mb-4 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Tương Lai Và{" "}
            <span className="text-green-700">Sứ Mệnh</span>
          </h2>
          <div className={`w-20 h-1 bg-green-600 rounded-full mx-auto mb-6 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}></div>
          <p className={`text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Eco Bắc Giang không chỉ dừng lại ở việc sản xuất thực phẩm hữu cơ mà còn mong muốn tạo nên sự thay đổi lớn hơn.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Section */}
          <div className={`space-y-8 transition-all duration-1000 delay-900 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}>
            {/* Mission Cards */}
            <div className="space-y-6">
              {[
                {
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  ),
                  title: "Cam Kết Đồng Hành",
                  description: "Chúng tôi cam kết đồng hành cùng nông dân, đối tác và khách hàng trong hành trình xây dựng một nền nông nghiệp bền vững. Eco Bắc Giang luôn lắng nghe và đáp ứng nhu cầu của thị trường, mang lại những giá trị vượt trội cho người tiêu dùng và xã hội."
                },
                {
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                    </svg>
                  ),
                  title: "Tầm Nhìn Toàn Cầu",
                  description: "Tầm nhìn của chúng tôi là biến Eco Bắc Giang thành ngọn hải đăng trong ngành nông nghiệp thông minh, không chỉ tại Việt Nam mà còn trên trường quốc tế. Chúng tôi tin rằng, với sự hỗ trợ từ cộng đồng và sự cống hiến không ngừng nghỉ, một tương lai xanh, thịnh vượng và bền vững đang chờ đón."
                },
                {
                  icon: (
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ),
                  title: "Kiến Tạo Tương Lai",
                  description: "Hãy cùng chúng tôi chung tay kiến tạo một tương lai nơi con người và thiên nhiên cùng phát triển, nơi mỗi sản phẩm không chỉ là thực phẩm mà còn là lời cam kết với một thế giới tốt đẹp hơn."
                }
              ].map((mission, index) => (
                <div 
                  key={index}
                  className={`bg-white/80 backdrop-blur-base rounded-2xl p-8 shadow-lg border border-green-100 transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}
                  style={{ transitionDelay: `${1100 + index * 200}ms` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      {mission.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{mission.title}</h3>
                      <p className="text-gray-700 leading-relaxed">{mission.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className={`bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-center text-black shadow-lg transition-all duration-1000 delay-1700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <h3 className="text-xl font-bold mb-2">Hãy Cùng Chúng Tôi</h3>
              <p className="text-green-500">
                Xây dựng tương lai nông nghiệp bền vững cho Việt Nam
              </p>
            </div>
          </div>

          {/* Image Section */}
          <div className={`relative transition-all duration-1000 delay-1200 ${
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
                    Tương Lai Xanh
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

export default QualityPolicy;
