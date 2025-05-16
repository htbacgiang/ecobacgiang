import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

export default function FeaturedCustomers() {
  // Testimonial data for Đồng phục Univi
  const testimonials = [
    {
      image: '/images/chi-thu.jpg',
      text: 'Sản phẩm chất lượng vượt trội',
      rating: 5,
      description:
        'Đồng phục từ UNIVI rất thoải mái và bền, đặc biệt là công nghệ vải UNI DRY giúp tôi tự tin tập luyện hàng giờ mà không lo ẩm ướt.',
      name: 'Nguyễn Minh Anh',
      role: 'Khách hàng cá nhân',
    },
    {
      image: '/images/ah-long-bac-giang.jpg',
      text: 'Dịch vụ chuyên nghiệp, đáng tin cậy',
      rating: 4,
      description:
        'Giải pháp 2S Uniform của UNIVI đã giúp chuỗi phòng gym của chúng tôi xây dựng hình ảnh chuyên nghiệp và tiết kiệm chi phí quản lý.',
      name: 'Trần Quốc Hùng',
      role: 'Chủ chuỗi phòng Gym',
    },
    {
      image: '/images/chi-linh.jpg',
      text: 'Đồng phục đẹp, chất lượng cao',
      rating: 5,
      description:
        'Chúng tôi rất hài lòng với quy trình sản xuất khép kín và sự tỉ mỉ trong từng đường may. UNIVI  thực sự là đối tác đáng tin cậy.',
      name: 'Phạm Thị Lan',
      role: 'Quản lý Yoga Studio',
    },
  ];

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-slide testimonials every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) =>
        prev === testimonials.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const prevTestimonial = () =>
    setCurrentTestimonial((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  const nextTestimonial = () =>
    setCurrentTestimonial((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );


  const brandRef = useRef(null);
  const scrollBrands = (dir) => {
    brandRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });
  };

  return (
    <section className="py-16 bg-white" aria-labelledby="testimonials-heading">
      <div className="text-center mb-12">
        <h2
          id="testimonials-heading"
          className="text-3xl font-bold text-gray-900"
        >
          Lời Khách Hàng, Niềm Tự Hào Của UNIVI 
        </h2>
        <p className="text-gray-500 mt-2">
          Những lời chia sẻ từ khách hàng hài lòng của chúng tôi
        </p>
      </div>

      {/* Testimonial Slider */}
      <div className="relative max-w-4xl mx-auto bg-gray-50 rounded-lg overflow-hidden shadow">
        <button
          onClick={prevTestimonial}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full opacity-50 hover:opacity-100 hover:bg-white hover:bg-opacity-20 transition focus:outline-none z-10"
          aria-label="Xem đánh giá trước đó"
        >
          <FaArrowLeft className="text-gray-800 text-2xl" />
        </button>
        <div className="flex flex-col md:flex-row items-center">
          {/* Image */}
          <div className="w-full md:w-1/3 p-6">
            <Image
              src={testimonials[currentTestimonial].image}
              alt={`Ảnh của ${testimonials[currentTestimonial].name}, khách hàng của Đồng phục Univi`}
              width={300}
              height={300}
              className="rounded"
              onError={() => console.error(`Không tải được hình ảnh: ${testimonials[currentTestimonial].image}`)}
              priority={currentTestimonial === 0} // Prioritize first image for LCP
            />
          </div>
          {/* Content */}
          <div className="w-full md:w-2/3 p-6">
            <div className="text-gray-300 text-5xl">“</div>
            <h3 className="text-xl font-semibold mb-2">
              {testimonials[currentTestimonial].text}{' '}
            </h3>
            <p className="text-gray-600 mb-4">
              {testimonials[currentTestimonial].description}
            </p>
            <p className="font-semibold">
              {testimonials[currentTestimonial].name} -{' '}
              <span className="text-gray-500">
                {testimonials[currentTestimonial].role}
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={nextTestimonial}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full opacity-50 hover:opacity-100 hover:bg-white hover:bg-opacity-20 transition focus:outline-none z-10"
          aria-label="Xem đánh giá tiếp theo"
        >
          <FaArrowRight className="text-gray-800 text-2xl" />
        </button>
      </div>
    </section>
  );
}