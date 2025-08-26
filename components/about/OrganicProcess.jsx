const OrganicProcess = () => {
  return (
    <section className="bg-white py-20">
      <div className="container mx-auto px-6 lg:px-20">
        {/* Phần tiêu đề */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <img
              src="/images/4.webp"
              alt="Sản phẩm hữu cơ và tinh khiết"
              className="mx-auto md:w-2/5 w-4/5  transform hover:scale-105 transition-transform duration-500"
            />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-4 mb-4">
            Quy Trình Hữu Cơ
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá quy trình sản xuất hữu cơ chất lượng cao của chúng tôi
          </p>
        </div>

        {/* Phần quy trình */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Bước 1 */}
          <div className="group relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <img
                    src="/images/step-1.webp"
                    alt="Lên kế hoạch"
                    className="w-12 h-12 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                Lên kế hoạch
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Lập kế hoạch chi tiết cho quy trình canh tác hữu cơ để đảm bảo
                hiệu quả tối ưu.
              </p>
            </div>
          </div>

          {/* Bước 2 */}
          <div className="group relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <img
                    src="/images/step-2.webp"
                    alt="Ươm mầm"
                    className="w-12 h-12 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                Ươm mầm
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Gieo hạt và chăm sóc cây non với kỹ thuật hữu cơ để đảm bảo
                phát triển tốt nhất.
              </p>
            </div>
          </div>

          {/* Bước 3 */}
          <div className="group relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <img
                    src="/images/step-1.webp"
                    alt="Đảm bảo chất lượng"
                    className="w-12 h-12 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                Kiểm soát chất lượng
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Kiểm tra kỹ lưỡng chất lượng sản phẩm trong từng giai đoạn
                sản xuất.
              </p>
            </div>
          </div>

          {/* Bước 4 */}
          <div className="group relative">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-green-100">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <img
                    src="/images/step-3.webp"
                    alt="Tiếp thị"
                    className="w-12 h-12 transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">
                Marketing
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Đưa sản phẩm ra thị trường với các chiến lược tiếp thị hiệu quả
                và bền vững.
              </p>
            </div>
          </div>
        </div>

        {/* Connecting lines for desktop */}
        <div className="hidden lg:block relative mt-16">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-green-200 transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/4 w-0.5 h-8 bg-green-300 transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-green-300 transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 left-3/4 w-0.5 h-8 bg-green-300 transform -translate-y-1/2"></div>
        </div>
      </div>
    </section>
  );
};

export default OrganicProcess;
