import React, { useState, useRef, useEffect } from 'react';
import { Bolt, ChevronLeft, ChevronRight } from 'lucide-react';

const CarouselComponent = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const categoryRef = useRef(null);

  const slides = [
    {
      title: "Thực phẩm tươi ngon theo tiêu chuẩn hữu cơ, an tâm tuyệt đối",
      subtitle: "Khám phá nông sản Eco Bắc Giang - Vì sức khỏe và môi trường bền vững.",
      discount: "Ưu đãi đặc biệt!",
      image: "/images/menu-banner-2.png",
    },
    {
      title: "Ứng dụng công nghệ thông minh, cho mùa vụ bội thu",
      subtitle: "Eco Bắc Giang ứng dụng giải pháp thông minh trong từng khâu sản xuất.",
      discount: "Tìm hiểu ngay!",
      image: "/images/smart-farm.webp",
    },
    {
      title: "Hướng tới tương lai xanh cùng nông nghiệp bền vững",
      subtitle: "Chọn Eco Bắc Giang là chọn sự phát triển hài hòa với thiên nhiên.",
      discount: "Cùng hành động!",
      image: "/images/menu-banner-4.png",
    },
  ];


  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const scrollCategoriesLeft = () => {
    categoryRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  };

  const scrollCategoriesRight = () => {
    categoryRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Section */}
      <div className="bg-[#f5e9d3] flex-grow flex items-center justify-center">
        <div className="relative w-full max-w-7xl md:mt-24 mt-16 px-4">
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="w-full md:w-3/5 p-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-5 uppercase">
                {slides[currentSlide].title}
              </h2>
              <p className="text-gray-600 mb-8 text-base md:text-xl">
                {slides[currentSlide].subtitle}
              </p>
              <button className="bg-green-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-full hover:bg-green-700 text-base md:text-lg">
              {slides[currentSlide].discount}
              </button>
            </div>
            <div className="relative w-full md:w-2/5 flex justify-center  md:mt-0">
              <img
                src={slides[currentSlide].image}
                alt="Slide"
                className="w-full h-80 md:h-96 object-contain"
              />
            </div>
          </div>

          {/* Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="text-xl" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="text-xl" />
          </button>

          {/* Dots */}
          <div className="flex justify-center mt-6 mb-10">
            {slides.map((_, idx) => (
              <div
                key={idx}
                className={`w-2 h-2 rounded-full mx-2 ${
                  currentSlide === idx ? 'bg-green-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

    
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CarouselComponent;
