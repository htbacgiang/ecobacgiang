// components/ChungcuPage.js
import Link from 'next/link';
import Image from 'next/image';
import ContactForm from '../header/ContactForm';
import { useState } from 'react';

export default function ChungcuPage() {
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
        {/* Phần 1: Vì sao nên đầu tư thiết kế nội thất chung cư */}
        <div className="">
          <h2>1. Vì sao nên đầu tư thiết kế nội thất chung cư?</h2>
          <div className="my-8">
            <Image
              src="/images/thiet-ke-noi-that-chung-cu/vi-sao-nen-thiet-ke-noi-that-chung-cu.jpg"
              alt="Vì sao nên đầu tư thiết kế nội thất chung cư?"
              width={800}
              height={600}
              className="rounded"
            />
          </div>
          <p>
          Việc thuê thiết kế không chỉ dành cho nhà lớn. Với căn hộ chung cư – nơi không gian hạn chế – thiết kế bài bản ngay từ đầu giúp bạn sống thoải mái hơn, tiết kiệm hơn và đẹp hơn. Dưới đây là một vài lý do bạn nên thuê thiết kế nội thất chung cư.          </p>
          <h3>1.1 Tối ưu không gian sống</h3>
          <p>
            Chuyên gia sẽ giúp bố trí nội thất vừa vặn, thông minh, tận dụng mọi góc nhỏ, tạo cảm giác rộng hơn mà vẫn đủ công năng.
          </p>
          <h3>1.2 Xác định phong cách rõ ràng</h3>
          <p>
            Không lo “lạc gu” hay phối màu sai – bạn được tư vấn màu sắc, vật liệu và cách sắp xếp phù hợp cá tính và diện tích căn hộ.
          </p>
          <h3>1.3 Tiết kiệm chi phí & thời gian</h3>
          <p>
            Thiết kế đúng từ đầu sẽ tránh sửa sai khi thi công, giảm phát sinh, rút ngắn tiến độ và kiểm soát ngân sách tốt hơn.
          </p>
          <h3>1.4 Thi công nhanh – đúng bản vẽ</h3>
          <p>
            Bản thiết kế chi tiết giúp đội thi công triển khai đúng ý tưởng 100%, không mập mờ hay chỉnh sửa liên tục.
          </p>
          <h3>1.5 Tăng giá trị căn hộ</h3>
          <p>
            Một căn hộ được thiết kế chuyên nghiệp không chỉ đẹp, mà còn dễ bán lại, cho thuê hoặc đơn giản là sống hạnh phúc hơn mỗi ngày.
          </p>
        </div>

        {/* Phần 2: Các loại diện tích chung cư phổ biến */}
        <h2>2. Các loại diện tích chung cư phổ biến – và cách bố trí hiệu quả</h2>
        <h3>2.1 Chung cư mini – Studio (30–45m²)</h3>
        <div className="my-8">
          <Image
            src="/images/thiet-ke-noi-that-chung-cu/chung-cu-mini-30-40m2.jpg"
            alt="Thiết kế nội thất chung cư mini 30-45m² Greenla Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <p><strong>Đặc điểm:</strong> Diện tích nhỏ, chỉ có 1 không gian tích hợp cả phòng khách – ngủ – bếp – WC.</p>
        <p><strong>Thiết kế gợi ý:</strong></p>
        <ul>
          <li>Dùng giường gấp, sofa bed hoặc giường tầng ẩn.</li>
          <li>Tủ cao kịch trần để tối ưu lưu trữ.</li>
          <li>Bếp chữ I, kết hợp quầy bar làm bàn ăn.</li>
          <li>Gương lớn và tone sáng giúp “mở rộng không gian ảo”.</li>
        </ul>
        <p><strong>Tips:</strong> Sử dụng nội thất thông minh, đa năng là chìa khóa để sống thoải mái trong căn studio nhỏ.</p>

        <h3>2.2 Căn hộ 1–2 phòng ngủ (50–70m²)</h3>
        <div className="my-8">
          <Image
            src="/images/thiet-ke-noi-that-chung-cu/can-ho-1-2-phong-ngu.jpg"
            alt="Thiết kế nội thất chung cư 50-70m² Greenla Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <p><strong>Đặc điểm:</strong> Phổ biến với các cặp vợ chồng hoặc gia đình nhỏ. Không gian tách biệt nhưng vẫn gọn gàng.</p>
        <p><strong>Thiết kế gợi ý:</strong></p>
        <ul>
          <li>Mở không gian phòng khách – bếp để tạo cảm giác rộng.</li>
          <li>Phòng ngủ master nên ưu tiên giường có ngăn kéo, tủ âm tường.</li>
          <li>Phòng ngủ phụ có thể thiết kế dạng phòng làm việc, có sofa giường hoặc giường tầng.</li>
        </ul>
        <p><strong>Tips:</strong> Ưu tiên phong cách hiện đại, tối giản, dùng sàn gỗ sáng màu để tạo cảm giác ấm áp.</p>

        <h3>2.3 Căn hộ 2–3 phòng ngủ (70–85m²)</h3>
        <div className="my-8">
          <Image
            src="/images/thiet-ke-noi-that-chung-cu/can-ho-2-3-phong-ngu.jpg"
            alt="Thiết kế nội thất chung cư 70-85m² Greenla Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <p><strong>Đặc điểm:</strong> Phù hợp gia đình 3–4 người. Đòi hỏi thiết kế hài hòa giữa công năng và gu thẩm mỹ.</p>
        <p><strong>Thiết kế gợi ý:</strong></p>
        <ul>
          <li>Khu vực sinh hoạt chung cần thoáng đãng: phòng khách liền bếp, có bàn đảo.</li>
          <li>Có thể thêm tủ âm tường tại hành lang để tăng công năng.</li>
          <li>Phòng ngủ của con: nên có góc học tập, giường đơn & tủ thấp.</li>
        </ul>
        <p><strong>Tips:</strong> Kết hợp giữa nội thất cố định và rời để dễ thay đổi theo giai đoạn phát triển của trẻ.</p>

        <h3>2.4 Căn hộ cao cấp (90–120m²)</h3>
        <div className="my-8">
          <Image
            src="/images/thiet-ke-noi-that-chung-cu/can-ho-cao-cap.jpg"
            alt="Thiết kế nội thất chung cư cao cấp 90-120m² Greenla Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <p><strong>Đặc điểm:</strong> Rộng rãi, dễ “show” gu thẩm mỹ & cá nhân hóa.</p>
        <p><strong>Thiết kế gợi ý:</strong></p>
        <ul>
          <li>Có thể chia rõ từng khu: phòng đọc, bar mini, phòng làm việc riêng...</li>
          <li>Phòng ngủ master nên có tủ walk-in, toilet rộng, bồn tắm riêng.</li>
          <li>Sử dụng vật liệu cao cấp: đá, gỗ tự nhiên, ánh sáng thông minh.</li>
        </ul>
        <p><strong>Tips:</strong> Lúc này, bạn nên chọn phong cách thiết kế cá nhân hóa cao, kết hợp chiếu sáng theo mood.</p>

        {/* Phần 3: Phong cách thiết kế chung cư phổ biến */}
        <h2>3. Phong cách thiết kế chung cư phổ biến – Chọn gu đúng là “nở hoa”</h2>
        <h3>3.1 Hiện đại (Modern Style)</h3>
        <div className="my-8">
          <Image
            src="/images/thiet-ke-noi-that-chung-cu/chung-cu-phong-cach-hien-dai.jpg"
            alt="Thiết kế nội thất chung cư phong cách hiện đại Greenla Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <ul>
          <li><strong>Đặc trưng:</strong> Đường nét rõ ràng, bề mặt phẳng, ít họa tiết.</li>
          <li><strong>Màu sắc:</strong> Trung tính (trắng, xám, đen, nâu nhạt).</li>
          <li><strong>Phù hợp:</strong> Mọi diện tích, dễ thi công, dễ bảo trì.</li>
        </ul>
        <p>Thường kết hợp ánh sáng vàng trung tính, nội thất tối giản, decor tinh tế.</p>

        <h3>3.2 Tối giản (Minimalism)</h3>
        <div className="my-8">
          <Image
            src="/images/thiet-ke-noi-that-chung-cu/chung-cu-phong-cach-toi-gian.jpg"
            alt="Thiết kế nội thất chung cư phong cách tối giản Greenla Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <ul>
          <li><strong>Đặc trưng:</strong> “Ít nhưng chất”, loại bỏ mọi thứ dư thừa.</li>
          <li><strong>Màu sắc:</strong> Trắng, be, xám nhạt, đen, gỗ tự nhiên.</li>
          <li><strong>Phù hợp:</strong> Căn hộ nhỏ, người bận rộn, yêu sự thư giãn.</li>
        </ul>
        <p>Phù hợp với lối sống đơn giản và muốn tránh cảm giác bí bách.</p>

        <h3>3.3 Scandinavian – Bắc Âu</h3>
        <div className="my-8">
          <Image
            src="/images/thiet-ke-noi-that-chung-cu/chung-cu-phong-cach-bac-au-scandinavian.jpg"
            alt="Thiết kế nội thất chung cư phong cách Scandinavian Greenla Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <ul>
          <li><strong>Đặc trưng:</strong> Sáng – thoáng – ấm cúng.</li>
          <li><strong>Màu sắc:</strong> Trắng chủ đạo + gỗ + ánh sáng tự nhiên.</li>
          <li><strong>Phù hợp:</strong> Căn hộ có nhiều cửa sổ, trần cao.</li>
        </ul>
        <p>Dễ phối đồ nội thất, tạo cảm giác hạnh phúc & “well-being”.</p>

        <h3>3.4 Japandi – Nhật – Bắc Âu lai</h3>
        <div className="my-8">
          <Image
            src="/images/thiet-ke-noi-that-chung-cu/phong-cach-japani.jpg"
            alt="Thiết kế nội thất chung cư phong cách Japandi Greenla Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <ul>
          <li><strong>Đặc trưng:</strong> Gọn gàng, ấm áp, tinh tế.</li>
          <li><strong>Màu sắc:</strong> Be, nâu, gỗ, xám nhạt, đen nhấn.</li>
          <li><strong>Phù hợp:</strong> Người sống chậm, thích thiền định, hoặc yêu nét đơn sơ mộc mạc.</li>
        </ul>
        <p>Cân bằng giữa hiện đại – tự nhiên – yên bình.</p>

        <h3>3.5 Indochine – Đông Dương</h3>
        <div className="my-8">
          <Image
            src="/images/thiet-ke-noi-that-chung-cu/chung-cu-phong-cach-dong-duong.jpg"
            alt="Thiết kế nội thất chung cư phong cách Indochine Greenla Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <ul>
          <li><strong>Đặc trưng:</strong> Gỗ sẫm, mây tre, họa tiết hoa văn cổ điển.</li>
          <li><strong>Màu sắc:</strong> Trắng ngà, vàng đồng, xanh ngọc.</li>
          <li><strong>Phù hợp:</strong> Người yêu sự truyền thống và chất Á Đông sang trọng.</li>
        </ul>
        <p>Thường sử dụng trong căn hộ có diện tích khá trở lên.</p>
        <p><strong>Bonus:</strong> Đừng ngại pha trộn phong cách! Greenla Home có thể cá nhân hóa thiết kế theo gu sống riêng của bạn — nhờ ứng dụng công nghệ AI để hiểu hành vi, màu sắc và thói quen sinh hoạt của từng khách hàng.</p>

        {/* Phần 4: Bố trí nội thất theo từng không gian chức năng */}
        <h2>4. Bố trí nội thất theo từng không gian chức năng</h2>
        <h3>4.1 Phòng khách – trung tâm sinh hoạt của gia đình</h3>
        <div className="my-8">
          <Image
            src="/images/thiet-ke-noi-that-chung-cu/phong-khach.jpg"
            alt="Thiết kế nội thất phòng khách chung cư Greenla Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <ul>
          <li><strong>Bố cục lý tưởng:</strong> Sofa (chữ L hoặc sofa đơn) đặt gần cửa sổ, đối diện kệ TV treo tường hoặc tích hợp tủ lưu trữ.</li>
          <li><strong>Tone màu gợi ý:</strong> Ghi xám, be, gỗ sáng → cảm giác sạch sẽ, hiện đại.</li>
          <li><strong>Trang trí:</strong> 1 bức tranh trừu tượng, đèn đứng nghệ thuật, thảm trung tính giúp tăng chiều sâu.</li>
          <li><strong>Mẹo tối ưu:</strong> Sử dụng rèm hai lớp (voan – vải) để điều tiết ánh sáng.</li>
        </ul>
        <p>Greenla Home gợi ý: Với căn hộ nhỏ, chọn bàn trà tròn, mặt kính, có thể gấp/mở linh hoạt.</p>

        <h3>4.2 Phòng bếp – nơi tạo nên hạnh phúc gia đình</h3>
        <div className="my-8">
          <Image
            src="/images/thiet-ke-noi-that-chung-cu/phong-bep.jpg"
            alt="Thiết kế nội thất phòng bếp chung cư Greenla Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <p><strong>Bố trí phổ biến:</strong></p>
        <ul>
          <li>Chữ I: cho căn hộ nhỏ, chạy dọc theo tường.</li>
          <li>Chữ L: tận dụng góc tường, dễ phân chia khu nấu – rửa.</li>
          <li>Có bàn đảo: với diện tích trên 70m², bàn đảo kiêm khu ăn sáng.</li>
        </ul>
        <p><strong>Vật liệu gợi ý:</strong> Tủ MDF phủ melamine, mặt đá trắng nhân tạo, tay nắm tối giản.</p>
        <p><strong>Thiết bị nên có:</strong> Bếp từ, máy hút mùi, chậu inox âm, lò nướng âm tủ.</p>
        <p>Greenla Home gợi ý: Lắp tủ kịch trần giúp tối ưu lưu trữ, tránh bụi.</p>

        <h3>4.3 Phòng ngủ – nơi nghỉ ngơi, tái tạo năng lượng</h3>
        <div className="my-8">
          <Image
            src="/images/thiet-ke-noi-that-chung-cu/phong-ngu.jpg"
            alt="Thiết kế nội thất phòng ngủ chung cư Greenla Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <p><strong>Phòng ngủ master:</strong></p>
        <ul>
          <li>Giường queen/king có ngăn kéo.</li>
          <li>Tủ âm tường, gương dài.</li>
          <li>Tab đầu giường và đèn ngủ ấm dịu.</li>
        </ul>
        <p><strong>Phòng ngủ nhỏ (con):</strong></p>
        <ul>
          <li>Giường tầng, hoặc giường đơn thấp.</li>
          <li>Góc học tập gần cửa sổ.</li>
          <li>Tủ áo có bánh xe hoặc cửa lùa.</li>
        </ul>
        <p><strong>Mẹo:</strong> Ưu tiên tone nhẹ: be – xám – pastel. Tránh để quá nhiều đồ điện tử gần giường.</p>

        <h3>4.4 Ban công & khu giặt phơi – không gian phụ nhưng “quý giá”</h3>
        <div className="my-8">
          <Image
            src="/images/thiet-ke-noi-that-chung-cu/ban-cong-khu-giat-la.jpg"
            alt="Thiết kế nội thất ban công chung cư Greenla Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <ul>
          <li><strong>Thiết kế thư giãn:</strong> Ghế thư giãn, vài chậu cây treo, kệ sách nhỏ → một “góc chill” tại gia.</li>
          <li><strong>Tối ưu phơi đồ:</strong> Tủ giặt/phơi âm tường, phơi đồ gắn trần thông minh, chống ẩm, chống nắng tốt.</li>
        </ul>
        <p>Greenla Home gợi ý: Kết hợp ánh sáng vàng, sàn gỗ nhựa để tạo cảm giác như một “resort mini”!</p>

        {/* Phần 5: Phong thủy nội thất chung cư */}
        <h2>5. Phong thủy nội thất chung cư – Những nguyên tắc cơ bản dễ áp dụng</h2>
        <div className="my-8">
          <Image
            src="/images/thiet-ke-noi-that-chung-cu/ngu-hanh.jpg"
            alt="Thiết kế nội thất chung cư hợp phong thủy Greenla Home"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <h3>5.1 Các hướng hợp mệnh với gia chủ</h3>
        <h4>Mệnh Kim</h4>
        <ul>
          <li><strong>Hợp hướng:</strong> Tây, Tây Bắc (thuộc Kim) – Tây Nam, Đông Bắc (thuộc Thổ – sinh Kim).</li>
          <li><strong>Nên tránh:</strong> Hướng Nam (thuộc Hỏa – Hỏa khắc Kim).</li>
          <li><strong>Ứng dụng:</strong> Nên đặt cửa chính, bàn làm việc, đầu giường hướng Tây, Tây Bắc để tăng năng lượng bản mệnh.</li>
        </ul>
        <h4>Mệnh Thủy</h4>
        <ul>
          <li><strong>Hợp hướng:</strong> Bắc (thuộc Thủy) – Tây, Tây Bắc (thuộc Kim – Kim sinh Thủy).</li>
          <li><strong>Nên tránh:</strong> Hướng Đông Bắc, Tây Nam (thuộc Thổ – Thổ khắc Thủy).</li>
          <li><strong>Ứng dụng:</strong> Ban công, cửa chính hướng Bắc mang lại vận may, trí tuệ, học hành tốt.</li>
        </ul>
        <h4>Mệnh Hỏa</h4>
        <ul>
          <li><strong>Hợp hướng:</strong> Nam (thuộc Hỏa) – Đông, Đông Nam (thuộc Mộc – Mộc sinh Hỏa).</li>
          <li><strong>Nên tránh:</strong> Hướng Bắc (thuộc Thủy – Thủy khắc Hỏa).</li>
          <li><strong>Ứng dụng:</strong> Phòng khách, phòng làm việc nên mở ra hướng Đông – Nam để kích hoạt năng lượng tích cực.</li>
        </ul>
        <h4>Mệnh Mộc</h4>
        <ul>
          <li><strong>Hợp hướng:</strong> Đông, Đông Nam (thuộc Mộc) – Bắc (thuộc Thủy – Thủy sinh Mộc).</li>
          <li><strong>Nên tránh:</strong> Hướng Tây, Tây Bắc (thuộc Kim – Kim khắc Mộc).</li>
          <li><strong>Ứng dụng:</strong> Thiết kế ban công, phòng ngủ hướng Đông – Bắc mang lại tài lộc và sự phát triển.</li>
        </ul>
        <h4>Mệnh Thổ</h4>
        <ul>
          <li><strong>Hợp hướng:</strong> Đông Bắc, Tây Nam (thuộc Thổ) – Nam (thuộc Hỏa – Hỏa sinh Thổ).</li>
          <li><strong>Nên tránh:</strong> Hướng Đông, Đông Nam (thuộc Mộc – Mộc khắc Thổ).</li>
          <li><strong>Ứng dụng:</strong> Vị trí bếp, giường, bàn thờ nên đặt về các hướng Nam – Tây Nam – Đông Bắc để mang lại sự ổn định, yên tâm.</li>
        </ul>
        <h3>5.2 Hướng đặt đồ nội thất chính</h3>
        <ul>
          <li><strong>Giường ngủ:</strong> Nên đặt đầu giường quay về hướng tốt theo mệnh (Đông, Tây, Nam, Bắc tùy người), không để gương đối diện giường.</li>
          <li><strong>Bếp:</strong> Nên né thẳng cửa chính, không sát nhà vệ sinh.</li>
          <li><strong>Bàn thờ:</strong> Hướng ra ban công/cửa sổ, cao ráo, yên tĩnh.</li>
        </ul>
        <h3>5.3 Cây xanh phong thủy</h3>
        <ul>
          <li><strong>Tốt cho sinh khí:</strong> Lưỡi hổ, kim tiền, vạn lộc.</li>
          <li><strong>Tránh:</strong> Xương rồng, cây gai nhọn trong phòng ngủ.</li>
        </ul>
        <h3>5.4 Nguyên tắc âm dương</h3>
        <ul>
          <li><strong>Cân bằng vật liệu:</strong> Gỗ (Mộc) – Đá (Thổ) – Kim loại (Kim).</li>
          <li><strong>Kết hợp ánh sáng:</strong> Ánh sáng vàng ấm (dương) với ánh sáng trắng nhẹ (âm) để tránh quá lạnh hoặc quá gắt.</li>
        </ul>

        {/* Phần 6: Thiết kế theo nhu cầu đặc biệt */}
        <h2>6. Thiết kế theo nhu cầu đặc biệt – cá nhân hóa không gian sống</h2>
        <h3>6.1 Vợ chồng mới cưới</h3>
        <ul>
          <li>Màu sắc nhẹ nhàng: be – kem – pastel.</li>
          <li>Tạo cảm giác lãng mạn bằng ánh sáng vàng, tranh nghệ thuật.</li>
          <li>Không gian nên thoáng, gọn và có điểm nhấn chung như “góc chill đôi” hoặc kệ rượu nhỏ.</li>
        </ul>
        <h3>6.2 Gia đình có con nhỏ</h3>
        <ul>
          <li>Ưu tiên an toàn: bo góc nội thất, ổ điện âm.</li>
          <li>Phân chia rõ ràng: khu học tập, khu chơi, phòng ngủ cho bé.</li>
          <li>Tủ đồ có khóa, màu sắc tươi sáng kích thích sáng tạo.</li>
        </ul>
        <h3>6.3 Người độc thân hiện đại</h3>
        <ul>
          <li>Phòng khách có thể kiêm phòng làm việc.</li>
          <li>Nội thất linh hoạt: bàn gấp, sofa giường.</li>
          <li>Decor mang cá tính: tranh ảnh, đèn trang trí, cây cá nhân.</li>
        </ul>
        <h3>6.4 Người lớn tuổi</h3>
        <ul>
          <li>Hành lang rộng, ít vật cản.</li>
          <li>Sử dụng ánh sáng ấm, không quá gắt.</li>
          <li>Ghế ngồi có tay vịn, sofa lưng cao.</li>
          <li>Thiết kế tối giản, tránh lộn xộn.</li>
        </ul>
        <p>Greenla Home có thể tích hợp AI để phân tích phong cách cá nhân và đưa ra bố cục thiết kế theo từng đối tượng người dùng.</p>

        {/* Phần 7: Chi phí thiết kế nội thất chung cư */}
        <h2>7. Chi phí thiết kế nội thất chung cư là bao nhiêu?</h2>
        <p>
          Tại Greenla Home, chúng tôi cung cấp dịch vụ thiết kế nội thất chuyên nghiệp với chi phí hợp lý, phù hợp với từng loại hình không gian và phong cách thiết kế. Dưới đây là bảng giá tham khảo:
        </p>
        <table className="table-auto w-full my-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Hạng mục thiết kế</th>
              <th className="px-4 py-2">Đơn giá (VNĐ/m²)</th>
              <th className="px-4 py-2">Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Căn hộ chung cư</td>
              <td className="border px-4 py-2">150.000 – 250.000</td>
              <td className="border px-4 py-2">Tùy diện tích và yêu cầu thiết kế</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Nhà phố – liền kề</td>
              <td className="border px-4 py-2">200.000 – 280.000</td>
              <td className="border px-4 py-2">Bao gồm cả mặt bằng công năng</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Biệt thự</td>
              <td className="border px-4 py-2">250.000 – 350.000</td>
              <td className="border px-4 py-2">Thiết kế cao cấp, chi tiết</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Thiết kế concept sơ bộ</td>
              <td className="border px-4 py-2">5.000.000 – 8.000.000</td>
              <td className="border px-4 py-2">Dành cho khách chỉ cần ý tưởng, không cần triển khai</td>
            </tr>
          </tbody>
        </table>
        <ul>
          <li><strong className='text-red-700'>Miễn phí 100% phí thiết kế</strong> khi khách hàng ký hợp đồng <Link href="thi-cong-noi-that-tron-goi">thi công trọn gói</Link> tại Greenla Home.</li>
          <li><strong className='text-red-700'>Cam kết</strong> bản vẽ chi tiết, phối cảnh 3D chân thực, và bóc tách kỹ thuật đầy đủ.</li>
        </ul>

        {/* Phần 8: Thời gian hoàn thiện nội thất */}
        <h2>8. Thời gian hoàn thiện nội thất bao nhiêu lâu?</h2>
        <p>
          Greenla Home với đội ngũ chuyên nghiệp, có nhiều kinh nghiệm và ứng dụng công nghệ trong thiết kế và sản xuất nên thời gian triển khai được rút ngắn rất nhiều so với các đơn vị khác trên thị trường.
        </p>
        <h3>8.1 Thời gian thiết kế nội thất</h3>
        <ul>
          <li>Dự án chung cư: từ 3 – 5 ngày.</li>
          <li>Dự án nhà phố, biệt thự: 5 – 15 ngày.</li>
        </ul>
        <h3>8.2 Thời gian thi công nội thất</h3>
        <ul>
          <li>Dự án chung cư: từ 5 – 10 ngày (chưa bao gồm cải tạo, đập phá).</li>
          <li>Dự án nhà phố, biệt thự: 10 – 25 ngày (chưa bao gồm cải tạo, đập phá).</li>
        </ul>
        <p>
          Như vậy, với các dự án chung cư cơ bản, Greenla Home chỉ mất 8 – 20 ngày cho cả giai đoạn thiết kế và thi công. Dự án nhà phố, biệt thự chỉ mất 15 – 35 ngày để hoàn thiện. Tất cả những điều này đều nhờ Greenla Home có đội ngũ chuyên nghiệp sắp xếp công việc và ứng dụng AI để tối ưu hóa các đầu mục công việc.
        </p>
        <p>
          Greenla Home cam kết chi phí phát sinh cho dự án dưới 10% nếu chúng tôi thi công trọn gói công trình.
        </p>

        {/* Phần 9: Liên hệ */}
        <h2>9. Liên hệ Greenla Home – Biến ý tưởng thành hiện thực</h2>
        <p>
          Nhanh tay liên hệ hotline: <strong>096 292 2332</strong> để được chúng tôi tư vấn miễn phí.
        </p>
        <p><strong className=''><Link href='https://tantruonggiang.com.vn/'>Công ty TNHH TM DV&SX Tân Trường Giang </Link> </strong></p>
        <p><strong>Greenla Home Interior Design</strong></p>
        <p><strong>Địa chỉ:</strong> Biệt thự số 10, lô C5, Khu đô thị Geleximco, Lê Trọng Tấn.</p>
        <p><strong>Hotline/Zalo:</strong> 0962.922.332</p>
        <p><strong>Email:</strong> <a href="mailto:greenlahome@gmail.com.vn">lienhe@greenlahome.vn</a></p>
        <p><strong>Website:</strong> <a href="https://greenlahome.vn">greenlahome.vn</a></p>
        <p><strong>Fanpage:</strong> <Link href="https://www.facebook.com/profile.php?id=61574909566818"> Greenla Home</Link></p>
       
      </section>


    </article>
  );
}