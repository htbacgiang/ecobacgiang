"use client";
import { useEffect, useRef } from "react";

export default function CrowdfundingSection() {
  const leftSectionRef = useRef(null);
  const rightSectionRef = useRef(null);
  const topSectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("slide-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const topSection = topSectionRef.current;
    const leftSection = leftSectionRef.current;
    const rightSection = rightSectionRef.current;

    if (topSection) observer.observe(topSection);
    if (rightSection) observer.observe(rightSection);
    if (leftSection && window.innerWidth >= 768) observer.observe(leftSection);

    return () => {
      if (topSection) observer.unobserve(topSection);
      if (rightSection) observer.unobserve(rightSection);
      if (leftSection && window.innerWidth >= 768) observer.unobserve(leftSection);
    };
  }, []);

  return (
    <div className="">
      <div className="max-w-8xl mx-auto">
        <div className="bg-gray-50 border rounded-3xl p-8 md:p-6">
          <div className="grid grid-cols-1 gap-8">
            {/* Phần 1: Chiếm toàn bộ độ rộng */}
            <div ref={topSectionRef} className="opacity-0 text-center">
              <h2 className="text-xl font-bold text-green-600 uppercase tracking-wide mb-2">
                Eco Bắc Giang kêu gọi chung tay vì nông sản sạch!
              </h2>
              <h4 className="text-base font-semibold text-gray-900 mb-2">
                  Góp một chút vốn nhỏ, ươm mầm cho những dự án nông sản xanh
                </h4>
                <p className="text-base text-gray-600 mb-1">
                  Eco Bắc Giang không chỉ là những sản phẩm nông sản hữu cơ chất lượng đâu bạn ơi, mà tụi mình còn dành thời gian <strong>nghiên cứu và phát triển những hệ thống thông minh riêng để phục vụ cho nông nghiệp nữa đó!</strong> Bọn mình tin rằng, việc kết hợp giữa phương pháp canh tác truyền thống và công nghệ hiện đại sẽ là chìa khóa cho một nền nông nghiệp bền vững. Vậy nên, tụi mình rất mong nhận được sự chung tay của mọi người để hiện thực hóa những ý tưởng này, mang đến những sản phẩm sạch, an toàn từ nông trại thông minh đến bàn ăn của gia đình bạn.
                </p>  
            </div>

            {/* Phần 2: Chia làm hai cột */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              <div ref={leftSectionRef} className="opacity-0">
               
                <p className="text-base text-gray-600 mb-2">
                  <strong className="uppercase">Chúng mình cần vốn để:</strong> xây dựng trang trại hữu cơ tốt hơn, nghiên cứu và phát triển các hệ thống <strong> AI, IoT, Robots </strong> và nhân rộng mô hình sản xuất để có nhiều nông sản sạch hơn.
                </p>
                <p className="text-base text-gray-600">
                  <strong className="text-pink-600">Tham gia cùng tụi mình ngay để nhận những món quà nho nhỏ nhưng đầy ý nghĩa:</strong> là những phiếu quà tặng giá đặc biệt tương ứng từ Eco Bắc Giang nè!
                </p>
              </div>
              <div ref={rightSectionRef} className="opacity-0 flex flex-col items-center justify-center">
                <img
                  src="/images/qr-code.png"
                  alt="Mã QR để chung tay cùng Eco Bắc Giang xây dựng nông sản hữu cơ"
                  className="w-48 h-48 object-contain mb-4"
                />
                <p className="text-center text-base text-gray-600">
                  Quét mã QR để ủng hộ chiến dịch này và cùng Eco Bắc Giang xây dựng một tương lai xanh cho nông nghiệp Việt bạn nhé!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .opacity-0 {
          opacity: 0;
        }
        .slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}