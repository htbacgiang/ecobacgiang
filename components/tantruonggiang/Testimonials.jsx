import { useState } from "react";
import Image from "next/image";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: "Chị Thu Vũ",
      location: "Hà Nội",
      review:
        "Tôi rất hài lòng với dịch vụ của GreenLa Home. Thiết kế nội thất hiện đại, tinh tế và đúng với mong muốn của gia đình tôi. Đội ngũ rất chuyên nghiệp!",
      rating: 5,
      image: "/images/chi-thu.jpg",
    },
    {
      name: "Chị Trần Ngọc Linh",
      location: "Hà Nội",
      review:
        "GreenLa Home đã biến ngôi nhà của tôi thành một không gian sống lý tưởng. Chất lượng sản phẩm tuyệt vời, dịch vụ tận tâm, tôi sẽ tiếp tục ủng hộ!",
      rating: 5,
      image: "/images/chi-linh.jpg",
    },
    {
      name: "Lê Minh Tuấn",
      location: "Bắc Ninh",
      review:
        "Thiết kế nội thất của GreenLa Home rất sáng tạo và phù hợp với xu hướng. Tôi ấn tượng với cách họ ứng dụng công nghệ AI để tối ưu hóa thiết kế.",
      rating: 5,
      image: "/images/anh-tuan-bac-ninh.jpg",
    },
    {
      name: "Phạm Thị Hồng Nhung",
      location: "Hà Nội",
      review:
        "Dịch vụ tư vấn và thi công nội thất rất chuyên nghiệp. Không gian sống của tôi trở nên sang trọng và tiện nghi hơn bao giờ hết. Cảm ơn GreenLa Home!",
      rating: 5,
      image: "/images/chi-nhung-ha-noi.jpg",
    },
    {
      name: "Hoàng Văn Long",
      location: "Bắc Giang",
      review:
        "Tôi rất ấn tượng với sự tận tâm của đội ngũ GreenLa Home. Sản phẩm nội thất chất lượng cao, thiết kế hiện đại, tôi rất hài lòng với kết quả.",
      rating: 5,
      image: "/images/ah-long-bac-giang.jpg",
    },
  ];

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-8">
          <p className="text-orange-500 text-sm uppercase tracking-widest mb-2">
            ĐÁNH GIÁ TỪ KHÁCH HÀNG
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Lời Nhận Xét Từ Khách Hàng
          </h2>
        </div>

        {/* Testimonial */}
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-500"
          >
            <FaChevronLeft size={24} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white hover:text-orange-500"
          >
            <FaChevronRight size={24} />
          </button>

          {/* Testimonial Content */}
          <div className="space-y-6">
            {/* Stars */}
            <div className="flex justify-center space-x-1">
              {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                <FaStar key={i} className="text-orange-500" />
              ))}
            </div>

            {/* Review */}
            <p className="text-gray-300 text-lg italic px-6 quote">
              {testimonials[currentIndex].review}
            </p>

            {/* Customer Info */}
            <div className="flex justify-center items-center space-x-4">
              <div className="w-20 h-20 rounded-full overflow-hidden">
                <Image
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  width={80}
                  height={80}
                  objectFit="cover"
                />
              </div>
              <div>
                <p className="text-white font-semibold text-2xl">
                  {testimonials[currentIndex].name}
                </p>
                <p className="text-gray-400 text-sm">
                  {testimonials[currentIndex].location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}