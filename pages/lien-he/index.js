import Head from "next/head";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import DefaultLayout from "../../components/layout/DefaultLayout";
import ContactForm from "../../components/header/ContactForm";

const contactInfo = {
  address: "Tân An,Yên Dũng, Bắc Giang", // Có thể thay đổi thông tin địa chỉ
  email: "lienhe@ecobacgiang.vn", // Thay đổi email cho Eco Bắc Giang
  phone: "0866.572.271", // Thay đổi số điện thoại
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ecobacgiang.vn"; // Cập nhật base URL cho Eco Bắc Giang

export default function ContactPage({ meta }) {
  return (
    <>
      <DefaultLayout>
        <section className="min-h-screen py-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold text-white text-center mb-10 mt-10 md:mt-20">
              Liên Hệ
            </h1>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 justify-center items-center mb-12">
              <div
                className="bg-gray-700 p-6 sm:p-8 rounded-lg text-center w-full max-w-xs"
                role="region"
                aria-label="Thông tin địa chỉ"
              >
                <div className="text-green-500 text-4xl mb-4 flex justify-center">
                  <MdLocationOn aria-hidden="true" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Địa chỉ</h3>
                <p className="text-gray-400">{contactInfo.address}</p>
              </div>
              <div
                className="bg-gray-700 p-6 sm:p-8 rounded-lg text-center w-full max-w-xs"
                role="region"
                aria-label="Thông tin email"
              >
                <div className="text-green-500 text-4xl mb-4 flex justify-center">
                  <MdEmail aria-hidden="true" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">E-Mail</h3>
                <p className="text-gray-400">
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label={`Gửi email đến ${contactInfo.email}`}
                  >
                    {contactInfo.email}
                  </a>
                </p>
              </div>
              <div
                className="bg-gray-700 p-6 sm:p-8 rounded-lg text-center w-full max-w-xs"
                role="region"
                aria-label="Thông tin số điện thoại"
              >
                <div className="text-green-500 text-4xl mb-4 flex justify-center">
                  <MdPhone aria-hidden="true" />
                </div>
                <h3 className="text-white text-xl font-semibold mb-2">Số điện thoại</h3>
                <p className="text-gray-400">
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label={`Gọi số ${contactInfo.phone}`}
                  >
                    {contactInfo.phone}
                  </a>
                </p>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </DefaultLayout>
    </>
  );
}

export async function getServerSideProps() {
  const meta = {
    title: "Liên Hệ – Eco Bắc Giang",
    description:
      "Liên hệ với Eco Bắc Giang qua địa chỉ, email và số điện thoại. Chúng tôi luôn sẵn sàng hỗ trợ và giải đáp thắc mắc của bạn về các sản phẩm nông sản hữu cơ.",
    keywords:
      "liên hệ, Eco Bắc Giang, địa chỉ, email, số điện thoại, nông sản hữu cơ, sản phẩm hữu cơ",
    author: "Eco Bắc Giang",
    robots: "index, follow",
    canonical: `${BASE_URL}/lien-he`,
    og: {
      title: "Liên Hệ – Eco Bắc Giang",
      description:
        "Liên hệ với Eco Bắc Giang qua địa chỉ, email và số điện thoại để được tư vấn về sản phẩm nông sản hữu cơ chất lượng cao.",
      type: "website",
      image: `${BASE_URL}/images/banner.png`, // Thay thế ảnh phù hợp với thương hiệu Eco Bắc Giang
      imageWidth: "1200",
      imageHeight: "630",
      url: `${BASE_URL}/lien-he`,
      siteName: "Eco Bắc Giang",
      locale: "vi_VN",
    },
    twitter: {
      card: "summary_large_image",
      title: "Liên Hệ – Eco Bắc Giang",
      description:
        "Liên hệ với Eco Bắc Giang để được tư vấn về các sản phẩm nông sản hữu cơ chất lượng cao.",
      image: `${BASE_URL}/images/banner.png`, // Thay thế ảnh phù hợp
      site: "@EcoBacGiang", // Thêm tên tài khoản Twitter của Eco Bắc Giang nếu có
    },
  };

  return { props: { meta } };
}
