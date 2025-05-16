import React from "react";

const ProductCard2 = () => {
  return (
    <div className="relative border w-full max-w-sm rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-transform translate-y-0.5 cursor-pointer">
      {/* Image */}
      <div className=" aspect-16/9">
        <img
          src="/product/5.png" // Thay ảnh theo ý bạn
          alt="Product"
          className="object-cover w-full aspect-[1.0] transition-transform
              hover:scale-105 ease duration-300"
        />
      </div>

      {/* Title */}
      <h3 className="mt-4 text-lg font-bold text-gray-800  flex flex-col justify-between items-center">
        Orange Fresh Juice
      </h3>

      {/* Pricing */}
      <div className=" mt-1 flex justify-center items-center">
        <span className="text-red-500 line-through font-semibold text-sm mr-2">$92.00</span>
        <span className="text-green-500 text-xl font-bold">$73.60</span>
      </div>

      {/* Add to Cart Button */}

      {/* Button */}
    <div className="flex justify-center items-center mt-2 mb-2">
    <button className="bg-orange-600 text-white font-semibold py-1 px-5 rounded-xl h-full">
        Thêm vào giỏ hàng
      </button>
    </div>
    </div>
  );
};

export default ProductCard2;
