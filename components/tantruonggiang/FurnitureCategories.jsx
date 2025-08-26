// components/tantruonggiang/FurnitureCategories.js
import { useState } from "react";
import { FaCouch, FaTable, FaBox, FaBoxOpen, FaPaintbrush, FaSink, FaLaptop, FaChair } from "react-icons/fa"; // Replaced FaCabinet with FaBoxOpen, FaDesk with FaLaptop

export default function FurnitureCategories() {
  const [backgroundImage, setBackgroundImage] = useState("/images/tam-nhin.jpg");

  const categories = [
    { name: "Sofa", icon: <FaCouch className="text-orange-500" />, image: "/images/tam-nhin.jpg" },
    { name: "Tea Table", icon: <FaTable className="text-orange-500" />, image: "/images/tam-nhin.jpg" },
    { name: "Storage Furniture", icon: <FaBox className="text-orange-500" />, image: "/images/tam-nhin.jpg" },
    { name: "Cabinet", icon: <FaBoxOpen className="text-orange-500" />, image: "/images/tam-nhin.jpg" }, // Replaced FaCabinet with FaBoxOpen
    { name: "Decors", icon: <FaPaintbrush className="text-orange-500" />, image: "/images/tam-nhin.jpg" },
    { name: "Kitchen", icon: <FaSink className="text-orange-500" />, image: "/images/tam-nhin.jpg" },
    { name: "Office Table", icon: <FaLaptop className="text-orange-500" />, image: "/images/tam-nhin.jpg" }, // Replaced FaDesk with FaLaptop
    { name: "Furniture", icon: <FaChair className="text-orange-500" />, image: "/images/tam-nhin.jpg" },
  ];

  return (
    <section className="relative py-12 md:py-16">
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ul className="flex flex-wrap justify-center gap-4 md:gap-8 text-white text-lg md:text-2xl font-semibold">
          {categories.map((category, index) => (
            <li
              key={index}
              className="flex items-center gap-2 cursor-pointer hover:text-orange-500 transition-colors duration-300"
              onMouseEnter={() => setBackgroundImage(category.image)}
            >
              {category.icon}
              <span>{category.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}