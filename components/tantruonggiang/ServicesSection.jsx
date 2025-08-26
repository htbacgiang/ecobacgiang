import Image from "next/image";
import Link from "next/link";

export default function ServicesSection() {
  return (
    <section className="bg-gray-900 py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Tiêu đề và mô tả */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-yellow-400 uppercase">
            DỊCH VỤ TẠI GREENLAHOME
          </h2>
          <p className="text-gray-300 mt-4 text-sm md:text-base leading-relaxed max-w-5xl mx-auto">
            GREENLAHOME chuyên thiết kế, thi công nội thất theo phong cách hiện đại dành cho căn hộ, nhà phố và biệt thự. Ngoài đội ngũ trẻ và năng động, chúng tôi còn ứng dụng công nghệ AI trong thiết kế nhằm tối ưu theo nhu cầu và gu thẩm mỹ riêng của từng khách hàng. Sứ mệnh của chúng tôi là kiến tạo tổ ấm hiện đại, tiện nghi và bền vững.
          </p>
        </div>

        {/* Grid 3 cột */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Cột 1: Thiết Kế Nội Thất Chung Cư */}
          <div className="flex flex-col items-center group">
            <div className="relative w-full h-48 md:h-64">
              <Image
                src="/images/thiet-ke-noi-that-chung-cu.png"
                alt="Thiết Kế Nội Thất Chung Cư"
                layout="fill"
                objectFit="cover"
                className="rounded-lg transition-opacity duration-300 group-hover:opacity-70"
              />
              {/* Overlay và nút Xem chi tiết */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link href="/thiet-ke-noi-that-chung-cu">
                  <button className="bg-yellow-400 text-black font-semibold text-sm md:text-base py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors duration-200">
                    Xem chi tiết
                  </button>
                </Link>
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-yellow-400 mt-4 uppercase">
              Thiết Kế Nội Thất Chung Cư
            </h3>
            <p className="text-gray-300 text-sm md:text-base text-center mt-2">
              GREENLAHOME mang đến giải pháp thiết kế nội thất hiện đại, bền vững, ứng dụng công nghệ AI tiên tiến. Chúng tôi tạo nên không gian sống đậm chất cá nhân, đáp ứng nhanh chóng và phù hợp với từng khách hàng.
            </p>
          </div>

          {/* Cột 2: Thiết Kế Nội Thất Nhà Phố */}
          <div className="flex flex-col items-center group">
            <div className="relative w-full h-48 md:h-64">
              <Image
                src="/images/thi-cong-noi-that-nha-pho.png"
                alt="Thiết Kế Nội Thất Nhà Phố"
                layout="fill"
                objectFit="cover"
                className="rounded-lg transition-opacity duration-300 group-hover:opacity-70"
              />
              {/* Overlay và nút Xem chi tiết */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link href="/thiet-ke-noi-that-nha-pho">
                  <button className="bg-yellow-400 text-black font-semibold text-sm md:text-base py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors duration-200">
                    Xem chi tiết
                  </button>
                </Link>
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-yellow-400 mt-4 uppercase">
              Thiết Kế Nội Thất Nhà Phố
            </h3>
            <p className="text-gray-300 text-sm md:text-base text-center mt-2">
              GREENLAHOME cam kết mang đến sản phẩm tinh tế, bền vững với độ bền cao. Sử dụng hệ thống máy móc hiện đại và công nghệ tiên tiến, cùng đội ngũ thi công lành nghề và giám sát chuyên môn cao, tận tâm với từng dự án.
            </p>
          </div>

          {/* Cột 3: Thi Công Nội Thất Trọn Gói */}
          <div className="flex flex-col items-center group">
            <div className="relative w-full h-48 md:h-64">
              <Image
                src="/images/thi-cong-noi-that.png"
                alt="Thi Công Nội Thất Trọn Gói"
                layout="fill"
                objectFit="cover"
                className="rounded-lg transition-opacity duration-300 group-hover:opacity-70"
              />
              {/* Overlay và nút Xem chi tiết */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Link href="/thi-cong-noi-that-tron-goi">
                  <button className="bg-yellow-400 text-black font-semibold text-sm md:text-base py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors duration-200">
                    Xem chi tiết
                  </button>
                </Link>
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-yellow-400 mt-4 uppercase">
              Thi Công Nội Thất Trọn Gói
            </h3>
            <p className="text-gray-300 text-sm md:text-base text-center mt-2">
              GREENLAHOME hợp tác với các thương hiệu ván hàng đầu như An Cường, Minh Long và Vanachai (Thái Lan). Sử dụng ván gỗ MDF đạt chuẩn E0, E1, E2, đảm bảo thân thiện với môi trường và an toàn tuyệt đối cho người sử dụng.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}