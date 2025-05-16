import React from 'react';

// URL mẫu cho hình ảnh (thay bằng tệp cục bộ hoặc URL của bạn)
const fabrics = [
  {
    bgImage: '../images/1.jpg', // Vải thể thao
    title: 'UNIVI QUICK DRY',
    description: 'Vải polyester (82-100%), căng, nhẹ, nhanh khô, thích hợp cho Running, Cycling, Gym.',
  },
  {
    bgImage: '../images/2.jpg', // Vải thể thao
    title: 'UNIVI SUPER COOL',
    description: 'Vải polyamide (76-90%), mềm, mát, mịn, dùng cho Yoga, Dance, Golf.',
  },
  {
    bgImage: '../images/3.jpg', // Vải thể thao
    title: 'UNIVI BLENDED',
    description: 'Kết hợp polyester và cotton, bền, nhẹ, chống tia UV, dùng cho Running, thể thao thêu.',
  },
];

// URL mẫu cho nền section
const sectionBg = '../images/banner-1.webp'; // Phòng gym

const FabricCardComponent = () => {
  const handleFreeDesign = () => {
    console.log('Free design clicked');
  };

  const handleGetQuote = () => {
    console.log('Get quote clicked');
  };

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${sectionBg})` }}
    >
      {/* Lớp phủ mờ cho toàn bộ section */}
      <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      {/* Gradient trên (từ trắng qua trắng mờ sang trong suốt) */}
      <div
        className="absolute top-0 left-0 right-0 h-40"
        style={{
          backgroundImage: 'linear-gradient(to bottom, #FFFFFF, rgba(255, 255, 255, 0.5), transparent)',
        }}
      ></div>
      {/* Gradient dưới (từ trong suốt qua trắng mờ sang trắng) */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40"
        style={{
          backgroundImage: 'linear-gradient(to top, #FFFFFF, rgba(255, 255, 255, 0.5), transparent)',
        }}
      ></div>
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-4xl ">
        {fabrics.map((fabric, index) => (
          <div
            key={index}
            role="region"
            aria-labelledby={`fabric-title-${index}`}
            className="relative text-white rounded-lg shadow-lg flex flex-col justify-center items-center bg-cover bg-center aspect-[9/16]"
            style={{ backgroundImage: `url(${fabric.bgImage})` }}
          >
            {/* Lớp phủ mờ cho fabric card */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center p-6">
              <h2 id={`fabric-title-${index}`} className="text-xl font-bold mb-2 text-center">
                {fabric.title}
              </h2>
              <div className="w-12 h-1 bg-white mx-auto mb-4"></div>
              <p className="text-sm text-center">{fabric.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="relative mt-8 flex space-x-4">
        <button
          onClick={handleFreeDesign}
          className="bg-[#105d97] text-white px-6 py-2 rounded-full font-semibold hover:bg-red-600 transition"
          aria-label="Request free design"
        >
          Miễn phí thiết kế
        </button>
        <button
          onClick={handleGetQuote}
          className="bg-white text-black px-6 py-2 rounded-full font-semibold hover:bg-gray-200 transition"
          aria-label="Get a quote"
        >
          Nhận báo giá
        </button>
      </div>
    </div>
  );
};

export default React.memo(FabricCardComponent);