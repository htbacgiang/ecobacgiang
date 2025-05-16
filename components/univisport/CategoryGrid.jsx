import React from "react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Đồng phục Gym",
    slug: "/san-pham/dong-phuc-gym", // Slug tùy chỉnh
    image: "/product/dong-phuc-gym/banner-1.jpg",
    width: 300,
    height: 300,
    rowSpan: 1,
    colSpan: 1,
  },
  {
    name: "Yoga - Pilates",
    slug: "/san-pham/dong-phuc-yoga-pilates", // Slug tùy chỉnh
    image: "/product/dong-phuc-gym/univi-1.webp",
    width: 300,
    height: 620,
    rowSpan: 2,
    colSpan: 1,
  },
  {
    name: "Chạy bộ",
    slug: "/san-pham/chay-bo", // Slug tùy chỉnh
    image: "/product/dong-phuc-gym/dong-phuc-chay-bo.jpg",
    width: 300,
    height: 300,
    rowSpan: 1,
    colSpan: 1,
  },
  {
    name: "Đồng phục Lễ Tân",
    slug: "/san-pham/dong-phuc-le-tan", // Slug tùy chỉnh
    image: "/product/dong-phuc-gym/dong-phuc-tenis-gofl.jpg",
    width: 300,
    height: 300,
    rowSpan: 1,
    colSpan: 1,
  },
  {
    name: "Pickleball",
    slug: "/san-pham/pickleball", // Slug tùy chỉnh
    image: "/product/dong-phuc-gym/dong-phuc-pickleball.webp",
    width: 300,
    height: 300,
    rowSpan: 1,
    colSpan: 1,
  },
  {
    name: "MMA Đồng phục",
    slug: "/san-pham/dong-phuc-mma", // Slug tùy chỉnh
    image: "/product/dong-phuc-gym/mma-dong-phuc.jpg",
    width: 600,
    height: 300,
    rowSpan: 1,
    colSpan: 2,
  },

];

const getAspectRatio = (category) => {
  if (category.name === "MMA Đồng phục") return "aspect-[2/1]";
  if (category.name === "Yoga - Pilates") return "aspect-[300/620]";
  return "aspect-[1/1]";
};

export default function CategoryGrid() {
  return (
    <section className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((c, i) => (
          <Link
            key={i}
            href={`/${c.slug || c.name.toLowerCase().replace(/\s+/g, "-")}`} // Sử dụng slug tùy chỉnh, fallback về tên nếu không có slug
            aria-label={`View ${c.name} products`}
            className={`
              relative overflow-hidden rounded-lg
              transition-transform duration-300 hover:scale-105
              ${c.rowSpan === 2 ? "row-span-2 lg:row-span-2" : ""}
              ${c.colSpan === 2 ? "col-span-2 lg:col-span-2" : "col-span-1"}
            `}
          >
            <div className={`relative w-full ${getAspectRatio(c)}`}>
              <Image
                src={c.image}
                alt={c.name}
                fill
                style={{ objectFit: "cover" }}
                className="rounded-lg"
                sizes="(max-width: 768px) 50vw, 25vw"
                priority={i < 2}
                placeholder="blur"
                blurDataURL="/product/dong-phuc-gym/placeholder.jpg"
              />
            </div>
            {c.name === "Special Discount" && c.discountText && (
              <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                <div className="text-white">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-500 whitespace-pre-line">
                    {c.discountText.split("\n")[0]}
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg font-semibold whitespace-pre-line">
                    {c.discountText.split("\n")[1]}
                  </p>
                </div>
              </div>
            )}
            <div className="absolute bottom-4 left-4 bg-[#105d97] text-white px-4 py-2 rounded">
              <h3 className="text-xs sm:text-sm font-semibold">{c.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}