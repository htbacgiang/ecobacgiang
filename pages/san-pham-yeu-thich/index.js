import FavoriteProductsList from "../../components/ecobacgiang/FavoriteProductsList";
import DefaultLayout from "../../components/layout/DefaultLayout";
import Head from "next/head";

export default function FavoritesPage() {
  return (
    <DefaultLayout>
      <Head>
        <title>Danh Sách Sản Phẩm Yêu Thích | Eco Bắc Giang</title>
        <meta
          name="description"
          content="Khám phá danh sách sản phẩm yêu thích của bạn tại Eco Bắc Giang. Các sản phẩm hữu cơ tươi sạch, an toàn cho sức khỏe của bạn và gia đình."
        />
        <meta
          name="keywords"
          content="danh sách yêu thích, sản phẩm hữu cơ, Eco Bắc Giang, nông sản hữu cơ, thực phẩm sạch, sản phẩm tươi sạch"
        />
        <meta property="og:title" content="Danh Sách Sản Phẩm Yêu Thích | Eco Bắc Giang" />
        <meta
          property="og:description"
          content="Khám phá các sản phẩm hữu cơ tươi sạch tại Eco Bắc Giang trong danh sách yêu thích của bạn. Chúng tôi cung cấp sản phẩm an toàn cho sức khỏe."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ecobacgiang.vn/danh-sach-yeu-thich" />
        <meta property="og:image" content="/images/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="robots" content="index, follow" />
      </Head>
        <div>
      <div className="h-[80px] bg-white"></div>

        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem'
        }}>
          <FavoriteProductsList />
        </div>
      </div>
    </DefaultLayout>
  );
}
