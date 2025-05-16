import React from "react";
import Head from "next/head";
import DefaultLayout from "../../components/layout/DefaultLayout";

const LogoMeaning = () => {
  return (
    <DefaultLayout>
      <Head>
        <title>Ý nghĩa logo Eco Bắc Giang | Eco Bắc Giang</title>
        <meta
          name="description"
          content="Khám phá ý nghĩa logo của Eco Bắc Giang - biểu tượng kết hợp giữa nông nghiệp hữu cơ và công nghệ cao, hướng đến phát triển bền vững."
        />
        <meta
          name="keywords"
          content="Eco Bắc Giang, ý nghĩa logo, nông nghiệp công nghệ cao, sản xuất hữu cơ, phát triển bền vững"
        />
        <meta name="author" content="Eco Bắc Giang" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content="Ý nghĩa logo Eco Bắc Giang | Eco Bắc Giang"
        />
        <meta
          property="og:description"
          content="Khám phá ý nghĩa logo của Eco Bắc Giang - biểu tượng kết hợp giữa nông nghiệp hữu cơ và công nghệ cao, hướng đến phát triển bền vững."
        />
        <meta property="og:image" content="/images/logo-meaning.jpg" />
        <meta
          property="og:url"
          content="https://www.ecobacgiang.vn/logo-meaning"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="h-[80px] bg-white"></div>

      <div className="container md:w-11/12 mx-auto px-6 lg:px-20 relative gap-10 items-center">
        <h1 className="text-center text-2xl font-bold text-green-500 mb-8">
          Ý nghĩa logo Eco Bắc Giang
        </h1>

        {/* Giới thiệu */}
        <h2 className="text-xl font-semibold text-green-500 mb-4">
          Giới thiệu
        </h2>
        <p className="text-gray-700 mb-4">
          Logo của Eco Bắc Giang không chỉ là biểu tượng đại diện cho một thương
          hiệu, mà còn mang trong mình một thông điệp sâu sắc về sự kết hợp giữa
          nông nghiệp hữu cơ và công nghệ cao. Đây là một thiết kế tinh tế, phản
          ánh rõ ràng tầm nhìn chiến lược và sứ mệnh phát triển bền vững của dự
          án tại Bắc Giang – một vùng đất có tiềm năng nông nghiệp lớn.
        </p>
        <img
          src="/images/logo-eco-bac-giang.png"
          alt="Logo Eco Bắc Giang"
          className="md:w-1/2 w-full mx-auto rounded-lg mt-4"
        />

        {/* Ý nghĩa và thông điệp chính */}
        <h2 className="text-xl font-semibold text-green-500 mb-4">
          Ý nghĩa và thông điệp chính
        </h2>
        <p className="text-gray-700 mb-4">
          <strong>&quot;Agriculture of Thinks&quot;</strong> Cụm từ này nhấn mạnh vào tư
          duy sáng tạo và đổi mới trong nông nghiệp. Không còn dừng lại ở việc
          canh tác truyền thống, dự án Eco Bắc Giang tập trung vào việc áp dụng
          các giải pháp công nghệ như trí tuệ nhân tạo (AI), IoT, và robot để
          cải thiện hiệu quả sản xuất và quản lý nông trại. Từ “Thinks” là điểm
          nhấn, gợi mở về sự kết hợp giữa tư duy chiến lược và công nghệ tiên
          tiến, mở ra một xu hướng nông nghiệp hiện đại.
        </p>

        {/* Ý tưởng cho slogan */}
        <h2 className="text-xl font-semibold text-green-500 mb-4">
          Ý tưởng cho slogan
        </h2>
        <p className="text-gray-700 mb-4">
          Slogan <strong>&quot;Agriculture of Thinks&quot;</strong> được lấy cảm hứng từ
          hai khái niệm cốt lõi:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            <strong>AI (Artificial Intelligence - Trí tuệ nhân tạo):</strong>{" "}
            Giống như các công ty công nghệ lớn sử dụng trí tuệ nhân tạo để tối
            ưu hóa sản phẩm và dịch vụ, Eco Bắc Giang cũng ứng dụng AI vào nông
            nghiệp để cải thiện quy trình sản xuất, giảm lãng phí và tăng cường
            hiệu quả.
          </li>
          <li>
            <strong>IoT (Internet of Things - Internet vạn vật):</strong> Việc
            sử dụng IoT trong nông nghiệp giúp quản lý môi trường canh tác một
            cách thông minh và tự động hóa. Dựa trên ý tưởng này, Eco Bắc Giang
            đã phát triển khái niệm{" "}
            <strong>&quot;AoT - Agriculture of Thinks&quot;</strong> (Nông nghiệp trong
            suy nghĩ), nhấn mạnh vào việc kết hợp công nghệ và tư duy chiến lược
            trong nông nghiệp hiện đại.
          </li>
        </ul>

        <h2 className="text-xl font-semibold text-green-500 mb-4">
          Màu sắc và hình khối
        </h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            <strong>Màu xanh lá cây (#009245):</strong> Đại diện cho sự phát
            triển bền vững và thân thiện với môi trường, màu sắc này biểu tượng
            cho nông nghiệp hữu cơ, một trong những trụ cột của dự án.
          </li>
          <li>
            <strong>Màu cam (#FBB03B):</strong> Tượng trưng cho sự sáng tạo, đổi
            mới và năng lượng tích cực. Đây cũng là màu sắc thể hiện sự nhiệt
            huyết, khát vọng tiên phong trong việc ứng dụng công nghệ vào nông
            nghiệp.
          </li>
          <li>
            <strong>Màu đen (#000000):</strong> Mang đến sự tương phản mạnh mẽ,
            tạo cảm giác chuyên nghiệp và hiện đại, kết hợp với sự chính xác và
            nghiêm túc trong sứ mệnh phát triển nông nghiệp công nghệ cao.
          </li>
        </ul>
        <img
          src="/images/mau-logo.jpg"
          alt="Tầm nhìn của Eco Bắc Giang"
          className="w-full h-auto rounded-lg mt-4 items-center justify-center"
        />

        <h2 className="text-xl font-semibold text-green-500 mb-4">
          Biểu tượng và hình học
        </h2>
        <ul className="list-disc list-inside text-gray-700 mb-4">
          <li>
            <strong>Chữ &quot;C&quot; và biểu tượng vô cực:</strong> Phần chữ &quot;C&quot; trong từ{" "}
            <strong>&quot;ECO&quot;</strong> được tạo thành bởi hai hình tròn lồng ghép,
            gợi liên tưởng đến biểu tượng vô cực (∞). Điều này thể hiện tính
            sáng tạo không giới hạn và cam kết liên tục phát triển của dự án.
            Hình tròn tượng trưng cho chu kỳ tự nhiên và sự tuần hoàn, tương ứng
            với ý tưởng về sự cân bằng và bền vững.
          </li>
          <li>
            <strong>Tỷ lệ vàng:</strong> Logo sử dụng các hình tròn và tỉ lệ
            vàng (Golden Ratio) để tạo sự cân đối và hài hòa, mang lại cảm giác
            nhất quán và trực quan dễ chịu. Các hình dạng được lồng ghép thông
            minh, đại diện cho sự đồng nhất và kết nối, rất phù hợp với ngành
            nông nghiệp công nghệ cao mà dự án hướng đến.
          </li>
          <li>
            <strong>Kích thước và cấu trúc:</strong> Logo không chỉ có tính kỹ
            thuật thẩm mỹ, mà còn ẩn chứa sự kết nối với vùng đất Bắc Giang, nơi
            dự án được triển khai. Điều này thể hiện qua tỷ lệ chính xác, tinh
            tế, tượng trưng cho sự cân đối và phát triển hài hòa mà dự án mong
            muốn đạt được.
          </li>
        </ul>
        <img
          src="/images/logo-eco.png"
          alt="Tầm nhìn của Eco Bắc Giang"
          className="w-full h-auto rounded-lg mt-4 items-center justify-center"
        />

        {/* Kết luận */}
        <h2 className="text-xl font-semibold text-green-500 mb- ">Kết luận</h2>
        <p className="text-gray-700 mb-8">
          Logo của Eco Bắc Giang truyền tải một thông điệp mạnh mẽ về nông
          nghiệp bền vững kết hợp với công nghệ cao. Đây là một biểu tượng không
          chỉ đẹp về mặt hình thức mà còn sâu sắc về ý nghĩa, đại diện cho khát
          vọng và tầm nhìn đổi mới trong nông nghiệp, đồng thời là cam kết của
          dự án trong việc đóng góp cho sự phát triển của tỉnh Bắc Giang và
          ngành nông nghiệp nói chung.
        </p>
      </div>
    </DefaultLayout>
  );
};

export default LogoMeaning;
