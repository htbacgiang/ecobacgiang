import React, { useState, useEffect } from "react";

const CoreValues = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-100 overflow-hidden">
      <div className="p-8 lg:p-12">
        <div className="text-center mb-12">
          <h2 className={`text-xl md:text-3xl font-bold text-gray-800 mb-4 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Giá Trị <span className="text-green-600">Cốt Lõi</span>
          </h2>
          <div className={`w-16 h-1 bg-green-600 rounded-full mx-auto mb-6 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}></div>
          <p className={`text-lg text-gray-600 max-w-2xl mx-auto transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            Eco Bắc Giang cam kết xây dựng nền nông nghiệp thông minh, bền vững và vì tương lai xanh. 
            Tất cả chúng tôi luôn kiên tâm theo đuổi các giá trị cốt lõi đã đặt ra.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map((value, index) => (
            <div
              key={index}
              className={`bg-green-50/50 rounded-2xl p-6 border border-green-100 hover:bg-green-50 transition-all duration-300 group hover:shadow-lg ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${800 + index * 100}ms` }}
            >
              <div className="flex items-start space-x-4">
                {/* Number Badge */}
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-lg">{value.number}</span>
                </div>
                
                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.details[0]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoreValues;
