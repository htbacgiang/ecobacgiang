import Image from "next/image";

export default function ServicesSection() {
  const services = [
    {
      imageSrc: "/images/banner-3.webp",
      alt: "Chất Liệu & Công Nghệ Vải",
      title: "Chất Liệu & Công Nghệ Vải",
      description:
        "Đồng phục UNIVI tập trung phát triển các dòng vải đặc thù (Quick Dry, Super Cool, Blended) với công nghệ UNI DRY độc quyền, đảm bảo thoáng khí, thoát ẩm, mềm mại, bền màu và an toàn (không chứa Formaldehyde, Amin thơm Azo), tạo sự khác biệt vượt trội.",
    },
    {
      imageSrc: "/images/banner-2.webp",
      alt: "Quy Trình Sản Xuất Khép Kín",
      title: "Quy Trình Sản Xuất Khép Kín",
      description:
        "Sở hữu xưởng sản xuất lớn (trên 2000m²) với đội ngũ lành nghề, Đồng phục Univi kiểm soát chất lượng từ A-Z. Đường may tinh tế, kiểm tra chất lượng độc lập và sự tỉ mỉ đảm bảo sản phẩm bền, đẹp và thoải mái.",
    },
    {
      imageSrc: "/images/banner-1.webp",
      alt: "Giải Pháp 2S Uniform",
      title: "Giải Pháp 2S Uniform",
      description:
        "Giải pháp 2S Uniform được thiết kế riêng cho chuỗi phòng tập (Gym, Yoga), giúp xây dựng hình ảnh chuyên nghiệp, tiết kiệm chi phí và tạo cơ hội kinh doanh, thể hiện sự am hiểu sâu sắc về nhu cầu B2B.",
    },
  ];

  return (
    <section className="bg-gray-900 py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-white uppercase">
          Thế Mạnh Của Đồng phục UNIVI 
          </h2>
          <p className="text-gray-300 mt-4 text-sm md:text-base leading-relaxed max-w-5xl mx-auto">
            Đồng phục UNIVI chuyên cung cấp các giải pháp vải công nghệ cao và đồng phục thể thao chuyên nghiệp, ứng dụng quy trình sản xuất khép kín và công nghệ tiên tiến, mang đến sản phẩm chất lượng, bền vững và phù hợp với nhu cầu khách hàng.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="relative w-full h-48 md:h-64">
                <Image
                  src={service.imageSrc}
                  alt={service.alt}
                  layout="fill"
                  objectFit="cover"
                  placeholder="blur"
                  blurDataURL="/images/placeholder.png"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="rounded-lg"
                  onError={(e) => (e.currentTarget.src = "/images/fallback.png")}
                />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-blue-300 mt-4 uppercase">
                {service.title}
              </h3>
              <p className="text-gray-300 text-sm md:text-base text-center mt-2">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}