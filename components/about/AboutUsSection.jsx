import React from "react";

const AboutUsSection = () => {
  return (
    <section className="relative bg-white py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-50 opacity-50"></div>
      
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Về chúng tôi
              </div>
              
              <h2 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight">
                Chúng tôi tin vào{" "}
                <span className="text-green-600">chất lượng tự nhiên</span>{" "}
                và hữu cơ
              </h2>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Chúng tôi đã đạt được những thành tựu lớn trong việc tạo ra môi
                trường bền vững, vì bầu trời trở nên trong xanh và các vì sao vẫn
                sáng rực. Tất cả được xây dựng dựa trên niềm tin vào tương lai xanh
                cho thế hệ sau.
              </p>
            </div>

            {/* Feature Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src="./images/icon-cay-con.png"
                    alt="Icon cây con"
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Chất lượng 100% tự nhiên
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Các vì sao sáng rực, đánh dấu một tương lai phát triển xanh và
                    bền vững hơn cho mọi người.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button className="inline-flex items-center px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Tìm hiểu thêm
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-6">
              
              {/* Left Column */}
              <div className="space-y-6">
                {/* Quote Card */}
                <div className="bg-green-700 p-6 rounded-2xl shadow-lg">
                  <div className="text-white">
                    <svg className="w-8 h-8 mb-4 text-green-200" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                    <blockquote className="text-lg font-medium italic mb-4">
                    &quot;Thực phẩm hữu cơ thực sự rất tốt cho cơ thể của con người&quot;
                    </blockquote>
                    <p className="text-green-100 font-semibold">- Daniel Nirob</p>
                  </div>
                </div>
                
                {/* Image 1 */}
                <div className="relative group">
                  <img
                    src="/images/2.jpg"
                    alt="Người làm nông"
                    className="w-full h-48 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-300"></div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Image 2 */}
                <div className="relative group">
                  <img
                    src="/images/nong-dan-ecobacgiang.jpg"
                    alt="Nông dân làm việc"
                    className="w-full h-48 object-cover rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-300"></div>
                </div>
                
                {/* Stats Card */}
                <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">15+</div>
                    <div className="text-gray-600 font-medium">Năm kinh nghiệm</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Organic Badge - Centered and overlaying images */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="bg-white border-4 border-green-600 rounded-full p-4 shadow-xl">
                <img
                  src="/images/logooarganic.png"
                  alt="Logo 100% Hữu cơ"
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
