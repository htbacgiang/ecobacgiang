import SurveyForm from "../../components/ecobacgiang/SurveyForm";
import DefaultLayout3 from "../../components/layout/DefaultLayout3";
import Head from 'next/head';

export default function Khaosat() {
  return (
    <DefaultLayout3>
      <Head>
        <title>Khảo sát Eco Bắc Giang - Những Người Kiến Tạo</title>
        <meta
          name="description"
          content="Tham gia khảo sát về trải nghiệm với chương trình 'Những Người Kiến Tạo' của Eco Bắc Giang để đóng góp ý kiến quý báu, giúp xây dựng thương hiệu và cộng đồng startup bền vững."
        />
        <meta name="keywords" content="Eco Bắc Giang, khảo sát, crowdfunding, startup, cộng đồng, thực phẩm sạch" />
        <meta name="author" content="Ngô Quang Trường" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Khảo sát Eco Bắc Giang - Những Người Kiến Tạo" />
        <meta
          property="og:description"
          content="Tham gia khảo sát để chia sẻ trải nghiệm của bạn với Eco Bắc Giang, góp phần xây dựng thương hiệu và cộng đồng startup bền vững."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/khaosat" />
        <meta property="og:image" content="https://yourdomain.com/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Khảo sát Eco Bắc Giang - Những Người Kiến Tạo" />
        <meta
          name="twitter:description"
          content="Tham gia khảo sát để chia sẻ trải nghiệm của bạn với Eco Bắc Giang."
        />
        <meta name="twitter:image" content="https://yourdomain.com/og-image.jpg" />
        <link rel="canonical" href="https://yourdomain.com/khaosat" />
      </Head>
      <section className="min-h-screen py-5 pt-28 bg-gray-50">
        <SurveyForm />
      </section>
    </DefaultLayout3>
  );
}