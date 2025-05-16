import React from "react";
const SubscribeSection = () => {
  return (
    <div
      className="relative bg-cover bg-center text-white py-16 px-5"
      style={{
        backgroundImage: "url('/images/11.jpg')", // Thay bằng link ảnh nền thực tế
      }}
    >
      {/* Lớp phủ tối */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative max-w-screen-lg mx-auto text-center">
        {/* Tiêu đề */}
        <h4 className="text-3xl md:text-4xl font-bold mb-4">
        Mang thiên nhiên và sáng tạo đến hộp thư của bạn.        </h4>

        {/* Mô tả */}
        <p className="text-base mb-6">
        Chúng tôi gieo mầm sức khỏe và đổi mới. 
        <br/>
        Đăng ký nhận bản tin để cập nhật kiến thức nông nghiệp thông minh, rau củ hữu cơ tươi ngon, ưu đãi độc quyền và nhiều hơn thế.
        </p>

        {/* Form đăng ký */}
        <form className="flex items-center justify-center max-w-2xl mx-auto gap-2">
          <input
            type="email"
            placeholder="*Email"
            className="w-full px-4 py-3 rounded-md  text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="submit"
            className="px-6 py-3 uppercase bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300 whitespace-nowrap"
          >
            Đăng ký
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscribeSection;
