import { useState } from "react";
import { getData } from "../../utils/fetchData";
import DefaultLayout from "../../components/layout/DefaultLayout";
import Head from "next/head";
import Products3 from "../../components/product/Products3";

const Products = (props) => {
  const [products, setProducts] = useState(props.products || []);
  return (
    <DefaultLayout>
      <Head>
        <title>Sản Phẩm | Eco Bắc Giang Nông Trại Hữu Cơ Thông Minh</title>
        <meta
          name="description"
          content="Khám phá bộ sưu tập nông sản hữu cơ từ Eco Bắc Giang, được trồng tại nông trại thông minh, đảm bảo tươi sạch, bền vững và đạt chứng nhận quốc tế."
        />
        <meta name="keywords" content="Eco Bắc Giang, nông sản hữu cơ, nông trại thông minh, nông sản sạch, Bắc Giang, nông nghiệp bền vững" />
        <meta name="author" content="Eco Bắc Giang" />
        <meta property="og:title" content="Nông Sản Hữu Cơ | Eco Bắc Giang Nông Trại Hữu Cơ Thông Minh" />
        <meta
          property="og:description"
          content="Khám phá bộ sưu tập nông sản hữu cơ từ Eco Bắc Giang, được trồng tại nông trại thông minh, đảm bảo tươi sạch, bền vững và đạt chứng nhận quốc tế."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/digaabr5l/image/upload/v1705450749/ecobacgiang/organic_farm_banner.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:url" content="https://ecobacgiang.com/san-pham" />
        <meta property="og:site_name" content="Eco Bắc Giang Nông Trại Hữu Cơ Thông Minh" />
        <meta property="og:locale" content="vi_VN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Nông Sản Hữu Cơ | Eco Bắc Giang Nông Trại Hữu Cơ Thông Minh" />
        <meta
          name="twitter:description"
          content="Khám phá bộ sưu tập nông sản hữu cơ từ Eco Bắc Giang, được trồng tại nông trại thông minh, đảm bảo tươi sạch, bền vững và đạt chứng nhận quốc tế."
        />
        <meta name="twitter:image" content="https://res.cloudinary.com/digaabr5l/image/upload/v1705450749/ecobacgiang/organic_farm_banner.jpg" />
        <meta name="twitter:site" content="@EcoBacGiang" />
      </Head>
      <div className="h-[80px] bg-white"></div>
      <Products3 />
    </DefaultLayout>
  );
};

export async function getServerSideProps() {
  try {
    const res = await getData("product");
    if (!res || !res.products) {
      console.warn("No products found from API");
      return {
        props: {
          products: [],
          result: 0,
        },
      };
    }
    return {
      props: {
        products: res.products,
        result: res.result || res.products.length,
      },
    };
  } catch (error) {
    console.error("Error fetching products:", error.message);
    return {
      props: {
        products: [],
        result: 0,
      },
    };
  }
}

export default Products;