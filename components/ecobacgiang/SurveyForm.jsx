import Link from 'next/link';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function SurveyForm() {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: prev[name]
          ? checked
            ? [...prev[name], value]
            : prev[name].filter((v) => v !== value)
          : checked
            ? [value]
            : [],
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
        toast.success('Cảm ơn bạn đã gửi khảo sát!', {
          duration: 5000,
          position: 'top-center',
        });
      } else {
        toast.error(data.message || 'Đã có lỗi xảy ra khi gửi biểu mẫu. Vui lòng thử lại.', {
          duration: 5000,
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Không thể kết nối với máy chủ. Vui lòng kiểm tra kết nối mạng.', {
        duration: 5000,
        position: 'top-center',
      });
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Lời cảm ơn!</h2>
        <p className="text-gray-700 pb-5">
          Một lần nữa, Eco Bắc Giang xin chân thành cảm ơn những ý kiến đóng góp vô cùng quý báu của anh/chị. Chúc anh/chị và gia đình thật nhiều sức khỏe và bình an!
        </p>
        <Link href="/" className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        > Quay lại trang chủ </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <Toaster />
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Khảo sát về Trải nghiệm của bạn với Chương trình &ldquo;Những người Kiến Tạo&rdquo; Eco Bắc Giang
      </h1>
      <p className="text-gray-600 mb-6">
        Chào anh/chị, tôi là Ngô Quang Trường, nhà sáng lập dự án Eco Bắc Giang. Lời đầu tiên, tôi xin gửi lời cảm ơn chân thành nhất đến anh/chị vì đã tin tưởng và trở thành một trong những &ldquo;Người Kiến tạo&rdquo; đầu tiên của dự án...
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* PHẦN A: THÔNG TIN CHUNG & HÀNH VI */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">PHẦN A: THÔNG TIN CHUNG & HÀNH VI</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              1. Anh/chị đã tham gia ủng hộ chương trình &ldquo;Những người Kiến tạo&rdquo; của Eco Bắc Giang phải không ạ?
            </label>
            <div className="space-y-2">
              <label className="block">
                <input
                  type="radio"
                  name="q1"
                  value="Có"
                  onChange={handleChange}
                  checked={formData.q1 === 'Có'}
                  required
                  className="mr-2"
                />
                Có
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q1"
                  value="Không"
                  onChange={handleChange}
                  checked={formData.q1 === 'Không'}
                  className="mr-2"
                />
                Không
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              2. Anh/chị biết đến chương trình của chúng tôi qua kênh nào là chủ yếu?
            </label>
            <div className="space-y-2">
              <label className="block">
                <input
                  type="radio"
                  name="q2"
                  value="Facebook (Qua bài viết của Ngô Quang Trường hoặc Fanpage)"
                  onChange={handleChange}
                  checked={formData.q2 === 'Facebook (Qua bài viết của Ngô Quang Trường hoặc Fanpage)'}
                  required
                  className="mr-2"
                />
                Facebook (Qua bài viết của Ngô Quang Trường, Website hoặc Fanpage)
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q2"
                  value="Bạn bè, người thân giới thiệu"
                  onChange={handleChange}
                  checked={formData.q2 === 'Bạn bè, người thân giới thiệu'}
                  className="mr-2"
                />
                Bạn bè, người thân giới thiệu
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q2"
                  value="Báo chí, truyền thông"
                  onChange={handleChange}
                  checked={formData.q2 === 'Báo chí, truyền thông'}
                  className="mr-2"
                />
                Báo chí, truyền thông
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="q2"
                  value="Khác"
                  onChange={handleChange}
                  checked={formData.q2 === 'Khác'}
                  className="mr-2"
                />
                Khác: <input
                  type="text"
                  name="q2_other"
                  onChange={handleChange}
                  value={formData.q2_other || ''}
                  className="ml-2 border rounded p-1 w-full max-w-xs"
                />
              </label>
            </div>
          </div>
        </div>

        {/* PHẦN B: CÂU CHUYỆN BỮA ĂN */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">PHẦN B: CÂU CHUYỆN BỮA ĂN CỦA GIA ĐÌNH BẠN</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              3. Khi nghĩ đến việc chuẩn bị một bữa ăn cho gia đình, điều gì khiến anh/chị cảm thấy lo lắng hoặc tốn nhiều công sức nhất?
            </label>
            <div className="space-y-2">
              {[
                'Mất thời gian đi chợ, lựa chọn thực phẩm.',
                'Không chắc chắn về nguồn gốc, độ an toàn của thực phẩm.',
                'Khó tìm được sản phẩm thực sự tươi, ngon.',
                'Không có nhiều ý tưởng để chế biến món ăn đa dạng.',
                'Chi phí cho thực phẩm sạch khá cao.',
              ].map((option) => (
                <label key={option} className="block">
                  <input
                    type="checkbox"
                    name="q3"
                    value={option}
                    onChange={handleChange}
                    checked={formData.q3?.includes(option) || false}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              4. Theo anh/chị, một giải pháp &ldquo;hoàn hảo&rdquo; cho bữa ăn sẽ giúp anh/chị đạt được điều gì quan trọng nhất?
            </label>
            <div className="space-y-2">
              <label className="block">
                <input
                  type="radio"
                  name="q4"
                  value="Tiết kiệm được thời gian và công sức."
                  onChange={handleChange}
                  checked={formData.q4 === 'Tiết kiệm được thời gian và công sức.'}
                  required
                  className="mr-2"
                />
                Tiết kiệm được thời gian và công sức.
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q4"
                  value="Có được sự an tâm tuyệt đối về sức khỏe của cả nhà."
                  onChange={handleChange}
                  checked={formData.q4 === 'Có được sự an tâm tuyệt đối về sức khỏe của cả nhà.'}
                  className="mr-2"
                />
                Có được sự an tâm tuyệt đối về sức khỏe của cả nhà.
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q4"
                  value="Có được những bữa ăn thực sự ngon và giàu dinh dưỡng."
                  onChange={handleChange}
                  checked={formData.q4 === 'Có được những bữa ăn thực sự ngon và giàu dinh dưỡng.'}
                  className="mr-2"
                />
                Có được những bữa ăn thực sự ngon và giàu dinh dưỡng.
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q4"
                  value="Có thêm những kiến thức, cảm hứng để việc bếp núc trở nên vui vẻ hơn."
                  onChange={handleChange}
                  checked={formData.q4 === 'Có thêm những kiến thức, cảm hứng để việc bếp núc trở nên vui vẻ hơn.'}
                  className="mr-2"
                />
                Có thêm những kiến thức, cảm hứng để việc bếp núc trở nên vui vẻ hơn.
              </label>
            </div>
          </div>
        </div>

        {/* PHẦN C: TRẢI NGHIỆM */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            PHẦN C: TRẢI NGHIỆM CỦA ANH/CHỊ VỚI CHƯƠNG TRÌNH &ldquo;NHỮNG NGƯỜI KIẾN TẠO&rdquo;
          </h2>
          {[
            {
              id: 'q5',
              text: 'Câu chuyện khởi nghiệp của nhà sáng lập Ngô Quang Trường đã giúp tôi hiểu rõ hơn về tâm huyết và triết lý đằng sau dự án.',
            },
            {
              id: 'q6',
              text: 'Nền tảng chuyên môn (Kỹ sư PTIT, MBA...) của đội ngũ sáng lập làm tôi cảm thấy tin tưởng vào năng lực thực thi của họ.',
            },
            {
              id: 'q7',
              text: 'Nguồn cảm hứng từ các dự án cộng đồng như &ldquo;Sức Mạnh 2000&rdquo; làm tôi tin rằng Eco Bắc Giang là một dự án tử tế và có trách nhiệm.',
            },
            {
              id: 'q8',
              text: 'Video và các hình ảnh giới thiệu về dự án được chuẩn bị rất chuyên nghiệp và chỉn chu.',
            },
            {
              id: 'q9',
              text: 'Trang web ecobacgiang.vn với các tính năng tự động (tạo mã QR, cập nhật real-time) mang lại trải nghiệm ủng hộ rất mượt mà và đáng tin cậy.',
            },
            {
              id: 'q10',
              text: 'Việc trình bày rõ ràng về mục đích sử dụng vốn đã giúp tôi hiểu được đóng góp của mình sẽ tạo ra tác động cụ thể như thế nào.',
            },
          ].map((q) => (
            <div key={q.id} className="mb-4">
              <label className="block text-gray-700 mb-2">{q.text}</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    name={q.id}
                    value={value}
                    onClick={(e) => handleChange({ target: { name: q.id, value: value.toString() } })}
                    className={`w-10 h-10 rounded-md flex items-center justify-center border ${formData[q.id] === value.toString() ? 'bg-green-600 text-white' : 'bg-white text-gray-700'} hover:bg-green-500 hover:text-white`}
                    required
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* PHẦN D: CẢM NHẬN VỀ CÔNG NGHỆ */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            PHẦN D: CẢM NHẬN VỀ CÁC TRẢI NGHIỆM CÔNG NGHỆ MỚI
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              11. Nếu Eco Bắc Giang có một &lsquo;trợ lý ảo&rsquo; (Chatbot AI), anh/chị sẽ cảm thấy:
            </label>
            <div className="space-y-2">
              <label className="block">
                <input
                  type="radio"
                  name="q11"
                  value="Rất hữu ích và sẽ thường xuyên sử dụng."
                  onChange={handleChange}
                  checked={formData.q11 === 'Rất hữu ích và sẽ thường xuyên sử dụng.'}
                  required
                  className="mr-2"
                />
                Rất hữu ích và sẽ thường xuyên sử dụng.
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q11"
                  value="Hữu ích, có thể sẽ thử dùng."
                  onChange={handleChange}
                  checked={formData.q11 === 'Hữu ích, có thể sẽ thử dùng.'}
                  className="mr-2"
                />
                Hữu ích, có thể sẽ thử dùng.
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q11"
                  value="Bình thường, không thực sự cần thiết."
                  onChange={handleChange}
                  checked={formData.q11 === 'Bình thường, không thực sự cần thiết.'}
                  className="mr-2"
                />
                Bình thường, không thực sự cần thiết.
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q11"
                  value="Hơi phức tạp, tôi thích tự tìm kiếm hơn."
                  onChange={handleChange}
                  checked={formData.q11 === 'Hơi phức tạp, tôi thích tự tìm kiếm hơn.'}
                  className="mr-2"
                />
                Hơi phức tạp, tôi thích tự tìm kiếm hơn.
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              12. Tương tự, với tính năng đặt hàng bằng giọng nói (Voice AI), anh/chị nghĩ sao?
            </label>
            <div className="space-y-2">
              <label className="block">
                <input
                  type="radio"
                  name="q12"
                  value="Rất tuyệt vời, sẽ giúp tôi đặt hàng nhanh hơn nhiều."
                  onChange={handleChange}
                  checked={formData.q12 === 'Rất tuyệt vời, sẽ giúp tôi đặt hàng nhanh hơn nhiều.'}
                  required
                  className="mr-2"
                />
                Rất tuyệt vời, sẽ giúp tôi đặt hàng nhanh hơn nhiều.
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q12"
                  value="Thú vị, đáng để thử."
                  onChange={handleChange}
                  checked={formData.q12 === 'Thú vị, đáng để thử.'}
                  className="mr-2"
                />
                Thú vị, đáng để thử.
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q12"
                  value="Không chắc lắm, tôi lo AI sẽ không hiểu đúng ý mình."
                  onChange={handleChange}
                  checked={formData.q12 === 'Không chắc lắm, tôi lo AI sẽ không hiểu đúng ý mình.'}
                  className="mr-2"
                />
                Không chắc lắm, tôi lo AI sẽ không hiểu đúng ý mình.
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q12"
                  value="Không cần thiết, tôi quen với cách đặt hàng truyền thống hơn."
                  onChange={handleChange}
                  checked={formData.q12 === 'Không cần thiết, tôi quen với cách đặt hàng truyền thống hơn.'}
                  className="mr-2"
                />
                Không cần thiết, tôi quen với cách đặt hàng truyền thống hơn.
              </label>
            </div>
          </div>
        </div>

        {/* PHẦN E: TÁC ĐỘNG ĐẾN THƯƠNG HIỆU & SỰ GẮN KẾT */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            PHẦN E: TÁC ĐỘNG ĐẾN THƯƠNG HIỆU & SỰ GẮN KẾT
          </h2>
          {[
            {
              id: 'q13',
              text: 'Tôi đánh giá Eco Bắc Giang là một thương hiệu rất đáng tin cậy.',
            },
            {
              id: 'q14',
              text: 'Tôi tin rằng chất lượng sản phẩm trong tương lai của Eco Bắc Giang sẽ vượt trội.',
            },
            {
              id: 'q15',
              text: 'Tôi cảm thấy an tâm khi nghĩ đến việc sử dụng sản phẩm của Eco Bắc Giang cho gia đình mình.',
            },
            {
              id: 'q16',
              text: 'Tôi cảm thấy vui và tự hào khi được là một phần trong hành trình kiến tạo nên Eco Bắc Giang.',
            },
            {
              id: 'q17',
              text: 'Tôi sẽ tiếp tục theo dõi và ủng hộ các hoạt động tiếp theo của Eco Bắc Giang.',
            },
            {
              id: 'q18',
              text: 'Tôi sẵn sàng giới thiệu câu chuyện của Eco Bắc Giang cho bạn bè và người thân của mình.',
            },
            {
              id: 'q19',
              text: 'Tôi thực sự cảm thấy mình là một &ldquo;Người Kiến tạo&rdquo;, một thành viên của cộng đồng Eco Bắc Giang.',
            },
          ].map((q) => (
            <div key={q.id} className="mb-4">
              <label className="block text-gray-700 mb-2">{q.text}</label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    name={q.id}
                    value={value}
                    onClick={(e) => handleChange({ target: { name: q.id, value: value.toString() } })}
                    className={`w-10 h-10 rounded-md flex items-center justify-center border ${formData[q.id] === value.toString() ? 'bg-green-600 text-white' : 'bg-white text-gray-700'} hover:bg-green-500 hover:text-white`}
                    required
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* PHẦN F: GÓP Ý & THÔNG TIN CÁ NHÂN */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">PHẦN F: GÓP Ý & THÔNG TIN CÁ NHÂN</h2>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              20. Theo anh/chị, điều gì là ấn tượng nhất/tạo ra sự tin tưởng lớn nhất trong toàn bộ chương trình &ldquo;Những người Kiến tạo&rdquo;?
            </label>
            <textarea
              name="q20"
              onChange={handleChange}
              value={formData.q20 || ''}
              className="w-full border rounded p-2"
              rows="4"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              21. Anh/chị có góp ý nào để Eco Bắc Giang có thể làm tốt hơn trong tương lai không ạ?
            </label>
            <textarea
              name="q21"
              onChange={handleChange}
              value={formData.q21 || ''}
              className="w-full border rounded p-2"
              rows="4"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">22. Giới tính của anh/chị:</label>
            <div className="space-y-2">
              <label className="block">
                <input
                  type="radio"
                  name="q22"
                  value="Nam"
                  onChange={handleChange}
                  checked={formData.q22 === 'Nam'}
                  required
                  className="mr-2"
                />
                Nam
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q22"
                  value="Nữ"
                  onChange={handleChange}
                  checked={formData.q22 === 'Nữ'}
                  className="mr-2"
                />
                Nữ
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q22"
                  value="Khác"
                  onChange={handleChange}
                  checked={formData.q22 === 'Khác'}
                  className="mr-2"
                />
                Khác
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">23. Vui lòng cho biết nhóm tuổi của anh/chị:</label>
            <div className="space-y-2">
              <label className="block">
                <input
                  type="radio"
                  name="q23"
                  value="Dưới 22"
                  onChange={handleChange}
                  checked={formData.q23 === 'Dưới 22'}
                  required
                  className="mr-2"
                />
                Dưới 22
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q23"
                  value="22-27"
                  onChange={handleChange}
                  checked={formData.q23 === '22-27'}
                  className="mr-2"
                />
                22-27
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q23"
                  value="28-35"
                  onChange={handleChange}
                  checked={formData.q23 === '28-35'}
                  className="mr-2"
                />
                28-35
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q23"
                  value="36-45"
                  onChange={handleChange}
                  checked={formData.q23 === '36-45'}
                  className="mr-2"
                />
                36-45
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q23"
                  value="Trên 45"
                  onChange={handleChange}
                  checked={formData.q23 === 'Trên 45'}
                  className="mr-2"
                />
                Trên 45
              </label>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">24. Nơi sinh sống chủ yếu của anh/chị:</label>
            <div className="space-y-2">
              <label className="block">
                <input
                  type="radio"
                  name="q24"
                  value="Hà Nội"
                  onChange={handleChange}
                  checked={formData.q24 === 'Hà Nội'}
                  required
                  className="mr-2"
                />
                Hà Nội
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q24"
                  value="Bắc Giang"
                  onChange={handleChange}
                  checked={formData.q24 === 'Bắc Giang'}
                  className="mr-2"
                />
                Bắc Giang
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q24"
                  value="Bắc Ninh"
                  onChange={handleChange}
                  checked={formData.q24 === 'Bắc Ninh'}
                  className="mr-2"
                />
                Bắc Ninh
              </label>
              <label className="block">
                <input
                  type="radio"
                  name="q24"
                  value="Tỉnh thành khác"
                  onChange={handleChange}
                  checked={formData.q24 === 'Tỉnh thành khác'}
                  className="mr-2"
                />
                Tỉnh thành khác
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
        >
          Gửi Biểu Mẫu
        </button>
      </form>
    </div>
  );
}