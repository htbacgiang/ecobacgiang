import React from "react";

const QualityPolicy = () => {
  return (
    <div className="bg-white py-12">
      <div className="container md:w-10/12 mx-auto px-4">
        {/* Tiêu đề */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-green-700">
          Tương Lai Và Sứ Mệnh
          </h2>
          <p className="text-lg text-green-600 mt-2">
          Eco Bắc Giang không chỉ dừng lại ở việc sản xuất thực phẩm hữu cơ mà còn mong muốn tạo nên sự thay đổi lớn hơn. 
          </p>
        </div>

        {/* Nội dung */}
        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/* Cột trái */}
          <div className="md:w-2/4">
            <ul className="space-y-6">
              <li className="flex items-start">
                <p>
                Chúng tôi cam kết đồng hành cùng nông dân, đối tác và khách hàng trong hành trình xây dựng một nền nông nghiệp bền vững. Eco Bắc Giang luôn lắng nghe và đáp ứng nhu cầu của thị trường, mang lại những giá trị vượt trội cho người tiêu dùng và xã hội.
                </p>
              </li>
              <li className="flex items-start">
                <p>
                Tầm nhìn của chúng tôi là biến Eco Bắc Giang thành ngọn hải đăng trong ngành nông nghiệp thông minh, không chỉ tại Việt Nam mà còn trên trường quốc tế. Chúng tôi tin rằng, với sự hỗ trợ từ cộng đồng và sự cống hiến không ngừng nghỉ, một tương lai xanh, thịnh vượng và bền vững đang chờ đón.
                </p>
              </li>
          
              <li className="flex items-start">
                <p>
                Hãy cùng chúng tôi chung tay kiến tạo một tương lai nơi con người và thiên nhiên cùng phát triển, nơi mỗi sản phẩm không chỉ là thực phẩm mà còn là lời cam kết với một thế giới tốt đẹp hơn.
                </p>
              </li>
            </ul>
          </div>

          {/* Cột phải */}
          <div className="md:w-2/4">
            <div className="overflow-hidden shadow-lg rounded-tl-3xl rounded-br-3xl">
              <img
                src="/images/founder-ecobacgiang.jpg"
                alt="Chính sách chất lượng"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityPolicy;
