import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Link from "next/link";
// Component custom mũi tên
const CustomPrevArrow = ({ onClick }) => (
  <button className="slick-arrow slick-prev" onClick={onClick}>
    ❮
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button className="slick-arrow slick-next" onClick={onClick}>
    ❯
  </button>
);

export default function PromotionSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    const controller = new AbortController();
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products", { signal: controller.signal });
        if (!res.ok) throw new Error("Lỗi tải sản phẩm");
        const data = await res.json();

        const filteredProducts = data.products.filter(
          (product) => product.month === currentMonth || product.isYearRound
        );

        setProducts(filteredProducts.slice(0, 20));
      } catch (error) {
        if (error.name !== "AbortError")
          console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    return () => controller.abort();
  }, []);

  // Cấu hình Slider
  const settings = {
    dots: false, // Hiển thị dấu chấm dưới slider
    infinite: true, // Lặp lại slider khi hết sản phẩm
    speed: 500, // Tốc độ chuyển slide
    slidesToShow: 6, // Hiển thị 6 sản phẩm mỗi hàng
    slidesToScroll: 1, // Cuộn 1 sản phẩm mỗi lần
    autoplay: true, // Tự động chạy
    autoplaySpeed: 3000, // 3 giây mỗi lần chạy
    arrows: true, // Hiển thị nút điều hướng
    prevArrow: <CustomPrevArrow />, // Nút Previous
    nextArrow: <CustomNextArrow />, // Nút Next
    responsive: [
      {
        breakpoint: 1024, // Khi màn hình < 1024px (Tablet)
        settings: { slidesToShow: 4 }
      },
      {
        breakpoint: 768, // Khi màn hình < 768px (Mobile lớn)
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 480, // Khi màn hình < 480px (Mobile nhỏ)
        settings: { slidesToShow: 2 }
      }
    ]
  };

  return (
    <section className="relative bg-gray-100 py-12 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: `url('/images/background-pattern.jpg')` }}
      ></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            KHUYẾN MÃI THÁNG {currentMonth}
            <span className="text-red-500 ml-2">🔥</span>
          </h2>
          <Link
            href="/all-promotions"
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Xem tất cả →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white shadow-lg rounded-lg overflow-hidden border animate-pulse"
              >
                <div className="w-full h-56 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                  <div className="h-5 bg-gray-300 rounded w-1/2 mt-4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Slider {...settings} className="slider-container">
            {products.map((product) => (
              <div key={product.id} className="p-2">
                <ProductCard product={product} />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
}
