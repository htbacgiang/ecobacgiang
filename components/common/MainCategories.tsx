import { FC, useState } from "react";

interface Props {
  onCategorySelect: (category: string | null) => void; // Hàm xử lý khi danh mục được chọn
}

const MainCategories: FC<Props> = ({ onCategorySelect }) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null); // Lưu danh mục đang được chọn

  const handleCategoryClick = (category: string | null) => {
    setActiveCategory(category); // Cập nhật trạng thái active
    onCategorySelect(category); // Gọi hàm callback
  };

  return (
    <div className="flex items-center justify-center">
      <div className="w-full sm:w-11/12 md:w-11/12 rounded-3xl xl:rounded-full p-4 shadow-lg gap-4 flex sm:flex-row flex-wrap items-center justify-center bg-gray-100 mt-5">
        <button
          onClick={() => handleCategoryClick(null)} // Tất cả bài viết
          className={`rounded-full px-4 py-2 text-sm sm:text-base transition duration-300 ${
            activeCategory === null
              ? "bg-blue-800 text-white"
              : "hover:bg-blue-50"
          }`}
        >
          Tất cả bài viết
        </button>
        <button
          onClick={() => handleCategoryClick("Tin tức & Xu hướng")}
          className={`rounded-full px-4 py-2 text-sm sm:text-base transition duration-300 ${
            activeCategory === "Tin tức & Xu hướng"
              ? "bg-blue-800 text-white"
              : "hover:bg-blue-50"
          }`}
        >
          Tin tức & xu hướng
        </button>
        <button
          onClick={() => handleCategoryClick("Chuyện của Farm")}
          className={`rounded-full px-4 py-2 text-sm sm:text-base transition duration-300 ${
            activeCategory === "Chuyện của Farm"
              ? "bg-blue-800 text-white"
              : "hover:bg-blue-50"
          }`}
        >
          Chuyện của Farm
        </button>
        <button
          onClick={() => handleCategoryClick("Công thức nấu ăn")}
          className={`rounded-full px-4 py-2 text-sm sm:text-base transition duration-300 ${
            activeCategory === "Công thức nấu ăn"
              ? "bg-blue-800 text-white"
              : "hover:bg-blue-50"
          }`}
        >
          Công thức nấu ăn
        </button>
        <button
          onClick={() => handleCategoryClick("Sống xanh")}
          className={`rounded-full px-4 py-2 text-sm sm:text-base transition duration-300 ${
            activeCategory === "Sống xanh"
              ? "bg-blue-800 text-white"
              : "hover:bg-blue-50"
          }`}
        >
          Sống xanh
        </button>
      </div>
    </div>
  );
};

export default MainCategories;
