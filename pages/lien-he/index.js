import Head from "next/head";
import { MdLocationOn, MdEmail, MdPhone, MdAccessTime } from "react-icons/md";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import DefaultLayout from "../../components/layout/DefaultLayout";
import ContactForm from "../../components/header/ContactForm";

const contactInfo = {
  address: "Tân An, Yên Dũng, Bắc Giang",
  email: "lienhe@ecobacgiang.vn",
  phone: "0866.572.271",
  workingHours: "Thứ 2 - Thứ 7: 8:00 - 18:00",
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://ecobacgiang.vn";

export default function ContactPage({ meta }) {
  return (
    <>

      <DefaultLayout>
        {/* Hero Section */}
        <section className="relative min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 py-20 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-xl"></div>
            <div className="absolute bottom-20 right-20 w-64 h-64 bg-green-400 rounded-full mix-blend-multiply filter blur-xl"></div>
          </div>

          <div className="relative container mx-auto max-w-7xl px-6">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-full shadow-lg mb-6">
                <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                Liên Hệ Chúng Tôi
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                Hãy <span className="text-green-600">Liên Hệ</span> Với Chúng Tôi
              </h1>
              <div className="w-20 h-1 bg-green-600 rounded-full mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin hoặc liên hệ trực tiếp với chúng tôi.
              </p>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {/* Address Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MdLocationOn className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Địa Chỉ</h3>
                  <p className="text-gray-600 leading-relaxed">{contactInfo.address}</p>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MdEmail className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Email</h3>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-green-600 hover:text-green-700 font-medium transition-colors duration-300"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>

              {/* Phone Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MdPhone className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Điện Thoại</h3>
                  <a
                    href={`tel:${contactInfo.phone}`}
                    className="text-green-600 hover:text-green-700 font-medium transition-colors duration-300"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              {/* Working Hours Card */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <MdAccessTime className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Giờ Làm Việc</h3>
                  <p className="text-gray-600 leading-relaxed">{contactInfo.workingHours}</p>
                </div>
              </div>
            </div>

            {/* Contact Form Section */}
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-100 overflow-hidden">
              <div className="p-8 lg:p-12">
                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Gửi Tin Nhắn</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Hãy để lại thông tin và chúng tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
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
      image: `${BASE_URL}/images/banner.png`,
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
      image: `${BASE_URL}/images/banner.png`,
      site: "@EcoBacGiang",
    },
  };

  return { props: { meta } };
}
