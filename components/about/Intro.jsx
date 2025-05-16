import React from "react";

const Intro = () => {
  return (
    <div className="bg-white py-12">
      <div className="container md:w-10/12 mx-auto px-4">
        {/* Phần tiêu đề */}

        {/* Nội dung chính */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cột bên trái */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold text-green-700 flex items-center mb-4">
              Sản Xuất Hữu Cơ Thuận Tự Nhiên
            </h2>
            <p className="mb-6">
            Triết lý của chúng tôi bắt nguồn từ sự tôn trọng tự nhiên. Eco Bắc Giang sản xuất các loại rau theo hướng hữu cơ với 5 KHÔNG:
            </p>
            
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li>KHÔNG THUỐC BẢO VỆ THỰC VẬT HOÁ HỌC</li>
              <li>KHÔNG PHÂN BÓN HOÁ HỌC</li>
              <li>KHÔNG CÂY TRỒNG BIẾN ĐỔI GEN</li>
              <li>KHÔNG CHẤT KÍCH THÍCH SINH TRƯỞNG SINH TRƯỞNG</li>
              <li>KHÔNG THUỐC DIỆT CỎ</li>
            </ul>
          </div>

          {/* Cột bên phải */}
          <div className="md:w-1/2">
            <h2 className="text-2xl font-bold text-green-700 mb-4">Công Nghệ Thông Minh Trong Canh Tác</h2>
            <ul className="space-y-6">
              <li>
                <p>
                Bên cạnh việc giữ gìn những giá trị truyền thống, Eco Bắc Giang còn là biểu tượng của sự đổi mới. Chúng tôi sử dụng các công nghệ hiện đại như Internet Vạn Vật (IoT) để quản lý và tối ưu hóa nông nghiệp. Các cảm biến được đặt chiến lược trên các cánh đồng để thu thập dữ liệu về độ ẩm, nhiệt độ và dinh dưỡng trong đất. Thông tin này giúp chúng tôi tưới tiêu chính xác và điều chỉnh chế độ canh tác một cách tối ưu, giảm thiểu lãng phí tài nguyên.                </p>
              </li>
          
              <li>
               
                <p>
                Đặc biệt, Eco Bắc Giang còn phát triển và ứng dụng các giải pháp robot hiện đại trong nông nghiệp. Những robot này được thiết kế để thực hiện các công việc như gieo hạt, thu hoạch và chăm sóc cây trồng với độ chính xác cao, giảm bớt sức lao động thủ công và tăng cường hiệu quả sản xuất.                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;
