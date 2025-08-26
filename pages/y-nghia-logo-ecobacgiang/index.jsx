import React, { useState, useEffect } from "react";
import Head from "next/head";
import DefaultLayout from "../../components/layout/DefaultLayout";

const LogoMeaning = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <DefaultLayout>
      <Head>
        <title>Ý nghĩa logo Eco Bắc Giang | Eco Bắc Giang</title>
        <meta
          name="description"
          content="Khám phá ý nghĩa logo của Eco Bắc Giang - biểu tượng kết hợp giữa nông nghiệp hữu cơ và công nghệ cao, hướng đến phát triển bền vững."
        />
        <meta
          name="keywords"
          content="Eco Bắc Giang, ý nghĩa logo, nông nghiệp công nghệ cao, sản xuất hữu cơ, phát triển bền vững"
        />
        <meta name="author" content="Eco Bắc Giang" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content="Ý nghĩa logo Eco Bắc Giang | Eco Bắc Giang"
        />
        <meta
          property="og:description"
          content="Khám phá ý nghĩa logo của Eco Bắc Giang - biểu tượng kết hợp giữa nông nghiệp hữu cơ và công nghệ cao, hướng đến phát triển bền vững."
        />
        <meta property="og:image" content="/images/logo-meaning.jpg" />
        <meta
          property="og:url"
          content="https://www.ecobacgiang.vn/logo-meaning"
        />
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
          <div className="text-center mb-4">
            <div className={`inline-flex items-center px-4 py-2 bg-green-600 text-white text-base font-bold rounded-full shadow-lg mb-6 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              Biểu Tượng Thương Hiệu
            </div>
            <h1 className={`text-xl md:text-3xl font-bold text-gray-800 mb-6 transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Ý Nghĩa <span className="text-green-600">Logo</span> Eco Bắc Giang
            </h1>
            <div className={`w-20 h-1 bg-green-600 rounded-full mx-auto mb-2 transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}></div>
            <p className={`text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              Khám phá ý nghĩa sâu sắc đằng sau biểu tượng kết hợp hoàn hảo giữa nông nghiệp hữu cơ và công nghệ cao
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-4 bg-white">
        <div className="container mx-auto max-w-7xl px-2">
          {/* Giới thiệu */}
          <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-100 overflow-hidden mb-16 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <div className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  <span className="text-green-600">Giới Thiệu</span>
                </h2>
                <div className="w-16 h-1 bg-green-600 rounded-full mx-auto mb-6"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    Logo của Eco Bắc Giang không chỉ là biểu tượng đại diện cho một thương
                    hiệu, mà còn mang trong mình một thông điệp sâu sắc về sự kết hợp giữa
                    nông nghiệp hữu cơ và công nghệ cao. Đây là một thiết kế tinh tế, phản
                    ánh rõ ràng tầm nhìn chiến lược và sứ mệnh phát triển bền vững của dự
                    án tại Bắc Giang – một vùng đất có tiềm năng nông nghiệp lớn.
                  </p>
                </div>
                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden ">
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent z-10"></div>
                    <img
                      src="/images/logo-eco-bac-giang.png"
                      alt="Logo Eco Bắc Giang"
                      className="w-full h-auto object-cover rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ý nghĩa và thông điệp chính */}
          <div className={`bg-gradient-to-br from-green-50 to-green-100 rounded-3xl shadow-2xl border border-green-100 overflow-hidden mb-16 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <div className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Ý Nghĩa Và <span className="text-green-600">Thông Điệp</span>
                </h2>
                <div className="w-16 h-1 bg-green-600 rounded-full mx-auto mb-6"></div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  <strong className="text-green-600 text-xl">&quot;Agriculture of Thinks&quot;</strong> Cụm từ này nhấn mạnh vào tư
                  duy sáng tạo và đổi mới trong nông nghiệp. Không còn dừng lại ở việc
                  canh tác truyền thống, dự án Eco Bắc Giang tập trung vào việc áp dụng
                  các giải pháp công nghệ như trí tuệ nhân tạo (AI), IoT, và robot để
                  cải thiện hiệu quả sản xuất và quản lý nông trại. Từ &ldquo;Thinks&rdquo; là điểm
                  nhấn, gợi mở về sự kết hợp giữa tư duy chiến lược và công nghệ tiên
                  tiến, mở ra một xu hướng nông nghiệp hiện đại.
                </p>
              </div>
            </div>
          </div>

          {/* Ý tưởng cho slogan */}
          <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-100 overflow-hidden mb-16 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <div className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Ý Tưởng Cho <span className="text-green-600">Slogan</span>
                </h2>
                <div className="w-16 h-1 bg-green-600 rounded-full mx-auto mb-6"></div>
              </div>
              <p className="text-lg text-gray-700 mb-8 text-center">
                Slogan <strong className="text-green-600 text-xl">&quot;Agriculture of Thinks&quot;</strong> được lấy cảm hứng từ
                hai khái niệm cốt lõi:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-100 transition-all duration-1000 delay-800 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}>
                  <h3 className="text-xl font-bold text-blue-700 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    AI (Artificial Intelligence)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Giống như các công ty công nghệ lớn sử dụng trí tuệ nhân tạo để tối
                    ưu hóa sản phẩm và dịch vụ, Eco Bắc Giang cũng ứng dụng AI vào nông
                    nghiệp để cải thiện quy trình sản xuất, giảm lãng phí và tăng cường
                    hiệu quả.
                  </p>
                </div>
                <div className={`bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-100 transition-all duration-1000 delay-900 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                }`}>
                  <h3 className="text-xl font-bold text-green-700 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    IoT (Internet of Things)
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Việc sử dụng IoT trong nông nghiệp giúp quản lý môi trường canh tác một
                    cách thông minh và tự động hóa. Dựa trên ý tưởng này, Eco Bắc Giang
                    đã phát triển khái niệm <strong>&quot;AoT - Agriculture of Thinks&quot;</strong> (Nông nghiệp trong
                    suy nghĩ), nhấn mạnh vào việc kết hợp công nghệ và tư duy chiến lược
                    trong nông nghiệp hiện đại.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Màu sắc và hình khối */}
          <div className={`bg-gradient-to-br from-green-50 to-green-100 rounded-3xl shadow-2xl border border-green-100 overflow-hidden mb-16 transition-all duration-1000 delay-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <div className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Màu Sắc Và <span className="text-green-600">Hình Khối</span>
                </h2>
                <div className="w-16 h-1 bg-green-600 rounded-full mx-auto mb-6"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100 transition-all duration-1000 delay-1100 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}>
                    <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center">
                      <div className="w-4 h-4 bg-green-600 rounded-full mr-3"></div>
                      Màu xanh lá cây (#009245)
                    </h3>
                    <p className="text-gray-700">
                      Đại diện cho sự phát triển bền vững và thân thiện với môi trường, màu sắc này biểu tượng
                      cho nông nghiệp hữu cơ, một trong những trụ cột của dự án.
                    </p>
                  </div>
                  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100 transition-all duration-1000 delay-1200 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}>
                    <h3 className="text-lg font-bold text-orange-700 mb-3 flex items-center">
                      <div className="w-4 h-4 bg-orange-500 rounded-full mr-3"></div>
                      Màu cam (#FBB03B)
                    </h3>
                    <p className="text-gray-700">
                      Tượng trưng cho sự sáng tạo, đổi mới và năng lượng tích cực. Đây cũng là màu sắc thể hiện sự nhiệt
                      huyết, khát vọng tiên phong trong việc ứng dụng công nghệ vào nông nghiệp.
                    </p>
                  </div>
                  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200 transition-all duration-1000 delay-1300 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
                      <div className="w-4 h-4 bg-gray-800 rounded-full mr-3"></div>
                      Màu đen (#000000)
                    </h3>
                    <p className="text-gray-700">
                      Mang đến sự tương phản mạnh mẽ, tạo cảm giác chuyên nghiệp và hiện đại, kết hợp với sự chính xác và
                      nghiêm túc trong sứ mệnh phát triển nông nghiệp công nghệ cao.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent z-10"></div>
                    <img
                      src="/images/mau-logo.jpg"
                      alt="Màu sắc logo Eco Bắc Giang"
                      className={`w-full h-auto object-cover rounded-2xl transition-all duration-1000 delay-1400 ${
                        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Biểu tượng và hình học */}
          <div className={`bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-100 overflow-hidden mb-16 transition-all duration-1000 delay-1500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <div className="p-8 lg:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                  Biểu Tượng Và <span className="text-green-600">Hình Học</span>
                </h2>
                <div className="w-16 h-1 bg-green-600 rounded-full mx-auto mb-6"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className={`bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 shadow-lg border border-green-100 transition-all duration-1000 delay-1600 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}>
                    <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Chữ &ldquo;C&rdquo; và biểu tượng vô cực
                    </h3>
                    <p className="text-gray-700">
                      Phần chữ &ldquo;C&rdquo; trong từ <strong>&ldquo;ECO&rdquo;</strong> được tạo thành bởi hai hình tròn lồng ghép,
                      gợi liên tưởng đến biểu tượng vô cực (∞). Điều này thể hiện tính
                      sáng tạo không giới hạn và cam kết liên tục phát triển của dự án.
                    </p>
                  </div>
                  <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 shadow-lg border border-blue-100 transition-all duration-1000 delay-1700 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}>
                    <h3 className="text-lg font-bold text-blue-700 mb-3 flex items-center">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Tỷ lệ vàng
                    </h3>
                    <p className="text-gray-700">
                      Logo sử dụng các hình tròn và tỉ lệ vàng (Golden Ratio) để tạo sự cân đối và hài hòa, 
                      mang lại cảm giác nhất quán và trực quan dễ chịu.
                    </p>
                  </div>
                  <div className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 shadow-lg border border-gray-200 transition-all duration-1000 delay-1800 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}>
                    <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      Kích thước và cấu trúc
                    </h3>
                    <p className="text-gray-700">
                      Logo không chỉ có tính kỹ thuật thẩm mỹ, mà còn ẩn chứa sự kết nối với vùng đất Bắc Giang, 
                      nơi dự án được triển khai.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent z-10"></div>
                    <img
                      src="/images/logo-eco.png"
                      alt="Biểu tượng logo Eco Bắc Giang"
                      className={`w-full h-auto object-cover rounded-2xl transition-all duration-1000 delay-1900 ${
                        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kết luận */}
          <div className={`bg-gradient-to-br from-green-600 to-green-700 rounded-3xl shadow-2xl overflow-hidden transition-all duration-1000 delay-2000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}>
            <div className="p-8 lg:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                Kết Luận
              </h2>
              <div className="w-16 h-1 bg-white rounded-full mx-auto mb-8"></div>
              <p className="text-lg text-green-100 leading-relaxed max-w-4xl mx-auto">
                Logo của Eco Bắc Giang truyền tải một thông điệp mạnh mẽ về nông
                nghiệp bền vững kết hợp với công nghệ cao. Đây là một biểu tượng không
                chỉ đẹp về mặt hình thức mà còn sâu sắc về ý nghĩa, đại diện cho khát
                vọng và tầm nhìn đổi mới trong nông nghiệp, đồng thời là cam kết của
                dự án trong việc đóng góp cho sự phát triển của tỉnh Bắc Giang và
                ngành nông nghiệp nói chung.
              </p>
            </div>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default LogoMeaning;
