import React, { useState } from "react";
import { FaShoppingCart, FaRegHeart, FaHeart } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { FiSearch, FiGrid, FiList } from "react-icons/fi";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function Product3() {
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [isFavorite, setIsFavorite] = useState(false);

  const products = [
    {
      name: "Organic Banana",
      image: "/product/banana.png",
      price: 10000,
      salePrice: 12000,
      ratings: 4,
      description: "Fresh organic bananas, rich in flavor and nutrients.",
    },
    {
      name: "Organic Tomato",
      image: "/product/tomato.png",
      price: 60000,
      salePrice: 90000,
      ratings: 3,
      description: "High-quality organic tomatoes for your daily meals.",
    },
    // Add more products as needed
  ];

  const handleToggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-6 px-4 md:px-0">
        {/* Header Section */}
        <header className="bg-white shadow mb-4 p-4 rounded flex justify-between items-center">
          <div className="flex items-center space-x-4 w-full">
            <div className="relative w-full">
              <FiSearch className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search keyword..."
                className="border rounded pl-10 pr-4 py-2 w-full"
              />
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <button
                className={`px-4 py-2 rounded flex items-center justify-center ${
                  viewMode === "grid" ? "bg-green-500 text-white" : "border"
                }`}
                onClick={() => setViewMode("grid")}
              >
                <FiGrid />
              </button>
              <button
                className={`px-4 py-2 rounded flex items-center justify-center ${
                  viewMode === "list" ? "bg-green-500 text-white" : "border"
                }`}
                onClick={() => setViewMode("list")}
              >
                <FiList />
              </button>
            </div>
            <button className="bg-white border px-5 py-1 rounded flex items-center justify-center space-x-2">
              <span>Sort</span>
              <BsChevronDown />
            </button>
          </div>
        </header>

        {/* Product Section */}
        <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-4 gap-4" : "space-y-4"}>
          {products.map((product, idx) => (
            viewMode === "grid" ? (
              <div
                key={idx}
                className="bg-white p-4 rounded shadow hover:shadow-md transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h2 className="text-lg font-semibold">{product.name}</h2>
                <div className="flex items-center space-x-2 text-sm">
                  <p className="text-gray-400 line-through">{formatCurrency(product.salePrice)}</p>
                  <p className="text-green-600 font-bold">{formatCurrency(product.price)}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button className="p-2 border rounded text-green-600">
                    <FaShoppingCart />
                  </button>
                  <button
                    className={`p-2 border rounded ${
                      isFavorite ? "text-red-500" : "text-gray-400"
                    }`}
                    onClick={handleToggleFavorite}
                  >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
              </div>
            ) : (
              <div
                key={idx}
                className="flex items-center space-x-4 bg-white p-4 rounded shadow hover:shadow-md transition"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-lg">{product.name}</h2>
                  <p className="text-gray-500 line-through">{formatCurrency(product.salePrice)}</p>
                  <p className="text-green-600 font-bold">{formatCurrency(product.price)}</p>
                  <p className="text-sm text-gray-600">{product.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 border rounded text-green-600">
                    <FaShoppingCart />
                  </button>
                  <button
                    className={`p-2 border rounded ${
                      isFavorite ? "text-red-500" : "text-gray-400"
                    }`}
                    onClick={handleToggleFavorite}
                  >
                    {isFavorite ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}
