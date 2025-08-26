"use client";

export default function CrowdfundingSection() {
  return (
    <div className="w-full py-6 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border-2 border-green-200 rounded-2xl p-6 shadow-lg relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-100 rounded-full -translate-y-10 translate-x-10 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-blue-100 rounded-full translate-y-8 -translate-x-8 opacity-30"></div>
          
          <div className="grid grid-cols-1 gap-6 relative z-10">
            {/* Header */}
            <div className="text-center">
              <h2 className="text-xl md:text-2xl font-bold text-green-700 uppercase tracking-wide mb-2">
                Eco Bắc Giang kêu gọi chung tay vì nông sản sạch!
              </h2>
              
              <div className="w-16 h-0.5 bg-green-500 mx-auto mb-3 rounded-full"></div>
              
              <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-3">
                Góp một chút vốn nhỏ, ươm mầm cho những dự án nông sản xanh
              </h4>
              
              <p className="text-base text-gray-600 leading-relaxed max-w-4xl mx-auto">
                Eco Bắc Giang không chỉ là những sản phẩm nông sản hữu cơ chất lượng, mà còn <strong className="text-green-700">nghiên cứu và phát triển những hệ thống thông minh</strong> để phục vụ cho nông nghiệp. Việc kết hợp giữa phương pháp canh tác truyền thống và công nghệ hiện đại sẽ là chìa khóa cho một nền nông nghiệp bền vững.
              </p>  
            </div>

            {/* 2 cột: Thông tin trái - QR phải */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Cột trái - 2 card thông tin */}
              <div className="space-y-4">
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
                  <h3 className="text-base font-bold text-green-800 mb-2 uppercase">
                    Chúng mình cần vốn để:
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Xây dựng trang trại hữu cơ tốt hơn, nghiên cứu và phát triển các hệ thống <strong className="text-green-700">AI, IoT, Robots</strong> và nhân rộng mô hình sản xuất.
                  </p>
                </div>
                
                <div className="bg-pink-50 border-l-4 border-pink-500 p-4 rounded-r-lg">
                  <h3 className="text-base font-bold text-pink-800 mb-2">
                    🎁 Quà tặng đặc biệt
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    <strong className="text-pink-700">Tham gia ngay để nhận phiếu quà tặng giá đặc biệt</strong> từ Eco Bắc Giang!
                  </p>
                </div>
              </div>
              
              {/* Cột phải - QR Code */}
              <div className="flex justify-center">
                <div className="bg-white border-2 border-green-200 rounded-xl p-6 shadow-md max-w-sm">
                  <img
                    src="/images/qr-code.png"
                    alt="Mã QR để chung tay cùng Eco Bắc Giang xây dựng nông sản hữu cơ"
                    className="w-48 h-48 object-contain mb-4 rounded-lg mx-auto"
                  />
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-sm font-medium text-green-700">Quét mã QR để ủng hộ</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      Cùng Eco Bắc Giang xây dựng tương lai xanh cho nông nghiệp Việt!
                    </p>
                    
                    <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm">
                      Ủng hộ ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}