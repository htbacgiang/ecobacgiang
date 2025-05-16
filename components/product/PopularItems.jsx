import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useRef, useState, useEffect } from "react";

const PopularItems = () => {
  const scrollRef = useRef(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const checkScrollPosition = () => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

    setCanScrollPrev(scrollLeft > 0); // Show "Previous" button if not at start
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth); // Show "Next" button if not at end
  };

  const handleNext = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const handlePrevious = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    checkScrollPosition();

    scrollContainer.addEventListener("scroll", checkScrollPosition);

    return () => {
      scrollContainer.removeEventListener("scroll", checkScrollPosition);
    };
  }, []);

  const handleMouseDown = (e) => {
    const scrollContainer = scrollRef.current;
    scrollContainer.isDown = true;
    scrollContainer.startX = e.pageX - scrollContainer.offsetLeft;
    scrollContainer.scrollLeftStart = scrollContainer.scrollLeft;
  };

  const handleMouseMove = (e) => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer.isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - scrollContainer.startX) * 1.5;
    scrollContainer.scrollLeft = scrollContainer.scrollLeftStart - walk;
  };

  const handleMouseUpOrLeave = () => {
    const scrollContainer = scrollRef.current;
    scrollContainer.isDown = false;
  };

  const categories = [
    { name: "Rau ăn lá", image: "/product/rau-an-la.webp" },
    { name: "Hoa củ quả", image: "/product/hoa-cu-qua.png" },
    { name: "Rau gia vị", image: "/product/rau-gia-vi.webp" },
    { name: "Thực phẩm khô", image: "/product/thuc-pham-kho.webp" },
    { name: "Sản phẩm CO.OP", image: "/product/ocop.webp" },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h3 className="text-2xl font-semibold text-center select-none uppercase">
        Danh mục sản phẩm
      </h3>

      <div className="relative flex items-center w-full max-w-4xl ">
        {canScrollPrev && (
          <button
            onClick={handlePrevious}
            className="absolute left-0 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-200"
            aria-label="Previous"
          >
            <FiArrowLeft className="text-xl text-black" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex p-8 space-x-6 overflow-x-auto w-full scrollbar-thin select-none hidden-scrollbar"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {categories.map((category, index) => (
            <div
              key={index}
              className="min-w-[200px] cursor-pointer bg-[#F8F8F8] rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 flex-shrink-0 select-none"
            >
              <div className="relative w-full h-40 overflow-hidden rounded-md">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover rounded-md transition-transform hover:scale-105 ease duration-300"
                  draggable="false" // Ngăn kéo ảnh
                  onDragStart={(e) => e.preventDefault()} // Ngăn sự kiện mặc định khi kéo
                />
              </div>
              <h3 className="text-center mt-2 text-lg font-medium select-none">
                {category.name}
              </h3>
            </div>
          ))}
        </div>

        {canScrollNext && (
          <button
            onClick={handleNext}
            className="absolute right-0 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-200"
            aria-label="Next"
          >
            <FiArrowRight className="text-xl text-black" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PopularItems;
