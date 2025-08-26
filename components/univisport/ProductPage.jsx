// components/ArticlePage.js
import Link from 'next/link';
import Image from 'next/image';
import ContactForm from '../header/ContactForm';
import { useState } from 'react';

export default function ProductPage() {
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
        {/* Phần 1: Giới thiệu Đồng phục Univi */}
        <div className="">
          <p>
            Chào mừng bạn đến với trang tổng quan sản phẩm của <strong>Đồng phục Univi</strong> – nơi quy tụ những bộ đồng phục thể thao chuyên dụng được thiết kế và sản xuất theo tiêu chuẩn chất lượng hàng đầu tại Việt Nam. Chúng tôi hiểu rằng trang phục không chỉ là quần áo, mà còn là một công cụ hỗ trợ đắc lực giúp bạn tối ưu hiệu suất tập luyện, cảm thấy thoải mái và tự tin trong mọi hoạt động.
          </p>
          <p>
            Với sự nghiên cứu chuyên sâu về chất liệu và am hiểu đặc thù của từng bộ môn, Đồng phục Univi mang đến đa dạng các dòng sản phẩm, đáp ứng nhu cầu khắt khe nhất của cả người tập luyện cá nhân lẫn các chuỗi phòng tập và doanh nghiệp.
          </p>
          <div className="my-8">
            <Image
              src="/images/univi-sport-intro.jpg"
              alt="Đồng phục thể thao chuyên dụng Đồng phục Univi"
              width={800}
              height={600}
              className="rounded"
            />
          </div>
        </div>

        {/* Phần 2: Câu chuyện Đồng phục Univi */}
        <h2>Câu Chuyện Đằng Sau Đồng phục Univi: Đam Mê Kiến Tạo Giá Trị</h2>
        <p>
          Đồng phục Univi được hình thành từ chính tình yêu và niềm đam mê cháy bỏng với thể thao của những người sáng lập. Là những người gắn bó với gym, yoga, chạy bộ, golf, chúng tôi hiểu rõ tầm quan trọng của một bộ trang phục phù hợp. Chúng tôi không ngừng nghiên cứu chuyên sâu về chất liệu, tìm kiếm những loại vải tốt nhất để giải quyết các vấn đề mà người tập luyện thường gặp phải.
        </p>
        <p>
          Qua các cuộc trao đổi với cả vận động viên và người tập luyện thông thường, UNIVI nhận thấy mối quan ngại lớn về nguy cơ chấn thương cơ và khớp cũng như nhu cầu cần có trang phục hỗ trợ hiệu quả. Chính điều đó đã thôi thúc chúng tôi xây dựng Đồng phục Univi với tầm nhìn cung cấp quần áo thể thao chất lượng cao, mang lại sự hỗ trợ, thoải mái và an toàn cho <strong>MỌI NGƯỜI</strong>, ở <strong>MỌI LỨA TUỔI</strong>, trong <strong>MỌI HOẠT ĐỘNG</strong> thể thao.
        </p>

        {/* Phần 3: Tầm nhìn & Sứ mệnh */}
        <h2>Tầm Nhìn & Sứ Mệnh: Nâng Tầm Trải Nghiệm Tập Luyện Việt</h2>
        <p>
          Đồng phục Univi khao khát trở thành thương hiệu đồng phục thể thao hàng đầu tại Việt Nam, được tin cậy nhờ vào chất lượng sản phẩm vượt trội và sự thấu hiểu nhu cầu khách hàng. Sứ mệnh của chúng tôi là mang đến những giải pháp đồng phục tối ưu, giúp người Việt tự tin, thoải mái và đạt hiệu suất cao nhất trong hành trình chinh phục mục tiêu sức khỏe và thể chất của mình.
        </p>
        <div className="my-8">
          <Image
            src="/images/univi-sport-vision.jpg"
            alt="Tầm nhìn Đồng phục Univi - Nâng tầm trải nghiệm tập luyện"
            width={800}
            height={600}
            className="rounded"
          />
        </div>

        {/* Phần 4: Thế mạnh của Đồng phục Univi */}
        <h2>Thế Mạnh Vượt Trội Của Đồng Phục Đồng phục Univi</h2>
        <p>
          Điều gì tạo nên sự khác biệt của Đồng phục Univi? Đó chính là sự kết hợp của chuyên môn, công nghệ, quy trình sản xuất và sự am hiểu thị trường sâu sắc.
        </p>
        <h3>Chuyên Môn Sâu Về Chất Liệu & Công Nghệ Vải Chuyên Dụng</h3>
        <p>
          Chúng tôi tự hào là một trong số ít các đơn vị tại Việt Nam nghiên cứu và phát triển chất liệu đồng phục thể thao một cách bài bản. Các dòng vải độc quyền của UNIVI như <strong>Quick Dry</strong> (siêu nhẹ, nhanh khô), <strong>Super Cool</strong> (mềm, mát, mịn từ Polyamide), <strong>Blended</strong> (tổng hợp ưu điểm từ các loại sợi) cùng công nghệ <strong>UNI DRY</strong> giúp thoát ẩm vượt trội, phù hợp với khí hậu nóng ẩm tại Việt Nam. Chúng tôi đi sâu vào thông số kỹ thuật vải và ứng dụng chúng cho từng bộ môn cụ thể.
        </p>
        <h3>Đảm Bảo An Toàn Tuyệt Đối Với Kết Quả Kiểm Định Độc Lập</h3>
        <p>
          Sức khỏe người mặc là ưu tiên hàng đầu của Đồng phục Univi. Chúng tôi cam kết sử dụng vải an toàn, đã được kiểm định độc lập tại Trung tâm giám định thuộc Bộ Công thương và cho kết quả hoàn toàn không chứa <strong>Formaldehyde</strong> và <strong>Amin thơm Azo</strong> – những hóa chất có hại cho da và sức khỏe. Đây là lời khẳng định mạnh mẽ về chất lượng và sự an toàn mà không phải đơn vị nào cũng có được.
        </p>
        <h3>Quy Trình Sản Xuất Khép Kín, Kiểm Soát Chất Lượng Chặt Chẽ</h3>
        <p>
          Với xưởng may đồng phục thể thao riêng quy mô hơn <strong>2000m²</strong> và đội ngũ gần <strong>100 công nhân</strong> chuyên nghiệp, chúng tôi kiểm soát toàn bộ quy trình sản xuất từ cắt, may, in, thêu đến hoàn thiện. Mỗi sản phẩm đều được chú trọng vào “đường may tinh tế”, may kỹ lưỡng cả hai mặt, và phải thông qua phòng <strong>QC độc lập</strong> trước khi đến tay khách hàng. Điều này đảm bảo độ bền, form dáng chuẩn và sự thoải mái tối đa.
        </p>
        <h3>Giải Pháp 2S Uniform Chuyên Biệt Cho Chuỗi Phòng Tập</h3>
        <p>
          Đồng phục Univi không chỉ bán quần áo, chúng tôi cung cấp giải pháp đồng phục toàn diện cho các chuỗi phòng tập Gym, Yoga, Kickfit, MMA... Giải pháp <strong>2S Uniform</strong> giúp các trung tâm fitness xây dựng hình ảnh chuyên nghiệp, đồng bộ, tạo sự gắn kết cho nhân viên và hội viên, đồng thời tối ưu chi phí và tăng cơ hội kinh doanh. Chúng tôi hiểu rõ nhu cầu đặc thù của ngành fitness và đưa ra giải pháp phù hợp nhất.
        </p>
        <h3>Đội Ngũ Am Hiểu & Đam Mê</h3>
        <p>
          Đồng phục Univi là tập hợp những con người cùng chung niềm đam mê thể thao và mong muốn mang đến sản phẩm tốt nhất. Từ bộ phận nghiên cứu chất liệu, thiết kế cho đến đội ngũ sản xuất và tư vấn, chúng tôi luôn làm việc với sự am hiểu, chuyên nghiệp và tận tâm để mỗi bộ đồng phục ra đời đều đạt chất lượng cao nhất và làm hài lòng khách hàng.
        </p>
        <div className="my-8">
          <Image
            src="/images/univi-sport-strength.jpg"
            alt="Thế mạnh đồng phục thể thao Đồng phục Univi"
            width={800}
            height={600}
            className="rounded"
          />
        </div>

        {/* Phần 5: Các dòng sản phẩm */}
        <h2>Khám Phá Các Dòng Sản Phẩm Đồng Phục Thể Thao Chuyên Dụng Của Đồng phục Univi</h2>
        <p>
          Tại Đồng phục Univi, chúng tôi hiểu rằng mỗi bộ môn thể thao đều có yêu cầu riêng về trang phục. Vì vậy, chúng tôi đã nghiên cứu và phát triển các dòng sản phẩm đồng phục chuyên dụng, sử dụng những chất liệu và công nghệ vải tối ưu để mang lại hiệu suất và sự thoải mái cao nhất cho người tập luyện.
        </p>
        <h3>Đồng phục Gym & Fitness</h3>
        <p>
          Đối với các buổi tập gym cường độ cao, yêu cầu về sự co giãn, thoáng khí và bền bỉ là cực kỳ quan trọng. Đồng phục Gym của Đồng phục Univi được thiết kế với form dáng năng động, sử dụng các chất liệu như <strong>UNIVI – QUICK DRY</strong> hoặc <strong>UNIVI – BLENDED</strong> với khả năng thoát ẩm, nhanh khô vượt trội nhờ công nghệ <strong>UNI DRY</strong>. Đường may tinh tế, chắc chắn đảm bảo không gây cọ sát, cho phép bạn thực hiện mọi động tác nâng tạ, squat hay cardio một cách thoải mái và hiệu quả tối đa.
        </p>
        <p>
          <Link href="/products/gym-fitness" className="text-blue-600 hover:underline">
            Xem Danh mục Đồng phục Gym & Fitness
          </Link>
        </p>
        <div className="my-8">
          <Image
            src="/images/gym-fitness-uniform.jpg"
            alt="Đồng phục Gym & Fitness Đồng phục Univi"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <h3>Đồng phục Yoga</h3>
        <p>
          Tập Yoga đòi hỏi trang phục có độ mềm mại, co giãn tốt và thấm hút mồ hôi hiệu quả để hỗ trợ sự linh hoạt và thoải mái trong từng tư thế. Đồng phục Yoga của Đồng phục Univi ưu tiên sử dụng chất liệu <strong>UNIVI – SUPER COOL</strong> từ sợi Polyamide, mang lại cảm giác “mềm - mượt - mát - mịn” trên da. Vải có độ co giãn đa chiều lý tưởng, giúp bạn tự tin và dễ chịu khi thực hiện các động tác kéo giãn hay thăng bằng.
        </p>
        <p>
          <Link href="/products/yoga" className="text-blue-600 hover:underline">
            Xem Danh mục Đồng phục Yoga
          </Link>
        </p>
        <div className="my-8">
          <Image
            src="/images/yoga-uniform.jpg"
            alt="Đồng phục Yoga Đồng phục Univi"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <h3>Đồng phục Chạy Bộ</h3>
        <p>
          Trên đường chạy, trang phục cần siêu nhẹ, nhanh khô và có khả năng bảo vệ cơ thể khỏi tác động của môi trường. Đồng phục Chạy bộ Đồng phục Univi được làm từ chất liệu <strong>UNIVI – QUICK DRY</strong> hoặc <strong>UNIVI – BLENDED</strong> với đặc tính cản nắng, cản gió, cản bụi và nhanh khô xuất sắc. Công nghệ <strong>UNI DRY</strong> giữ cho cơ thể luôn khô thoáng, giảm thiểu ma sát và giúp bạn tập trung hoàn toàn vào hiệu suất đường chạy của mình.
        </p>
        <p>
          <Link href="/products/running" className="text-blue-600 hover:underline">
            Xem Danh mục Đồng phục Chạy Bộ
          </Link>
        </p>
        <div className="my-8">
          <Image
            src="/images/running-uniform.jpg"
            alt="Đồng phục Chạy Bộ Đồng phục Univi"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <h3>Đồng phục Golf</h3>
        <p>
          Môn Golf yêu cầu trang phục vừa lịch sự, vừa thoải mái để vận động linh hoạt trong thời gian dài ngoài trời. Đồng phục Golf của Đồng phục Univi sử dụng các chất liệu thoáng mát, có độ co giãn nhẹ như <strong>UNIVI – SUPER COOL</strong> hoặc <strong>UNIVI – BLENDED</strong>, kết hợp khả năng chống nắng (chống tia UV) và bền màu. Thiết kế tinh tế, form dáng chuẩn giúp golfer luôn tự tin và chuyên nghiệp trên sân.
        </p>
        <p>
          <Link href="/products/golf" className="text-blue-600 hover:underline">
            Xem Danh mục Đồng phục Golf
          </Link>
        </p>
        <div className="my-8">
          <Image
            src="/images/golf-uniform.jpg"
            alt="Đồng phục Golf Đồng phục Univi"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <h3>Đồng phục cho Huấn luyện viên & Nhân viên phòng tập</h3>
        <p>
          Đội ngũ HLV và nhân viên là bộ mặt của trung tâm thể thao. Đồng phục cho HLV & Nhân viên do Đồng phục Univi cung cấp chú trọng vào sự chuyên nghiệp, lịch sự nhưng vẫn đảm bảo sự thoải mái và dễ chịu khi làm việc và hướng dẫn học viên. Chúng tôi sử dụng các chất liệu bền màu, ít nhăn và dễ dàng vệ sinh, giúp đội ngũ của bạn luôn có diện mạo chỉn chu, thể hiện sự đồng bộ và uy tín của thương hiệu phòng tập.
        </p>
        <p>
          <Link href="/products/coach-staff" className="text-blue-600 hover:underline">
            Xem Danh mục Đồng phục HLV & Nhân viên
          </Link>
        </p>
        <div className="my-8">
          <Image
            src="/images/coach-staff-uniform.jpg"
            alt="Đồng phục HLV & Nhân viên Đồng phục Univi"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
        <h3>Đồng phục cho các Sự kiện Thể thao, Giải đấu</h3>
        <p>
          Đồng phục Univi là đối tác lý tưởng cho việc cung cấp đồng phục số lượng lớn cho các giải đấu, sự kiện thể thao, giải chạy bộ... Với quy trình sản xuất chuyên nghiệp, xưởng in thêu hiện đại và khả năng kiểm soát chất lượng chặt chẽ, chúng tôi đảm bảo mang đến những bộ đồng phục nổi bật, đồng đều, bền đẹp và đúng tiến độ, góp phần vào sự thành công của sự kiện.
        </p>
        <p>
          <Link href="/products/event" className="text-blue-600 hover:underline">
            Xem Danh mục Đồng phục Sự kiện
          </Link>
        </p>
        <div className="my-8">
          <Image
            src="/images/event-uniform.jpg"
            alt="Đồng phục Sự kiện Thể thao Đồng phục Univi"
            width={800}
            height={600}
            className="rounded"
          />
        </div>

        {/* Phần 6: Tại sao chọn Đồng phục Univi */}
        <h2>Tại Sao Chọn Đồng Phục Thể Thao Đồng phục Univi?</h2>
        <p>
          Lý do khiến hàng trăm khách hàng tin tưởng và lựa chọn đồng phục của Đồng phục Univi nằm ở những giá trị cốt lõi vượt trội mà chúng tôi mang lại:
        </p>
        <ul>
          <li>
            <strong>Chất Liệu & Công Nghệ Đột Phá:</strong> Chúng tôi sử dụng các dòng vải độc quyền như UNIVI – QUICK DRY, UNIVI – SUPER COOL, UNIVI – BLENDED, kết hợp công nghệ UNI DRY giúp thoát ẩm, nhanh khô vượt trội. Đây là những chất liệu được nghiên cứu kỹ lưỡng để phù hợp nhất với từng cường độ và môi trường tập luyện khác nhau tại Việt Nam.
          </li>
          <li>
            <strong>An Toàn Đã Kiểm Định:</strong> Tất cả các loại vải chính đều được kiểm định độc lập, đảm bảo không chứa hóa chất độc hại Formaldehyde và Amin thơm Azo, mang đến sự an tâm tuyệt đối cho làn da và sức khỏe người mặc.
          </li>
          <li>
            <strong>Chất Lượng Sản Xuất Tinh Xảo:</strong> Với xưởng may hiện đại và đội ngũ công nhân lành nghề, chúng tôi chú trọng vào từng chi tiết nhỏ nhất, từ đường may tinh tế, bền chắc đến quy trình kiểm soát chất lượng nghiêm ngặt, đảm bảo sản phẩm luôn bền đẹp sau nhiều lần giặt.
          </li>
          <li>
            <strong>Thiết Kế Tối Ưu Công Năng:</strong> Mỗi bộ đồng phục đều được thiết kế dựa trên sự am hiểu về chuyển động của cơ thể trong từng bộ môn, mang lại sự co giãn, nâng đỡ và thoải mái tối đa, giúp người tập tự tin thực hiện mọi động tác.
          </li>
        </ul>
        <div className="my-8">
          <Image
            src="/images/why-choose-univi.jpg"
            alt="Tại sao chọn đồng phục thể thao Đồng phục Univi"
            width={800}
            height={600}
            className="rounded"
          />
        </div>

        {/* Phần 7: Kêu gọi hành động */}
        <h2>Hãy Liên Hệ Với Đồng phục Univi!</h2>
        <p>
          Bạn đang tìm kiếm giải pháp đồng phục thể thao cho doanh nghiệp? Hay muốn đặt may đồng phục chuyên dụng cho đội/nhóm của mình? Hãy liên hệ ngay với <strong>Đồng phục Univi</strong> để được tư vấn chi tiết về Giải pháp <strong>2S Uniform</strong> và khám phá sự khác biệt về chất lượng sản phẩm của chúng tôi.
        </p>
        <div className="space-y-4">
            <button
              onClick={togglePopup}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Liên Hệ Tư Vấn Trực Tiếp
            </button>
        </div>
        <div className="my-8">
          <Image
            src="/images/banner-univi.png"
            alt="Liên hệ Đồng phục Univi – Đồng phục thể thao chất lượng cao"
            width={800}
            height={600}
            className="rounded"
          />
        </div>
      </section>

      {/* Popup cho Form Liên hệ */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full relative transform transition-transform duration-300 scale-100">
            <button
              onClick={togglePopup}
              className="absolute top-3 right-3 text-gray-600 hover:text-red-600 font-bold text-lg"
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Đăng ký tư vấn miễn phí
            </h3>
            <ContactForm />
          </div>
        </div>
      )}
    </article>
  );
}