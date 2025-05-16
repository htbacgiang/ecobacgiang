import React from 'react';

const PromoCards = () => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Card */}
        <div className="relative bg-gradient-to-b from-blue-200 to-blue-100 rounded-lg p-6 flex flex-col justify-between h-80">
          <div>
            <p className="text-sm text-gray-600">We Supply 100% Fresh</p>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">Fresh healthy foods</h2>
          </div>
          <button className="self-start bg-transparent border border-gray-800 text-gray-800 px-4 py-2 rounded hover:bg-gray-800 hover:text-white transition">
            Shop Now
          </button>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[url('/images/citrus-fruits.jpg')] bg-cover bg-center rounded-b-lg"></div>
        </div>

        {/* Second Card */}
        <div className="relative bg-gray-100 rounded-lg p-6 flex flex-col justify-between h-80">
          <div>
            <p className="text-2xl font-bold text-gray-800">30% OFF</p>
            <h2 className="text-xl font-semibold text-gray-800 mt-2">Full Fresh Vegetable</h2>
          </div>
          <button className="self-start bg-transparent border border-gray-800 text-gray-800 px-4 py-2 rounded hover:bg-gray-800 hover:text-white transition">
            Shop Now
          </button>
          <div className="absolute bottom-0 left-0 w-full h-2/3 bg-[url('/images/vegetables.jpg')] bg-cover bg-center rounded-b-lg"></div>
        </div>

        {/* Third Card */}
        <div className="relative bg-gray-100 rounded-lg p-6 flex flex-col justify-between h-80">
          <div>
            <p className="text-2xl font-bold text-gray-800">35% OFF</p>
            <h2 className="text-xl font-semibold text-gray-800 mt-2">100% Organic Food</h2>
          </div>
          <button className="self-start bg-transparent border border-gray-800 text-gray-800 px-4 py-2 rounded hover:bg-gray-800 hover:text-white transition">
            Shop Now
          </button>
          <div className="absolute bottom-0 left-0 w-full h-2/3 bg-[url('/images/organic-food.jpg')] bg-cover bg-center rounded-b-lg"></div>
        </div>

        {/* Fourth Card (Full Width) */}
        <div className="relative bg-green-100 rounded-lg p-6 flex flex-col justify-between h-80 md:col-span-2">
          <div>
            <p className="text-sm text-gray-600">Daily Essentials</p>
            <p className="text-2xl font-bold text-gray-800 mt-2">Sale 58% Off</p>
            <h2 className="text-xl font-semibold text-gray-800 mt-2">All Fruit Products</h2>
          </div>
          <button className="self-start bg-transparent border border-gray-800 text-gray-800 px-4 py-2 rounded hover:bg-gray-800 hover:text-white transition">
            Shop Now
          </button>
          <div className="absolute bottom-0 left-0 w-full h-2/3 bg-[url('/images/fruits.jpg')] bg-cover bg-center rounded-b-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default PromoCards;