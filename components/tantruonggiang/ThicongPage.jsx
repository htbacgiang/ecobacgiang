// components/ThiCongNoiThatPage.js
import Link from 'next/link';
import Image from 'next/image';
import ContactForm from '../header/ContactForm';
import { useState } from 'react';

export default function ThiCongNoiThatPage() {
  // Trạng thái để điều khiển hiển thị popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Hàm xử lý mở/đóng popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  return (
    <article className="max-w-full text-base">
      {/* Article Content */}
      <section className="prose max-w-none">
        {/* Phần 1: Giới thiệu dịch vụ thi công nội thất trọn gói */}
        <div className="">
          <h1>Thi Công Nội Thất Trọn Gói – GreenLa Home</h1>
          <p>
            Bạn đang tìm cách biến ngôi nhà thành không gian sống tiện nghi, thẩm mỹ mà vẫn tiết kiệm chi phí? Thi công nội thất trọn gói cùng GreenLa Home chính là giải pháp hoàn hảo! Với kinh nghiệm dày dặn và chuyên môn về nội thất gỗ công nghiệp, chúng tôi mang đến dịch vụ từ thiết kế đến lắp đặt, đảm bảo không gian sống hiện đại, bền đẹp và đúng ý bạn.
          </p>
          <div className="my-8">
            <Image
              src="/images/thi-cong-tron-goi-1.jpg"
              alt="Thi công nội thất trọn gói GreenLa Home"
              width={800}
              height={600}
              className="rounded"
            />
          </div>
          <p>
            Chúng tôi là đối tác của các đơn vị uy tín nhất trên thị trường hiện nay:
          </p>
          <ul>
            <li><strong>Vật liệu gỗ công nghiệp:</strong> An Cường, Minh Long, Vanachai (Thái Lan)...</li>
            <li><strong>Phụ kiện nội thất:</strong> Blum, Hafele, Bosch, Caryni...</li>
            <li><strong>Phụ kiện nhà bếp:</strong> Bosch, Garis, Teka, Malloca...</li>
            <li><strong>Vật liệu xây dựng:</strong> Vicostone, Viglacera, Vĩnh Tường, Eurowindow...</li>
          </ul>
          <p>
            Với đội ngũ chuyên nghiệp và đặc biệt ứng dụng công nghệ vào thiết kế, thi công, chúng tôi cam kết dự toán phát sinh &lt;10% nếu GreenLa Home thi công dự án. Cam kết quy trình minh bạch, chi phí hợp lý và bàn giao đúng tiến độ, chúng tôi tự hào kiến tạo tổ ấm mơ ước cho hàng trăm gia đình. Khám phá dịch vụ thi công nội thất trọn gói của GreenLa Home ngay hôm nay để hiện thực hóa không gian sống hoàn hảo!
          </p>
        </div>

        {/* Phần 2: Lợi ích của thi công nội thất trọn gói */}
        <h2>1. Lợi ích của thi công nội thất trọn gói</h2>
        <div className="my-8">
          <Image
            src="/images/thi-cong-tron-goi-2.jpg"
            alt="Lợi ích thi công nội thất trọn gói GreenLa Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <p>
          Việc lựa chọn thi công nội thất trọn gói tại GreenLa Home mang lại trải nghiệm tiện lợi, giúp bạn sở hữu không gian sống hoàn hảo mà không phải lo lắng về từng chi tiết hoàn thiện, tìm nhà thầu uy tín chất lượng mà giá cả lại hợp lý. Bạn sẽ:
        </p>
        <ul>
          <li><strong>Tiết kiệm thời gian:</strong> Quy trình liền mạch từ tư vấn, thiết kế 3D đến thi công giúp bạn nhanh chóng có không gian như ý. Thay vì phối hợp nhiều đơn vị, GreenLa Home lo trọn gói mọi hạng mục, từ cải tạo trần tường sàn, nội thất phòng khách đến bếp, phòng ngủ.</li>
          <li><strong>Kiểm soát ngân sách:</strong> Báo giá minh bạch ngay từ đầu, không phát sinh ẩn, giúp bạn dễ dàng dự trù chi phí. Nội thất gỗ công nghiệp bền đẹp với giá hợp lý, phù hợp mọi gia đình.</li>
          <li><strong>Đồng bộ thẩm mỹ:</strong> Thiết kế và thi công bởi một đội ngũ, đảm bảo phong cách thống nhất, từ hiện đại, Scandinavian đến Luxury nhẹ.</li>
          <li><strong>Cá nhân hóa tối đa:</strong> Mỗi không gian được tùy chỉnh theo nhu cầu, từ tủ âm tường tiết kiệm diện tích đến bàn ăn thông minh.</li>
        </ul>

        {/* Phần 3: Lý do chọn gỗ công nghiệp */}
        <h2>2. Lý do chọn gỗ công nghiệp để hoàn thiện nội thất</h2>
        <div className="my-8">
          <Image
            src="/images/go-cong-nghiep.jpg"
            alt="Nội thất gỗ công nghiệp GreenLa Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <p>
          Nội thất gỗ công nghiệp ngày càng được ưa chuộng trong thi công nội thất trọn gói nhờ sự kết hợp hoàn hảo giữa thẩm mỹ, công năng và chi phí. Tại GreenLa Home, chúng tôi sử dụng gỗ công nghiệp chất lượng cao đến từ các nhà cung cấp uy tín nhất trên thị trường để mang đến không gian sống bền đẹp, đáp ứng mọi nhu cầu của bạn.
        </p>
        <ul>
          <li><strong>Chi phí hợp lý:</strong> So với gỗ tự nhiên, gỗ công nghiệp như MDF chống ẩm có giá thành thấp hơn nhưng vẫn đảm bảo chất lượng, giúp bạn tiết kiệm ngân sách mà không lo giảm giá trị thẩm mỹ.</li>
          <li><strong>Đa dạng thiết kế:</strong> Với nhiều màu sắc và lớp phủ như Melamine, Laminate (vân sồi, trắng, xám), gỗ công nghiệp dễ dàng phù hợp với mọi phong cách, từ hiện đại, Scandinavian đến Luxury nhẹ.</li>
          <li><strong>Độ bền vượt trội:</strong> MDF chống ẩm chịu được khí hậu ẩm ướt của Việt Nam, chống cong vênh, đảm bảo tuổi thọ 10-20 năm.</li>
          <li><strong>Thân thiện môi trường:</strong> Sản xuất theo quy trình bền vững, góp phần bảo vệ tài nguyên thiên nhiên.</li>
          <li><strong>Ứng dụng linh hoạt:</strong> Từ tủ bếp, tủ quần áo đến kệ tivi, giường ngủ, gỗ công nghiệp đáp ứng mọi hạng mục trong thi công nội thất trọn gói.</li>
        </ul>
        <p>
          Đặc biệt, GreenLa Home cam kết bảo hành sản phẩm 5 năm, bảo trì vĩnh viễn sản phẩm do GreenLa Home sản xuất.
        </p>

        {/* Phần 4: GreenLa Home – Đơn vị thi công uy tín */}
        <h2>3. GreenLa Home – Đơn vị thi công nội thất trọn gói uy tín</h2>
        <div className="my-8">
          <Image
            src="/images/thi-cong-greenla.jpg"
            alt="Đội ngũ thi công nội thất GreenLa Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <p>
          GreenLa Home tự hào là đơn vị hàng đầu trong thi công nội thất trọn gói, mang đến không gian sống hiện đại và tiện nghi với nội thất gỗ công nghiệp chất lượng cao.
        </p>
        <ul>
          <li><strong>Kinh nghiệm dày dặn:</strong> Hoàn thiện hàng trăm dự án nhà phố, chung cư, được khách hàng khắp cả nước tin tưởng.</li>
          <li><strong>Vật liệu cao cấp:</strong> Chúng tôi là đối tác của các đơn vị uy tín, chất lượng nên vật liệu đầu vào luôn qua nhiều bước kiểm tra khắt khe để đảm bảo chất lượng đầu ra bền vững.</li>
          <li><strong>Đội ngũ chuyên nghiệp:</strong> Kiến trúc sư trẻ sáng tạo và nhiệt tình, đặc biệt kết hợp công nghệ vào thiết kế nên bản vẽ luôn đảm bảo thẩm mỹ, chất lượng, thời gian. Thiết kế bản vẽ 3D chi tiết, cùng đội thợ lành nghề thi công chính xác theo bản vẽ thiết kế.</li>
          <li><strong>Cam kết chất lượng:</strong> Đúng tiến độ, báo giá minh bạch, bảo hành 5 năm, tư vấn miễn phí tận tâm.</li>
        </ul>
        <p>
          Chọn GreenLa Home, bạn sẽ nhận được dịch vụ thi công nội thất trọn gói đáng tin cậy, biến ngôi nhà thành tổ ấm hoàn hảo!
        </p>

        {/* Phần 5: Quy trình thi công nội thất trọn gói */}
        <h2>4. Quy trình thi công nội thất trọn gói tại GreenLa Home</h2>
        <p>
          Tại GreenLa Home, chúng tôi áp dụng quy trình thi công nội thất trọn gói chuyên nghiệp, minh bạch, đảm bảo mang đến không gian sống hoàn hảo với nội thất gỗ công nghiệp chất lượng cao. Mỗi bước được thực hiện tỉ mỉ, từ ý tưởng đến bàn giao:
        </p>
        <ol>
          <li><strong>Tư vấn & khảo sát:</strong> Lắng nghe nhu cầu khách hàng, đo đạc thực tế để đề xuất giải pháp tối ưu cho từng không gian.</li>
          <li><strong>Thiết kế 3D:</strong> Đội ngũ kiến trúc sư tạo bản vẽ 3D chi tiết, giúp bạn hình dung rõ ràng về nội thất trước khi thi công.</li>
          <li><strong>Báo giá & hợp đồng:</strong> Cung cấp dự toán đầy đủ, minh bạch. Hợp đồng với các điều khoản rõ ràng, không phát sinh chi phí ẩn.</li>
          <li><strong>Sản xuất & thi công:</strong> Nội thất gỗ công nghiệp được sản xuất tại xưởng hiện đại, lắp đặt chính xác bởi thợ lành nghề.</li>
          <li><strong>Bàn giao & bảo hành:</strong> Kiểm tra chất lượng công trình, bàn giao đúng tiến độ, kèm chính sách bảo hành dài hạn.</li>
        </ol>
        <p>
          Với quy trình chặt chẽ, GreenLa Home cam kết mang đến dịch vụ thi công nội thất trọn gói đáng tin cậy, giúp bạn an tâm tận hưởng tổ ấm mơ ước!
        </p>

        {/* Phần 6: Các phong cách thiết kế nội thất phổ biến */}
        <h2>5. Các phong cách thiết kế nội thất phổ biến</h2>
        <p>
          Tại GreenLa Home, chúng tôi mang đến đa dạng phong cách thiết kế trong thi công nội thất trọn gói, sử dụng nội thất gỗ công nghiệp để tạo nên không gian sống độc đáo, phù hợp với mọi sở thích. Dưới đây là các phong cách nổi bật:
        </p>
        <ul>
          <li><strong>Hiện đại:</strong> Đường nét gọn gàng, màu trung tính như trắng, xám. Sofa vải kết hợp tủ bếp chữ L phủ Melamine tạo không gian năng động, phù hợp gia đình trẻ.</li>
          <li><strong>Tối giản:</strong> Loại bỏ chi tiết thừa, ưu tiên công năng. Giường thấp và tủ âm tường gỗ công nghiệp giúp không gian thoáng đãng, lý tưởng cho nhà nhỏ.</li>
          <li><strong>Scandinavian:</strong> Màu pastel, gỗ vân sồi sáng, đèn thả ấm cúng. Kệ tivi và bàn ăn Laminate mang đến sự gần gũi, hoàn hảo cho nhà phố.</li>
          <li><strong>Luxury nhẹ:</strong> Laminate bóng gương, điểm nhấn kim loại mạ vàng. Bàn trà kính và đảo bếp gỗ công nghiệp tạo vẻ sang trọng, tinh tế.</li>
        </ul>
        <p>
          Tất cả phong cách đều được GreenLa Home thực hiện với gỗ công nghiệp chất lượng cao, đảm bảo thẩm mỹ và độ bền. Hãy liên hệ để chọn phong cách phù hợp cho ngôi nhà của bạn!
        </p>

        {/* Phần 7: Báo giá thi công nội thất trọn gói */}
        <h2>6. Báo giá thi công nội thất trọn gói</h2>
        <p>
          GreenLa Home cung cấp dịch vụ thi công nội thất trọn gói với chi phí minh bạch, tối ưu ngân sách, sử dụng nội thất gỗ công nghiệp chất lượng cao. Mức giá năm 2025 tham khảo như sau:
        </p>
        <ul>
          <li><strong>Thiết kế nội thất:</strong> Chỉ từ 150.000 VNĐ/m², tùy phong cách (hiện đại tiết kiệm hơn Luxury). Bao gồm bản vẽ 2D, 3D chi tiết. GreenLa Home sẽ miễn phí thiết kế khi khách hàng ký hợp đồng thi công.</li>
          <li><strong>Thi công trọn gói:</strong> Để có được bảng chi phí không phát sinh, chúng tôi cần có bản thiết kế cụ thể, từ đó mới đưa ra dự toán cụ thể gửi quý khách hàng. GreenLa Home cam kết chi phí phát sinh dưới 10% nếu GreenLa Home thi công.</li>
        </ul>
        <p>
          Khách hàng cần báo giá mẫu có thể liên hệ trực tiếp để chúng tôi gửi quý khách hàng báo giá những công trình chúng tôi đã triển khai. <strong>Hotline: 0962922332</strong>.
        </p>
        <p>
          Chi phí có thể thay đổi dựa trên diện tích, phong cách, và yêu cầu cá nhân hóa (tủ âm tường, đảo bếp…). GreenLa Home cam kết báo giá rõ ràng, không phát sinh ẩn. Liên hệ ngay để được khảo sát miễn phí và nhận báo giá chính xác cho ngôi nhà của bạn!
        </p>

        {/* Phần 8: Dự án tiêu biểu */}
        <h2>7. Dự án tiêu biểu của GreenLa Home</h2>
        <p>
          GreenLa Home tự hào với hàng loạt dự án thi công nội thất trọn gói hoàn thiện, mang đến không gian sống hiện đại, tiện nghi bằng nội thất gỗ công nghiệp. Dưới đây là một số công trình nổi bật:
        </p>
        <h3>7.1 Nhà phố 60m², Quận 7, TP.HCM</h3>
        <p>
          Phong cách hiện đại, phòng khách liền bếp sử dụng gỗ Melamine trắng-xám, tủ âm tường và sofa góc tối ưu diện tích. Khách hàng chia sẻ: “GreenLa Home biến căn nhà nhỏ thành không gian rộng rãi, tiện nghi!”
        </p>
        <div className="my-8">
          <Image
            src="/images/du-an-60m2-q7.jpg"
            alt="Dự án thi công nội thất nhà phố 60m² Quận 7 GreenLa Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <h3>7.2 Chung cư 80m², Hà Nội</h3>
        <p>
          Phong cách Scandinavian, gỗ công nghiệp vân sồi sáng kết hợp kệ tivi treo tường và bàn ăn tròn. Khách hàng nhận xét: “Thiết kế ấm cúng, đúng ý gia đình tôi.”
        </p>
        <div className="my-8">
          <Image
            src="/images/du-an-80m2-hanoi.jpg"
            alt="Dự án thi công nội thất chung cư 80m² Hà Nội GreenLa Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <h3>7.3 Nhà phố 100m², Đà Nẵng</h3>
        <p>
          Phong cách Luxury nhẹ, đảo bếp phủ Laminate bóng, sofa da, ánh sáng LED tinh tế. Khách hàng đánh giá: “Chất lượng vượt mong đợi, thi công đúng tiến độ!”
        </p>
        <div className="my-8">
          <Image
            src="/images/du-an-100m2-danang.jpg"
            alt="Dự án thi công nội thất nhà phố 100m² Đà Nẵng GreenLa Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <p>
          Mỗi dự án đều được GreenLa Home thực hiện tỉ mỉ, từ bản vẽ 3D đến lắp đặt, đảm bảo chất lượng và sự hài lòng. Hãy liên hệ để khám phá thêm các công trình ấn tượng của chúng tôi!
        </p>

        {/* Phần 9: FAQ */}
        <h2>8. FAQ – Giải đáp thắc mắc</h2>
        <p>
          Bạn còn băn khoăn về thi công nội thất trọn gói? GreenLa Home giải đáp các câu hỏi phổ biến để bạn an tâm lựa chọn dịch vụ với nội thất gỗ công nghiệp chất lượng cao:
        </p>
        <h3>8.1 Thi công trọn gói bao gồm những gì?</h3>
        <p>
          Tư vấn, thiết kế bản vẽ 3D, sản xuất, lắp đặt nội thất, cải tạo trần tường sàn, điện nước và bảo hành dài hạn các hạng mục.
        </p>
        <h3>8.2 Gỗ công nghiệp có bền không?</h3>
        <p>
          Có, gỗ MDF chống ẩm An Cường phủ Melamine/Laminate chịu được khí hậu Việt Nam, tuổi thọ 10-20 năm.
        </p>
        <h3>8.3 Thời gian hoàn thiện mất bao lâu?</h3>
        <p>
          Trung bình 10-20 ngày, tùy diện tích cụ thể.
        </p>
        <h3>8.4 Chi phí có phát sinh không?</h3>
        <p>
          Không, GreenLa Home cung cấp báo giá minh bạch ngay từ đầu, không phí ẩn. Cam kết chi phí phát sinh dưới 10%.
        </p>
        <p>
          Liên hệ ngay <strong>0962922332</strong> để được tư vấn miễn phí và giải đáp chi tiết cho ngôi nhà của bạn!
        </p>

        {/* Phần 10: Liên hệ */}
        <h2>9. Liên hệ GreenLa Home – Biến ý tưởng thành hiện thực</h2>
        <p>
          Hãy để GreenLa Home đồng hành cùng bạn trong hành trình kiến tạo tổ ấm mơ ước với dịch vụ thi công nội thất trọn gói chuyên nghiệp, sử dụng nội thất gỗ công nghiệp chất lượng cao!
        </p>
        <ul>
          <li><strong>Website:</strong> <a href="http://www.greenlahome.vn">www.greenlahome.vn</a></li>
          <li><strong>Hotline:</strong> 0962922332</li>
          <li><strong>Email:</strong> <a href="mailto:greenlahome@gmail.com">greenlahome@gmail.com</a></li>
          <li><strong>Showroom:</strong> Biệt thự số 10, khu C, KĐT Geleximco, Lê Trọng Tấn.</li>
        </ul>
        <div className="my-8">
          <Image
            src="/images/showroom-greenla.jpg"
            alt="Showroom GreenLa Home – Địa chỉ thi công nội thất trọn gói uy tín"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
      </section>

 
    </article>
  );
}