import React from 'react';

const ProductCard = ({ image, discount, name, rating, reviews, price, originalPrice, inStock }) => {
  return (
    <div className="w-full sm:w-48 md:w-56 lg:w-60 bg-white rounded-lg shadow-md p-4 flex flex-col items-center transition-transform transform hover:scale-105">
      {/* Discount Badge */}
      <div className="relative w-full">
        <img src={image} alt={name} className="w-full h-32 object-contain" />
    
        <button className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2">{name}</h3>
        <div className="flex justify-start items-center mt-1">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 15l-5.5 3 1-5.5L2 7.5l5.5-.5L10 2l2.5 5 5.5.5-3.5 4.5 1 5.5z"></path>
            </svg>
          ))}
          <span className="ml-1 text-xs text-gray-500">({reviews} Reviews)</span>
        </div>
     <div className='flex justify-between'>
     <div className="mt-2 flex justify-center items-center">
          <span className="text-lg font-bold text-gray-900">${price}</span>
          <span className="ml-2 text-sm text-gray-500 line-through">${originalPrice}</span>
        </div>
        <div className="mt-1 flex justify-center items-center">
          <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
          <span className="ml-1 text-xs text-green-500">{inStock}</span>
        </div>
     </div>
      </div>

      {/* Add to Cart Button */}
      <button className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex justify-center items-center">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;