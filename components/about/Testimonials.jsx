import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { useRef, useEffect } from "react";

const Testimonials = () => {
  const scrollRef = useRef(null);

  const testimonials = [
    {
      name: "Chị Thu",
      role: "Phường Xương Giang, thành phố Bắc Giang",
      feedback:
        "Không chỉ rau củ ngon, Eco Bắc Giang còn mang đến cảm giác như được chăm sóc tận tình. Đây là lý do tôi luôn ủng hộ",
      imageUrl: "/images/chi-thu.jpg",
    },
    {
      name: "Cô Hà",
      role: "Phường Hoàng Văn Thụ, thành phố Bắc Giang",
      feedback:
        "Gia đình tôi tin tưởng Eco Bắc Giang vì sự cam kết về chất lượng và an toàn thực phẩm. Sử dụng rau củ ở đây, tôi cảm thấy hoàn toàn yên tâm",
      imageUrl: "/images/co-ha.jpg",
    },
    {
      name: "Chị Hoa",
      role: "Thị trấn Đồi Ngô, huyện Lục Nam",
      feedback:
        "Nhân viên hỗ trợ nhiệt tình, từ tư vấn sản phẩm đến giao hàng. Thật sự hài lòng với dịch vụ của Eco Bắc Giang",
      imageUrl: "/images/chi-hoa.jpg",
    },
    {
      name: "Chị Oanh",
      role: "Phường Nếnh, thị xã Việt Yên",
      feedback:
        "Tôi thích cách Eco Bắc Giang ứng dụng công nghệ trong nông nghiệp để đảm bảo chất lượng sản phẩm. Đây là sự khác biệt mà ít thương hiệu làm được.",
      imageUrl: "/images/oanh.jpg",
    },
  ];

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    // Xử lý cuộn vô tận
    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

      // Nếu cuộn đến cuối danh sách, quay lại giữa
      if (scrollLeft + clientWidth >= scrollWidth - 1) {
        scrollContainer.scrollLeft = clientWidth;
      }

      // Nếu cuộn về đầu danh sách, quay lại giữa
      if (scrollLeft <= 0) {
        scrollContainer.scrollLeft = scrollWidth - 2 * clientWidth;
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    // Đặt vị trí ban đầu ở giữa danh sách
    scrollContainer.scrollLeft = scrollContainer.scrollWidth / 2;

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleNext = () => {
    scrollRef.current.scrollBy({ left: 324, behavior: "smooth" });
  };

  const handlePrevious = () => {
    scrollRef.current.scrollBy({ left: -324, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h4 className="text-2xl font-semibold text-center select-none uppercase">
        Phản hồi của khách hàng
      </h4>

      <div className="relative flex items-center w-full max-w-7xl">
        <button
          onClick={handlePrevious}
          className="absolute left-0 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-200"
          aria-label="Previous"
        >
          <FiArrowLeft className="text-xl text-black" />
        </button>

        <div
          ref={scrollRef}
          className="flex p-8 space-x-6 overflow-x-auto w-full scrollbar-thin select-none hidden-scrollbar"
        >
          {[...testimonials, ...testimonials, ...testimonials].map(
            (item, index) => (
              <div
                key={index}
                className="max-w-[300px] cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex-shrink-0 select-none"
              >
                <p className="text-gray-600 italic mb-4">{item.feedback}</p>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-4"
                />
                <h3 className="text-center mt-2 text-lg font-medium select-none">
                  {item.name}
                </h3>
                <p className="text-center text-green-600 font-medium">
                  {item.role}
                </p>
              </div>
            )
          )}
        </div>

        <button
          onClick={handleNext}
          className="absolute right-0 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-200"
          aria-label="Next"
        >
          <FiArrowRight className="text-xl text-black" />
        </button>
      </div>
    </div>
  );
};

export default Testimonials;
