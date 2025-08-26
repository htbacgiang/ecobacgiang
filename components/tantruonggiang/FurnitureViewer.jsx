"use client";
import React, { useState, useCallback } from "react";

const FurnitureViewer = () => {
  // Link video 360 cho toàn bộ tour
  const videoUrl = "https://www.jegaai.com/720/S5DDIGDJCI"; // Link thực tế, hỗ trợ chuyển đổi giữa các phòng

  // Trạng thái để theo dõi tab đang được chọn
  const [selectedTab, setSelectedTab] = useState("LIVING ROOM");
  // Trạng thái để xử lý lỗi video
  const [videoError, setVideoError] = useState(false);

  // Hàm xử lý khi nhấn vào tab
  const handleTabClick = useCallback((tab) => {
    setSelectedTab(tab);
    // Không thay đổi URL vì tất cả phòng được truy cập từ cùng một tour
  }, []);

  // Danh sách các tab và biểu tượng tương ứng, dựa trên JegaAI scene labels
  const tabs = [
    {
      name: "LIVING ROOM",
      vietnameseName: "PHÒNG KHÁCH",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "DINING ROOM",
      vietnameseName: "PHÒNG ĂN",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 7h18M3 12h18m-7 5h7"
          />
        </svg>
      ),
    },
    {
      name: "KITCHEN",
      vietnameseName: "NHÀ BẾP",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
      ),
    },
    {
      name: "MASTER BEDROOM",
      vietnameseName: "PHÒNG NGỦ CHÍNH",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      ),
    },
    {
      name: "SECOND BEDROOM",
      vietnameseName: "PHÒNG NGỦ PHỤ",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2z"
          />
        </svg>
      ),
    },
   
    {
      name: "CLOAKROOM",
      vietnameseName: "TỦ QUẦN ÁO",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="w-full max-w-6xl mb-6">
        <div className="flex flex-col md:flex-row  mb-4">
          <h2 className="text-lg md:text-2xl font-bold">
            THIẾT KẾ 3D HIỆN ĐẠI – CÔNG NGHỆ VR THỰC TẾ ẢO
          </h2>
        </div>
        <p className="text-gray-300 text-sm md:text-lg max-w-4xl">
          Mang đến trải nghiệm thực tế 360 cho căn hộ tương lai của quý vị một
          cách chân thực và trực quan nhất.
        </p>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-4">
        {/* Video Section */}
        <div className="w-full md:w-2/3 bg-gray-800 rounded-lg overflow-hidden">
          <p className="text-gray-400 text-sm mb-2 text-center">
            Chọn phòng bên dưới và sử dụng thanh điều hướng trong video để xem {selectedTab}
          </p>
          {videoError ? (
            <div className="w-full h-96 md:h-[500px] flex items-center justify-center bg-gray-900">
              <p className="text-red-500 text-lg">
                Không thể tải video. Vui lòng thử lại sau.
              </p>
            </div>
          ) : (
            <iframe
              src={videoUrl}
              className="w-full h-96 md:h-[500px]"
              frameBorder="0"
              allowFullScreen
              title="Thiết kế 360 - Nội Thất Green La Home"
              onError={() => setVideoError(true)}
            ></iframe>
          )}
        </div>

        {/* Menu Section - Grid 2x4 (adjusted for 8 rooms) */}
        <div className="w-full md:w-1/3 grid grid-cols-2 gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab.name)}
              className={`${
                selectedTab === tab.name ? "bg-orange-500" : "bg-gray-800"
              } text-white py-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-orange-600 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500`}
              aria-label={`Chọn ${tab.vietnameseName} để xem trong tour 360`}
            >
              {tab.icon}
              <span className="text-sm font-medium">{tab.vietnameseName}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FurnitureViewer;