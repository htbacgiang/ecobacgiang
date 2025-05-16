"use client";

import React from 'react';

const DealCard = ({ title, dealType, discount, productName, imageUrl, bgColor }) => {
  return (
    <div className={`flex flex-col md:flex-row items-center justify-between p-6 rounded-lg ${bgColor} max-w-7xl mx-auto px-4 py-6 `}>
      <div className="text-left">
        <div className="text-pink-600 font-semibold">{dealType}</div>
        <h2 className="text-2xl font-bold text-gray-900 mt-2">{productName}</h2>
        <p className="text-green-600 font-medium mt-1">{discount}</p>
        <div className="mt-4">
          <button className="text-green-600 font-medium hover:underline">Shop Now <span>→</span></button>
        </div>
      </div>
      <img src={imageUrl} alt={productName} className="mt-4 md:mt-0 md:ml-6 w-48 h-48 object-cover" />
    </div>
  );
};

const DealsSection = () => {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-6 p-6">
      <DealCard
        title="Today's Deal"
        dealType="Today's Deal"
        discount="Up to 70% off!"
        productName="Natural Orange Juice"
        imageUrl="https://via.placeholder.com/300x200.png?text=Orange+Juice"
        bgColor="bg-red-100"
      />
      <DealCard
        title="Monthly Deal"
        dealType="Monthly Deal"
        discount="Up to 70% off!"
        productName="Organic Milk"
        imageUrl="https://via.placeholder.com/300x200.png?text=Organic+Milk"
        bgColor="bg-blue-100"
      />
    </div>
  );
};

export default DealsSection;