import { useState } from 'react';
import Image from 'next/image';
import { FaChevronDown, FaChevronUp, FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import Link from "next/link";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'Đồng phục Univi có hỗ trợ đặt may đồng phục theo thiết kế riêng không?',
      answer:
        'Có, chúng tôi hỗ trợ đặt may đồng phục thể thao theo thiết kế riêng, đặc biệt với giải pháp 2S Uniform cho các chuỗi phòng tập. Bạn có thể liên hệ đội ngũ của chúng tôi để thảo luận về ý tưởng, chất liệu, và yêu cầu cụ thể.',
    },
    {
      question: 'Chất liệu vải của Đồng phục Univi có an toàn và thân thiện không?',
      answer:
        'Chúng tôi sử dụng các dòng vải chuyên dụng (Quick Dry, Super Cool, Blended) đạt chứng nhận an toàn từ Trung tâm giám định Bộ Công Thương, không chứa Formaldehyde và Amin thơm Azo, đảm bảo an toàn cho da nhạy cảm và thân thiện với môi trường.',
    },
    {
      question: 'Thời gian giao hàng của Đồng phục Univi là bao lâu?',
      answer:
        'Thời gian giao hàng phụ thuộc vào sản phẩm và yêu cầu. Sản phẩm có sẵn giao trong 3-7 ngày làm việc. Đối với đồng phục thiết kế riêng, thời gian giao hàng từ 2-4 tuần, đảm bảo chất lượng và đúng tiến độ.',
    },
    {
      question: 'Đồng phục Univi có cung cấp dịch vụ tư vấn thiết kế đồng phục không?',
      answer:
        'Có, chúng tôi cung cấp dịch vụ tư vấn thiết kế đồng phục miễn phí. Đội ngũ chuyên gia sẽ hỗ trợ bạn từ khâu chọn chất liệu, lên ý tưởng, đến tối ưu thiết kế để phù hợp với nhu cầu và phong cách của bạn.',
    },
    {
      question: 'Chính sách bảo hành của Đồng phục Univi như thế nào?',
      answer:
        'Chúng tôi cung cấp chính sách bảo hành từ 6 tháng đến 2 năm tùy sản phẩm, bao gồm lỗi sản xuất như đường may hoặc chất liệu. Vui lòng liên hệ hotline hoặc email để được hỗ trợ chi tiết.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-900 text-white py-12" aria-labelledby="faq-heading">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: FAQ Section */}
          <div className="md:col-span-2">
            <p className="text-blue-300 text-sm uppercase tracking-widest mb-2">
              CÂU HỎI THƯỜNG GẶP
            </p>
            <h2 id="faq-heading" className="text-xl md:text-3xl font-bold mb-8">
              Sản Phẩm & Dịch Vụ
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-gray-700 transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center py-4 text-left focus:outline-none"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="text-lg font-semibold text-white hover:text-orange-500 transition-colors duration-200">
                      {faq.question}
                    </span>
                    {openIndex === index ? (
                      <FaChevronUp className="text-orange-500" />
                    ) : (
                      <FaChevronDown className="text-orange-500" />
                    )}
                  </button>
                  {openIndex === index && (
                    <div id={`faq-answer-${index}`} className="pb-4">
                      <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Contact Us Section */}
          <div className="md:col-span-1">
            <h3 className="text-2xl font-semibold mb-4">Liên Hệ Với Chúng Tôi</h3>
            <p className="text-gray-300 mb-2">
              180 Thanh Bình, Mộ Lao, Hà Đông, Hà Nội
            </p>
          
            <p className="text-gray-300 mb-4">
              <a
                href="tel:+84975973397"
                className="hover:text-orange-500 transition-colors duration-200"
              >
                Hotline/Zalo: 0975.973.397
              </a>
              <br />
              <a
                href="mailto:univisport@gmail.com"
                className="hover:text-orange-500 transition-colors duration-200"
              >
                Email: univisport@gmail.com
              </a>
            </p>
            <div className="relative h-48 rounded-lg overflow-hidden mb-4">
            <Link href="https://www.facebook.com/Dongphucunivi">
            <Image
                src="/baner-univi.jpg"
                alt="Showroom Đồng phục Univi"
                layout="fill"
                objectFit="cover"
                className="brightness-75 transition-transform duration-300 hover:scale-105"
                onError={() => console.error('Không tải được hình ảnh: /baner-univi.jpg')}
              />
            </Link>
            </div>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              Đồng phục Univi cam kết mang đến trang phục thể thao chất lượng cao với công nghệ UNI DRY, giúp bạn tự tin và thoải mái trong mọi hoạt động. Hãy theo dõi chúng tôi để cập nhật xu hướng mới nhất.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com/Dongphucunivi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Theo dõi Đồng phục Univi trên Facebook"
              >
                <FaFacebook className="text-white hover:text-orange-500 text-xl transition-colors duration-200" />
              </a>
              <a
                href="https://instagram.com/Dongphucunivi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Theo dõi Đồng phục Univi trên Instagram"
              >
                <FaInstagram className="text-white hover:text-orange-500 text-xl transition-colors duration-200" />
              </a>
              <a
                href="https://youtube.com/Dongphucunivi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Theo dõi Đồng phục Univi trên YouTube"
              >
                <FaYoutube className="text-white hover:text-orange-500 text-xl transition-colors duration-200" />
              </a>
              <a
                href="https://tiktok.com/@Dongphucunivi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Theo dõi Đồng phục Univi trên TikTok"
              >
                <FaTiktok className="text-white hover:text-orange-500 text-xl transition-colors duration-200" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}