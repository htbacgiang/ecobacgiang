import Image from "next/image";
import Link from "next/link";

export default function FeaturedProjectsSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Phần Tiêu đề và Mô tả */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-yellow-400 uppercase">
            Dự Án Nổi Bật
          </h2>
          <p className="text-gray-700 mt-4 text-sm md:text-base leading-relaxed max-w-4xl mx-auto">
            Mỗi dự án hoàn thiện đều là tâm huyết của đội ngũ Greenlahome gửi gắm đến quý khách hàng. 
            Sản phẩm hoàn thiện không chỉ mang tính thẩm mỹ cao mà còn ẩn chứa những nét riêng theo 
            cá tính của từng quý khách hàng.
          </p>
        </div>

        {/* Layout 2 cột: 1 ảnh lớn bên trái, 2 ảnh nhỏ bên phải */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Cột bên trái: Ảnh lớn */}
          <div className="relative group">
            <Link href="/du-an/du-an-anh-chung-chuong-my-biet-thu-130m2" className="block">
              <div className="relative w-full h-80 md:h-[30rem]">
                <Image
                  src="/product/biet-thu-hien-dai/thi-cong-biet-thu-hien-dai-7.jpg"
                  alt="Dự án nổi bật chính"
                  fill
                  className="object-cover rounded-lg transition-opacity duration-300 group-hover:opacity-90"
                  sizes="(max-width: 768px) 100vw,
                          (min-width: 769px) 50vw"
                />
              </div>
              <div className="absolute bottom-4 left-4 bg-white/80 px-3 py-2 rounded shadow-sm">
                <h3 className="text-sm md:text-base font-semibold text-gray-800">
                  Thiết kế nội thất biệt thự sang trọng tại Hà Nội
                </h3>
              </div>
            </Link>
          </div>

          {/* Cột bên phải: 2 ảnh nhỏ trên cùng (chia 2 cột), 1 ảnh nhỏ bên dưới */}
          <div className="flex flex-col gap-6">
            {/* Hai ảnh nhỏ trên cùng */}
            <div className="grid grid-cols-2 gap-6">
              {/* Dự án 1 */}
              <div className="relative group">
                <Link
                  href="/du-an/thiet-ke-noi-that-chung-cu-3-vinhone-ocean-park"
                  className="block"
                >
                  <div className="relative w-full h-48 md:h-56">
                    <Image
                      src="/product/chung-cu-vinhomes/thiet-ke-chung-cu-3-ngu-vinhome-4.jpg"
                      alt="Dự án 1"
                      fill
                      className="object-cover rounded-lg transition-opacity duration-300 group-hover:opacity-90"
                      sizes="(max-width: 768px) 50vw,
                              (min-width: 769px) 25vw"
                    />
                  </div>
                  <div className="absolute bottom-4 mx-4 bg-white/80 px-3 py-1 rounded shadow-sm">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800">
                    Thiết Kế Chung Cư 3 Ngủ – Vinhome Ocean Park
                    </h3>
                  </div>
                </Link>
              </div>

              {/* Dự án 2 */}
              <div className="relative group">
                <Link
                  href="/du-an/thiet-ke-noi-that-chung-cu-van-phu-victoria-van-phu"
                  className="block"
                >
                  <div className="relative w-full h-48 md:h-56">
                    <Image
                      src="/product/van-phu-victoria/Thiet-ke-chung-cu-3-ngu-Van-Phu-Victoria-7.jpg"
                      alt="Dự án 2"
                      fill
                      className="object-cover rounded-lg transition-opacity duration-300 group-hover:opacity-90"
                      sizes="(max-width: 768px) 50vw,
                              (min-width: 769px) 25vw"
                    />
                  </div>
                  <div className="absolute bottom-4 mx-4 bg-white/80 px-3 py-1 rounded shadow-sm">
                    <h3 className="text-sm md:text-base font-semibold text-gray-800">
                      Nội thất gỗ hiện đại cho chung cư Văn Phú Victoria
                    </h3>
                  </div>
                </Link>
              </div>
            </div>

            {/* Dự án bên dưới (giữ nguyên) */}
            <div className="relative group">
              <Link
                href="du-an/chi-thao-the-light-trung-van"
                className="block"
              >
                <div className="relative w-full h-48 md:h-56">
                  <Image
                    src="/product/chi-thao-the-light-trung-van/chi-thao-the-light-trung-van-1.png"
                    alt="Dự án 2"
                    fill
                    className="object-cover rounded-lg transition-opacity duration-300 group-hover:opacity-90"
                    sizes="(max-width: 768px) 100vw,
                            (min-width: 769px) 50vw"
                  />
                </div>
                <div className="absolute bottom-4 left-4 bg-white/80 px-3 py-1 rounded shadow-sm">
                  <h3 className="text-sm md:text-base font-semibold text-gray-800">
                  Thiết Kế Chung Cư 3 Ngủ Chị Thảo - CC The Light Trung Văn
                  </h3>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Nút gọi hành động (CTA) */}
        <div className="text-right mt-6">
          <Link href="/du-an" className="inline-block">
            <button className="text-yellow-500 font-semibold uppercase flex items-center gap-2 hover:text-yellow-600 transition-colors duration-200">
              Xem thêm dự án khác
              <span className="text-yellow-500">→</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}