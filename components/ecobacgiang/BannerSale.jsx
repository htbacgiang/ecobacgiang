// components/BannerSale.js
import Image from 'next/image';

const BannerSale = () => {
  return (
    <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] flex items-center justify-start rounded-xl max-w-7xl mx-auto mb-5">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/vegetables.png" // Ensure this image exists in the public folder
 
          alt="Rau củ Eco Bắc Giang"
          layout="fill"
          objectFit="cover"
          className="opacity-70"
          priority
          onError={(e) => (e.target.src = '/images/fallback-image.jpg')}
        />
      </div>

      {/* Overlay Content - Aligned to the left */}
      <div className="relative z-10 text-left w-full sm:w-1/2 pl-4 sm:pl-6 md:pl-12 pr-4">
        {/* Eco Bắc Giang Branding */}
        <p className="text-green-600 text-sm font-semibold uppercase mb-2">
          Khám phá Eco Bắc Giang
        </p>

        {/* Main Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold uppercase mb-2">
          Tươi Ngon Hữu Cơ
        </h1>

        {/* Subheading */}
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold mb-4">
          Trải nghiệm sản phẩm sạch từ trang trại Eco Bắc Giang
        </h2>

        {/* Description */}
        <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-6">
          Ưu đãi đặc biệt cho đơn hàng rau củ hữu cơ chất lượng cao
        </p>

        {/* Shop Now Button */}
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 md:px-8 py-2 rounded-full font-semibold transition"
          aria-label="Mua ngay"
        >
          Mua ngay →
        </button>
      </div>

      {/* Decorative Element */}
      <div className="absolute top-2 sm:top-4 right-2 sm:right-4">
        <p className="text-green-600 text-xs sm:text-sm font-semibold">
          Nhấp để khám phá
        </p>
      </div>
    </div>
  );
};

export default BannerSale;
