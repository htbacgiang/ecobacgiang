import React from "react";
import Head from "next/head";
import DefaultLayout from "../../components/layout/DefaultLayout";
import CoreValues from "../../components/about/CoreValues";
import VisionComponent from "../../components/about/VisionComponent";

const VisionMissionCoreValues = () => {
  return (
    <DefaultLayout>
      <Head>
        <title>Tầm nhìn - Sứ mệnh - Giá trị cốt lõi | Eco Bắc Giang</title>
        <meta
          name="description"
          content="Khám phá tầm nhìn, sứ mệnh và giá trị cốt lõi của Eco Bắc Giang, thương hiệu hàng đầu trong lĩnh vực nông nghiệp thông minh và sản xuất hữu cơ bền vững tại Việt Nam."
        />
        <meta
          name="keywords"
          content="Eco Bắc Giang, nông nghiệp thông minh, sản xuất hữu cơ, kinh tế xanh, Net Zero 2050, bảo vệ môi trường, trách nhiệm xã hội, IoT nông nghiệp"
        />
        <meta name="author" content="Eco Bắc Giang" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          property="og:title"
          content="Tầm nhìn - Sứ mệnh - Giá trị cốt lõi | Eco Bắc Giang"
        />
        <meta
          property="og:description"
          content="Khám phá tầm nhìn, sứ mệnh và giá trị cốt lõi của Eco Bắc Giang, thương hiệu hàng đầu trong lĩnh vực nông nghiệp thông minh và sản xuất hữu cơ bền vững tại Việt Nam."
        />
        <meta property="og:image" content="/images/slide.jpg" />
        <meta property="og:url" content="https://www.ecobacgiang.vn" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="h-[80px] bg-white"></div>

      <div className="container mx-auto px-6 lg:px-20 relative gap-10 items-center">
        <h1 className="text-center text-3xl font-bold text-green-500 mb-8">
          Tầm nhìn - Sứ mệnh - Giá trị cốt lõi
        </h1>

        <VisionComponent />
        {/* Tầm nhìn và Sứ mệnh */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Tầm nhìn */}

          {/* Sứ mệnh */}
          <div className="bg-white rounded-lg px-2 flex-1">
            <h2 className="text-xl font-semibold text-green-500 mb-4">
              Sứ mệnh
            </h2>
            <ul className="list-disc text-base list-inside text-gray-700 mb-4">
              <li>
               <strong>  Sản xuất hữu cơ chất lượng cao:</strong> Cung cấp các loại rau củ hữu cơ
                sạch, an toàn, đảm bảo tiêu chuẩn quốc tế và bảo vệ tài nguyên
                thiên nhiên.
              </li>
              <li>
               <strong> Thuận tự nhiên:</strong> Địa phương canh tác được quy hoạch theo quy luật
                tự nhiên, giảm thiểu tác động xấu đến môi trường và tôn trọng sự
                cân bằng sinh thái.
              </li>
              <li>
                <strong>Ứng dụng công nghệ thông minh:</strong> Phát triển và triển khai các giải
                pháp IoT, hệ thống tự động hóa và robot để tối ưu hóa quy trình
                sản xuất, tiết kiệm tài nguyên và nâng cao hiệu quả.
              </li>
              <li>
                <strong>Phát triển kinh tế xanh:</strong> Thực hiện nguyên tắc ESG (Môi trường,
                Xã hội và Quản trị), góp phần đối phó biến đổi khí hậu và tăng
                cường trách nhiệm xã hội.
              </li>
              <li>
                <strong>Hỗ trợ cộng đồng nông nghiệp:</strong> Đồng hành cùng nông dân và các
                doanh nghiệp nhỏ trong chuyển đổi từ sản xuất truyền thống sang
                nông nghiệp thông minh, tăng thu nhập và giảm thiểu rủi ro.
              </li>
            </ul>
            <img
              src="/images/esg-ecobacgiang.jpg"
              alt="Sứ mệnh của Eco Bắc Giang"
              className="w-full h-auto rounded-lg mt-4"
            />
          </div>
        </div>

        {/* Giá trị cốt lõi */}
        <div className="pt-5 pb-3 ">
          <CoreValues />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default VisionMissionCoreValues;
