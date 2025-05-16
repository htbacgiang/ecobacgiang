import React from "react";

const CoreValues = () => {
  const values = [
    {
      number: "1",
      title: "Bền vững (Sustainability)",
      details: [
        "Cam kết phát triển hài hòa giữa kinh tế, xã hội và bảo vệ môi trường, góp phần vào mục tiêu Net Zero 2050."
      ],
    },
    {
      number: "2",
      title: "Thuận tự nhiên (Harmony with Nature)",
      details: [
        "Tôn trọng và giữ vững sự cân bằng tự nhiên trong quá trình sản xuất."
      ],
    },
    {
      number: "3",
      title: "Đổi mới sáng tạo (Innovation)",
      details: [
        "Liên tục nghiên cứu và ứng dụng công nghệ hiện đại nhất trong nông nghiệp."
      ],
    },
    {
      number: "4",
      title: "Chất lượng (Quality)",
      details: [
        "Đảm bảo cung cấp sản phẩm rau củ hữu cơ đạt tiêu chuẩn cao nhất."
      ],
    },
    {
      number: "5",
      title: "Trách nhiệm xã hội (Social Responsibility)",
      details: [
        "Thực hiện trách nhiệm với cộng đồng và hệ sinh thái."
      ],
    },
    {
      number: "6",
      title: "Đồng hành và kết nối (Collaboration)",
      details: [
        "Xây dựng mạng lưới hợp tác chặt chẽ với nông dân và đối tác."
      ],
    },
    {
      number: "7",
      title: "Tận tâm và chính trực (Commitment & Integrity)",
      details: [
        "Hoạt động minh bạch và có đạo đức trong mọi quyết định."
      ],
    },
    {
      number: "8",
      title: "Hướng đến tương lai (Future-oriented)",
      details: [
        "Hướng tới các giải pháp lâu dài, đóng góp cho một tương lai xanh và thịnh vượng."
      ],
    },
  ];

  return (
    <div
      className="relative text-white py-12 px-6 mb-5"
      style={{
        backgroundImage: "url('/images/2.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderTopLeftRadius: "5rem", // Bo góc trái trên
        borderBottomRightRadius: "5rem", // Bo góc phải dưới
        borderBottomLeftRadius: "1rem", // Bo góc phải dưới
        borderTopRightRadius: "1rem", // Bo góc phải dưới
      }}
    >
      {/* Lớp phủ mờ */}
      <div
        className="absolute inset-0 bg-green-700 opacity-95 rounded-2xl"
        style={{
          borderTopLeftRadius: "5rem", // Bo góc trái trên
          borderBottomRightRadius: "5rem", // Bo góc phải dưới
          borderBottomLeftRadius: "1rem", // Bo góc phải dưới
          borderTopRightRadius: "1rem", // Bo góc phải dưới
        }}
      ></div>

      <div className="relative max-w-5xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">Giá Trị Cốt Lõi</h2>
        <p className="mb-5 text-base">
          Eco Bắc Giang cam kết xây dựng nền nông nghiệp thông minh, bền vững
          và vì tương lai xanh. <br />Tất cả chúng tôi luôn kiên tâm theo đuổi các giá trị
          cốt lõi đã đặt ra.
        </p>
        <div className="grid grid-cols-1 gap-3">
          {values.map((value, index) => (
            <div
              key={index}
              className="flex items-center rounded-lg transform transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              {/* Số thứ tự */}
              <div className="flex-shrink-0 bg-orange-400 text-white text-xl font-bold w-10 h-10 rounded-tl-lg rounded-br-lg flex items-center justify-center shadow-md">
                {value.number}
              </div>
              {/* Nội dung */}
              <div className="flex flex-col items-start ml-2 text-left text-white text-sm md:flex-row p-2 md:items-center">
                <h3 className=" font-bold md:mr-2">{value.title}: </h3>
                <span className="text-white text-base">{value.details[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoreValues;
