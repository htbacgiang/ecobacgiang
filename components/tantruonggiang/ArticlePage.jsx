// components/ArticlePage.js
import Link from 'next/link';
import Image from 'next/image';
import ContactForm from '../profiles/ContactForm';

export default function ArticlePage() {
  return (
    <article className="max-w-full text-base">
      {/* Article Content */}
      <section className="prose max-w-none">
        {/* Phần 1: Giới thiệu - Đổi nền thành màu đen */}
        <div className="">
          <h2 className="">1. Giới thiệu</h2>
          <p className="">
            Trong bối cảnh đô thị hóa ngày càng phát triển, nhu cầu về không gian sống tiện nghi và thẩm mỹ ở các căn hộ chung cư đang ngày một tăng cao. Nhiều gia đình hiện nay ưu tiên lựa chọn nội thất gỗ công nghiệp nhờ vào những ưu điểm vượt trội so với vật liệu truyền thống. Đặc biệt, thi công nội thất gỗ công nghiệp cho chung cư không chỉ mang lại vẻ đẹp hiện đại, tinh tế mà còn giúp tối ưu hóa công năng sử dụng của mỗi không gian sống.
          </p>
          <p className="">
            Gỗ công nghiệp được ưa chuộng bởi sự đa dạng trong mẫu mã và màu sắc, dễ dàng kết hợp với nhiều phong cách thiết kế nội thất khác nhau. Nhờ vào quy trình sản xuất tiên tiến, sản phẩm gỗ công nghiệp có khả năng chống mối mọt, chịu được độ ẩm cao và dễ dàng bảo trì, từ đó giảm thiểu chi phí về lâu dài.
          </p>
          <p className="">
            Không chỉ dừng lại ở đó, quá trình thi công nội thất gỗ công nghiệp cho chung cư còn đòi hỏi sự chuyên nghiệp và tỉ mỉ từ các nhà thầu uy tín, đảm bảo chất lượng và an toàn cho sản phẩm.
          </p>
        </div>
        {/* Hình ảnh sau phần Giới thiệu */}
        <div className="my-8">
          <Image
            src="/images/noi-that-1.jpg"
            alt="Giới thiệu nội thất gỗ công nghiệp"
            width={800}
            height={600}
            className="rounded"
          />
        </div>

        {/* Phần 2: Ưu điểm của gỗ công nghiệp */}
        <h2>2. Ưu điểm của gỗ công nghiệp trong nội thất chung cư</h2>
        <h3>2.1 Chi phí và hiệu quả kinh tế</h3>
        <p>
          Gỗ công nghiệp được sản xuất qua quy trình hiện đại giúp tối ưu hóa chi phí so với gỗ tự nhiên. Sản xuất hàng loạt với chi phí thấp giúp chủ đầu tư tiết kiệm chi phí ban đầu và giảm chi phí bảo trì sau này.
        </p>
        <h3>2.2 Đa dạng mẫu mã và thiết kế</h3>
        <p>
          Sản phẩm gỗ công nghiệp có khả năng mô phỏng vẻ đẹp tự nhiên của gỗ thật hoặc tạo ra các mẫu mã độc đáo, phù hợp với nhiều phong cách nội thất từ tối giản đến cổ điển.
        </p>
        <h3>2.3 Độ bền và dễ bảo trì</h3>
        <p>
          Với khả năng chịu nước, chống mối mọt và dễ bảo trì, gỗ công nghiệp giúp duy trì vẻ đẹp và độ bền của sản phẩm qua thời gian.
        </p>
        {/* Hình ảnh sau phần Ưu điểm */}
        <div className="my-8">
          <Image
            src="/images/noi-that-2.jpg"
            alt="Ưu điểm của gỗ công nghiệp"
            width={800}
            height={600}
            className="rounded"
          />
        </div>

        {/* Phần 3: Quy trình thi công */}
        <h2>3. Quy trình thi công nội thất gỗ công nghiệp cho chung cư</h2>
        <p>
          Quy trình thi công được thực hiện theo các bước chuyên nghiệp nhằm đảm bảo chất lượng và độ an toàn của sản phẩm.
        </p>
        <h3>Bước 1: Tư vấn và lập kế hoạch</h3>
        <ul>
          <li>
            <strong>Tiếp cận và lắng nghe:</strong> Gặp gỡ trực tiếp hoặc trao đổi qua điện thoại, email để hiểu nhu cầu và phong cách sống của chủ nhà.
          </li>
          <li>
            <strong>Phân tích không gian:</strong> Đánh giá chi tiết từng khu vực trong chung cư.
          </li>
          <li>
            <strong>Lập kế hoạch tổng thể:</strong> Đưa ra phương án thiết kế sơ bộ và đề xuất cách bố trí tối ưu.
          </li>
        </ul>
        <h3>Bước 2: Thiết kế chi tiết</h3>
        <ul>
          <li>
            <strong>Hợp tác cùng kiến trúc sư:</strong> Tạo ra bản vẽ thiết kế chi tiết.
          </li>
          <li>
            <strong>Tùy chỉnh theo yêu cầu:</strong> Điều chỉnh thiết kế phù hợp với không gian thực tế.
          </li>
          <li>
            <strong>Phê duyệt thiết kế:</strong> Khách hàng đóng góp ý kiến để hoàn thiện.
          </li>
        </ul>
        <h3>Bước 3: Lựa chọn vật liệu và đơn vị thi công</h3>
        <ul>
          <li>
            <strong>Tiêu chí lựa chọn vật liệu:</strong> Chọn vật liệu đạt tiêu chuẩn, có khả năng chống mối mọt, chịu nước và dễ bảo trì.
          </li>
          <li>
            <strong>Đánh giá đơn vị thi công:</strong> Lựa chọn đối tác uy tín với quy trình chuyên nghiệp.
          </li>
          <li>
            <strong>Báo giá minh bạch:</strong> Cung cấp bảng báo giá chi tiết.
          </li>
        </ul>
        <h3>Bước 4: Thực hiện thi công và hoàn thiện</h3>
        <ul>
          <li>
            <strong>Đo đạc chính xác:</strong> Xác định kích thước và vị trí chi tiết.
          </li>
          <li>
            <strong>Gia công và sản xuất:</strong> Các bộ phận được gia công theo đúng bản vẽ.
          </li>
          <li>
            <strong>Lắp đặt tại hiện trường:</strong> Sản phẩm được lắp đặt chính xác và an toàn.
          </li>
          <li>
            <strong>Hoàn thiện chi tiết:</strong> Kiểm tra độ bền và xử lý các chi tiết nhỏ.
          </li>
        </ul>
        <h3>Bước 5: Bảo trì và kiểm tra chất lượng sau thi công</h3>
        <ul>
          <li>
            <strong>Hướng dẫn bảo quản:</strong> Cung cấp các chỉ dẫn cụ thể về cách bảo quản và vệ sinh.
          </li>
          <li>
            <strong>Kiểm tra định kỳ:</strong> Hỗ trợ kiểm tra và bảo trì sản phẩm.
          </li>
          <li>
            <strong>Chăm sóc hậu mãi:</strong> Tư vấn và hỗ trợ khách hàng sau thi công.
          </li>
        </ul>
        {/* Hình ảnh sau phần Quy trình thi công */}
        <div className="">
          <Image
            src="/go-cong-nghiep/quy-trinh-trien-khai-dich-vu.png"
            alt="Quy trình thi công nội thất gỗ công nghiệp"
            width={800}
            height={600}
            className="rounded"
          />
        </div>

        {/* Phần 4: Các lưu ý khi thi công */}
        <h2>4. Các lưu ý khi thi công nội thất gỗ công nghiệp cho chung cư</h2>
        <h3>4.1 Chọn đơn vị thi công uy tín</h3>
        <ul>
          <li>
            <strong>Đánh giá kinh nghiệm và thành tích:</strong> Tìm hiểu quá trình hoạt động và các dự án đã thực hiện của đơn vị thi công.
          </li>
          <li>
            <strong>Phản hồi từ khách hàng:</strong> Đánh giá từ người dùng đã sử dụng dịch vụ.
          </li>
          <li>
            <strong>Giấy phép và chứng nhận:</strong> Đảm bảo có đầy đủ giấy phép và chứng nhận chất lượng.
          </li>
          <li>
            <strong>Hợp đồng rõ ràng:</strong> Thỏa thuận điều khoản, tiến độ và chính sách bảo hành.
          </li>
        </ul>
        <h3>4.2 Lựa chọn vật liệu phù hợp</h3>
        <ul>
          <li>
            <strong>Kiểm tra chất lượng vật liệu:</strong> Chọn vật liệu có chứng nhận đạt tiêu chuẩn, chịu nước và chống mối mọt.
          </li>
          <li>
            <strong>Nguồn gốc rõ ràng:</strong> Sản phẩm cần có nguồn gốc từ các nhà sản xuất uy tín.
          </li>
          <li>
            <strong>Chính sách bảo hành:</strong> Ưu tiên sản phẩm đi kèm bảo hành.
          </li>
        </ul>
        <h3>4.3 Bảo trì định kỳ</h3>
        <ul>
          <li>
            <strong>Hướng dẫn bảo dưỡng:</strong> Cung cấp chỉ dẫn cụ thể về cách bảo quản và vệ sinh định kỳ.
          </li>
          <li>
            <strong>Sử dụng sản phẩm chăm sóc phù hợp:</strong> Khuyến nghị các sản phẩm không chứa hóa chất mạnh để bảo vệ bề mặt.
          </li>
          <li>
            <strong>Kiểm tra định kỳ:</strong> Thực hiện kiểm tra thường xuyên để phát hiện sớm các hư hỏng.
          </li>
        </ul>
        {/* Hình ảnh sau phần Lưu ý */}
        <div className="my-8">
          <Image
            src="/go-cong-nghiep/hoan-thien.png"
            alt="Lưu ý khi thi công nội thất gỗ công nghiệp"
            width={800}
            height={600}
            className="rounded"
          />
        </div>

        {/* Phần 5: Mẫu thiết kế */}
        <h2>5. Mẫu thiết kế nội thất gỗ công nghiệp cho chung cư</h2>
        <p>
          Trong những năm gần đây, thiết kế nội thất chung cư với gỗ công nghiệp đang chuyển mình theo hướng hiện đại và tối giản. Xu hướng này tập trung vào tối ưu hóa không gian sống, kết hợp sự tinh tế của vật liệu gỗ công nghiệp với đường nét thiết kế sắc sảo và sạch sẽ.
        </p>
        <ul>
          <li>
            <strong>Tối giản và hiện đại:</strong> Sử dụng gam màu trung tính như trắng, xám, be kết hợp với điểm nhấn từ màu gỗ tự nhiên.
          </li>
          <li>
            <strong>Tích hợp ánh sáng tự nhiên:</strong> Bố trí cửa sổ hợp lý kết hợp với đèn LED tạo không gian sống dễ chịu.
          </li>
          <li>
            <strong>Ứng dụng công nghệ và vật liệu tiên tiến:</strong> Sản phẩm được xử lý tinh tế, chống ẩm, chịu mối mọt và dễ bảo trì.
          </li>
        </ul>
        {/* Thêm lưới 4 hình ảnh */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
          <div className="relative w-full h-64">
            <Image
              src="/go-cong-nghiep/noi-that-phong-khach.jpg" // Hình ảnh phòng khách
              alt="Phòng khách nội thất gỗ công nghiệp"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
          <div className="relative w-full h-64">
            <Image
              src="/go-cong-nghiep/tu-bep-nhua-canh-go-cong-nghiep.jpg" // Hình ảnh phòng khách

              alt="Phòng bếp nội thất gỗ công nghiệp"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
          <div className="relative w-full h-64">
            <Image
              src="/go-cong-nghiep/noi-that-phong-an.jpg" // Hình ảnh phòng khách
              alt="Phòng ngủ nội thất gỗ công nghiệp"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
          <div className="relative w-full h-64">
            <Image
              src="/go-cong-nghiep/phong-ngu.jpg" // Hình ảnh phòng khách

              alt="Phòng thay đồ nội thất gỗ công nghiệp"
              layout="fill"
              objectFit="cover"
              className="rounded"
            />
          </div>
        </div>
            {/* Phần 6: Kết luận và Kêu gọi Hành động */}
        
        <p>
          Thi công nội thất gỗ công nghiệp cho chung cư mang lại nhiều lợi ích vượt trội:
        </p>
        <ul>
          <li>
            <strong>Thẩm mỹ hiện đại:</strong> Sản phẩm đa dạng về mẫu mã, màu sắc và kiểu dáng, phù hợp với nhiều phong cách trang trí.
          </li>
          <li>
            <strong>Tiết kiệm chi phí:</strong> Giảm chi phí sản xuất và bảo trì so với gỗ tự nhiên.
          </li>
          <li>
            <strong>Dễ bảo trì:</strong> Với khả năng chịu nước và chống mối mọt, sản phẩm luôn giữ được vẻ đẹp qua thời gian.
          </li>
          <li>
            <strong>Quy trình thi công chuyên nghiệp:</strong> Từ tư vấn, thiết kế đến lắp đặt, mọi công đoạn đều được thực hiện tỉ mỉ.
          </li>
        </ul>
        <p>
          Nếu bạn đang tìm kiếm giải pháp nội thất hiện đại, tiện nghi cho căn hộ chung cư của mình, hãy để chúng tôi giúp bạn biến ý tưởng thành hiện thực.
        </p>
        <p>
          <strong>Nhận tư vấn miễn phí:</strong> Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng lắng nghe và đưa ra những gợi ý thiết kế phù hợp với không gian sống của bạn.
        </p>
        <p>
          <strong>Báo giá minh bạch:</strong> Chúng tôi cam kết mang đến bảng báo giá chi tiết, rõ ràng và cạnh tranh, giúp bạn dễ dàng kiểm soát chi phí.
        </p>
        <p>
          <strong>Đừng chần chừ!</strong> Hãy nhấn nút “Liên hệ ngay” hoặc gọi qua số điện thoại [số điện thoại] để bắt đầu hành trình cải tạo không gian sống của bạn với nội thất gỗ công nghiệp chất lượng cao.
        </p>
        {/* Hình ảnh sau phần Kết luận */}
      </section>
    </article>
  );
}