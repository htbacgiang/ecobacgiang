import React, { useState, useEffect } from "react";
import Head from "next/head";
import DefaultLayout from "../../components/layout/DefaultLayout";
import CoreValues from "../../components/about/CoreValues";
import VisionComponent from "../../components/about/VisionComponent";

const VisionMissionCoreValues = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <DefaultLayout>
      <Head>
        <title>Tầm nhìn - Sứ mệnh - Giá trị cốt lõi | Eco Bắc Giang</title>
        <meta
          name="description"
          content="Khám phá tầm nhìn, sứ mệnh và giá trị cốt lõi của Eco Bắc Giang, thương hiệu hàng đầu trong lĩnh vực nông nghiệp thông minh và sản xuất hữu cơ bền vững tại Việt Nam."
        />
        <meta
          name="keywords"
          content="Eco Bắc Giang, nông nghiệp thông minh, sản xuất hữu cơ, kinh tế xanh, Net Zero 2050, bảo vệ môi trường, trách nhiệm xã hội, IoT nông nghiệp"
        />
        <meta name="author" content="Eco Bắc Giang" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content="Tầm nhìn - Sứ mệnh - Giá trị cốt lõi | Eco Bắc Giang"
        />
        <meta
          property="og:description"
          content="Khám phá tầm nhìn, sứ mệnh và giá trị cốt lõi của Eco Bắc Giang, thương hiệu hàng đầu trong lĩnh vực nông nghiệp thông minh và sản xuất hữu cơ bền vững tại Việt Nam."
        />
        <meta property="og:image" content="/images/slide.jpg" />
        <meta property="og:url" content="https://www.ecobacgiang.vn" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* Header Spacer */}
      <div className="h-[80px] bg-gradient-to-r from-green-50 to-green-100"></div>

      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-xl"></div>
        </div>

        <div className="relative container mx-auto max-w-7xl px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-full shadow-lg mb-6 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              Định Hướng Phát Triển
            </div>
            <h1 className={`text-xl md:text-3xl font-bold text-gray-800 mb-3 transition-all duration-1000 delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Tầm Nhìn - Sứ Mệnh -{" "}
              <span className="text-green-600">Giá Trị Cốt Lõi</span>
            </h1>
            <div className={`w-20 h-1 bg-green-600 rounded-full mx-auto mb-6 transition-all duration-1000 delay-500 ${
              isLoaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}></div>
            <p className={`text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-700 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Khám phá những giá trị và định hướng phát triển của Eco Bắc Giang, 
              thương hiệu hàng đầu trong lĩnh vực nông nghiệp thông minh và sản xuất hữu cơ bền vững tại Việt Nam.
            </p>
          </div>

          {/* Vision Component */}
          <div className={`mb-16 transition-all duration-1000 delay-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <VisionComponent />
          </div>

          {/* Mission Section */}
          <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-100 overflow-hidden mb-16 transition-all duration-1000 delay-1200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <div className="p-8 lg:p-12">
              <div className="text-center mb-12">
                <h2 className={`text-xl md:text-3xl font-bold text-gray-800 mb-4 transition-all duration-1000 delay-1400 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  Sứ <span className="text-green-600">Mệnh</span>
                </h2>
                <div className={`w-16 h-1 bg-green-600 rounded-full mx-auto mb-6 transition-all duration-1000 delay-1600 ${
                  isLoaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                }`}></div>
                <p className={`text-lg text-gray-600 max-w-2xl mx-auto transition-all duration-1000 delay-1800 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}>
                  Chúng tôi cam kết thực hiện những sứ mệnh quan trọng để xây dựng tương lai nông nghiệp bền vững
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Mission Content */}
                <div className="space-y-6">
                  {[
                    {
                      title: "Sản xuất hữu cơ chất lượng cao",
                      description: "Cung cấp các loại rau củ hữu cơ sạch, an toàn, đảm bảo tiêu chuẩn quốc tế và bảo vệ tài nguyên thiên nhiên."
                    },
                    {
                      title: "Thuận tự nhiên",
                      description: "Địa phương canh tác được quy hoạch theo quy luật tự nhiên, giảm thiểu tác động xấu đến môi trường và tôn trọng sự cân bằng sinh thái."
                    },
                    {
                      title: "Ứng dụng công nghệ thông minh",
                      description: "Phát triển và triển khai các giải pháp IoT, hệ thống tự động hóa và robot để tối ưu hóa quy trình sản xuất, tiết kiệm tài nguyên và nâng cao hiệu quả."
                    },
                    {
                      title: "Phát triển kinh tế xanh",
                      description: "Thực hiện nguyên tắc ESG (Môi trường, Xã hội và Quản trị), góp phần đối phó biến đổi khí hậu và tăng cường trách nhiệm xã hội."
                    },
                    {
                      title: "Hỗ trợ cộng đồng nông nghiệp",
                      description: "Đồng hành cùng nông dân và các doanh nghiệp nhỏ trong chuyển đổi từ sản xuất truyền thống sang nông nghiệp thông minh, tăng thu nhập và giảm thiểu rủi ro."
                    }
                  ].map((mission, index) => (
                    <div 
                      key={index} 
                      className={`flex items-start space-x-4 p-6 bg-green-50/50 rounded-2xl hover:bg-green-50 transition-all duration-300 group ${
                        isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                      }`}
                      style={{ transitionDelay: `${2000 + index * 200}ms` }}
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{mission.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{mission.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mission Image */}
                <div className={`relative transition-all duration-1000 delay-2000 ${
                  isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent z-10"></div>
                    <img
                      src="/images/esg-ecobacgiang.jpg"
                      alt="Sứ mệnh của Eco Bắc Giang"
                      className="w-full h-auto rounded-2xl"
                    />
                    
                    {/* Overlay Content */}
                    <div className="absolute bottom-6 left-6 right-6 z-20">
                      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                        <h3 className="text-lg font-bold text-green-700 mb-2">
                          ESG Framework
                        </h3>
                        <p className="text-gray-700 text-sm">
                          Môi trường - Xã hội - Quản trị
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Values Section */}
          <div className={`mb-16 transition-all duration-1000 delay-3000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <CoreValues />
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default VisionMissionCoreValues;
