'use client';

import Slider from 'react-slick';
import Image from 'next/image';
import { Suspense } from 'react';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const BannerSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    adaptiveHeight: true,
  };

  const slides = [
    {
      subtitle: 'Amazing Online Store',
      title: 'Keep Calm And Surfron With Fashion',
      image: '/banner-fashion.png', // Replace with actual image
      alt: 'Fashion banner showcasing trendy clothing',
    },
    {
      subtitle: 'Furniture For Home',
      title: 'Take a Seat and Relax for few Moments',
      image: '/banner-1.png', // Ensure this is the correct image path
      alt: 'Furniture banner featuring cozy home decor',
    },
    {
      subtitle: 'Fashion For Female',
      title: 'Be Attractive & Elegant with Our Dress',
      image: '/banner-dress.png', // Replace with actual image
      alt: 'Elegant dress banner for women',
    },
  ];

  return (
    <div className="bg-[#f8ece5] h-screen w-screen overflow-hidden">
      <Slider {...settings} aria-label="Promotional banners">
        {slides.map((slide, index) => (
          <div key={index} className="h-screen w-screen flex items-center justify-center">
            <div className="flex flex-col lg:flex-row items-center justify-between h-full w-full px-4 lg:px-16">
              {/* Text Section */}
              <div className="lg:w-1/2 w-full p-4 lg:p-8 text-center lg:text-left">
                <p className="text-[#ff6f61] uppercase tracking-wider text-lg lg:text-xl mb-3 lg:mb-4">
                  {slide.subtitle}
                </p>
                <h2 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 lg:mb-8">
                  {slide.title}
                </h2>
                <div className="flex justify-center lg:justify-start space-x-4 lg:space-x-6">
                  <button
                    aria-label="Explore products now"
                    className="bg-[#ff6f61] text-white px-8 py-4 lg:px-10 lg:py-5 rounded-md flex items-center text-lg lg:text-xl"
                  >
                    Explore Now
                    <svg
                      className="ml-3 w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  <button
                    aria-label="View product collection"
                    className="border border-gray-300 px-8 py-4 lg:px-10 lg:py-5 rounded-md flex items-center text-lg lg:text-xl"
                  >
                    View Collection
                    <svg
                      className="ml-3 w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Image Section */}
              <div className="lg:w-1/2 w-full relative flex justify-center items-start h-full mt-12 lg:mt-24 image-section">
                {/* Large Circle */}
                <div className="absolute w-[60vw] h-[60vw] lg:w-[40vw] lg:h-[40vw] max-w-[600px] max-h-[600px] bg-[#ffdad5] rounded-full z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 circle-large"></div>
                {/* Small Circle 1 - Top Left */}
                <div className="absolute w-[15vw] h-[15vw] lg:w-[10vw] lg:h-[10vw] max-w-[150px] max-h-[150px] bg-[#ffdad5] rounded-full z-0 top-[10%] left-[10%] circle-small-alt"></div>
                {/* Small Circle 2 - Top Right */}
                <div className="absolute w-[10vw] h-[10vw] lg:w-[8vw] lg:h-[8vw] max-w-[100px] max-h-[100px] bg-[#ffdad5] rounded-full z-0 top-[10%] right-[10%] circle-small"></div>
                <Suspense fallback={<div>Loading image...</div>}>
                  <Image
                    src={slide.image}
                    alt={slide.alt}
                    width={800}
                    height={800}
                    sizes="(max-width: 1024px) 90vw, 60vw"
                    className="relative z-10 object-contain max-h-[80vh] max-w-[90vw] lg:max-h-[90vh] lg:max-w-[60vw]"
                    priority={index === 0}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Inline CSS for animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float-alt {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(5px);
          }
        }
        @keyframes float-small {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .image-section:hover .circle-large {
          animation: float 3s ease-in-out infinite;
        }
        .image-section:hover .circle-small-alt {
          animation: float-alt 3.5s ease-in-out infinite;
        }
        .image-section:hover .circle-small {
          animation: float-small 2.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default BannerSlider;