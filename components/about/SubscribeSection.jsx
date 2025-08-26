import React, { useState, useEffect } from "react";

const SubscribeSection = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  // Auto-hide success message after 10 seconds
  useEffect(() => {
    if (messageType === "success" && message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [message, messageType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage("Vui lòng nhập email");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          source: "website",
          ipAddress: "", // Will be set by server
          userAgent: navigator.userAgent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
        setMessageType("success");
        setEmail("");
      } else {
        setMessage(data.message);
        setMessageType("error");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setMessage("Có lỗi xảy ra, vui lòng thử lại sau");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative bg-cover bg-center text-white py-16 px-5"
      style={{
        backgroundImage: "url('/images/11.jpg')",
      }}
    >
      {/* Lớp phủ tối */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative max-w-screen-lg mx-auto text-center">
        {/* Tiêu đề */}
        <h4 className="text-3xl md:text-4xl font-bold mb-4">
          Mang thiên nhiên và sáng tạo đến hộp thư của bạn.
        </h4>

        {/* Mô tả */}
        <p className="text-base mb-6">
          Chúng tôi gieo mầm sức khỏe và đổi mới.
          <br />
          Đăng ký nhận bản tin để cập nhật kiến thức nông nghiệp thông minh, rau củ hữu cơ tươi ngon, ưu đãi độc quyền và nhiều hơn thế.
        </p>

                 {/* Message Display */}
         {message && (
           <div className="flex justify-center mb-4">
             <div className={`px-4 py-3 rounded-md inline-block ${
               messageType === "success" 
                 ? "bg-green-500 text-white" 
                 : "bg-red-500 text-white"
             }`}>
               {message}
             </div>
           </div>
         )}

        {/* Form đăng ký */}
        <form onSubmit={handleSubmit} className="flex items-center justify-center max-w-2xl mx-auto gap-2">
          <input
            type="email"
            placeholder="*Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`px-6 py-3 uppercase font-semibold rounded-md transition duration-300 whitespace-nowrap ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            } text-white`}
          >
            {isLoading ? "Đang gửi..." : "Đăng ký"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscribeSection;
