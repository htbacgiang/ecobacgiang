// pages/index.js

import Image from "next/image";
import Head from "next/head";
import DefaultLayout from "../components/layout/DefaultLayout";
import SubscribeSection from "../components/about/SubscribeSection";
import AboutUsSection from "../components/about/AboutUsSection";
import OrganicProcess from "../components/about/OrganicProcess";
import Product3 from "../components/product/Products3";
import PostCard from "../components/common/PostCard";
import { readPostsFromDb, formatPosts } from "../lib/utils";
import CarouselComponent from "../components/ecobacgiang/CarouselComponent";
import DealsSection from "../components/ecobacgiang/DealsSection";
import FeaturedProducts from "../components/ecobacgiang/FeaturedProducts";
import HeroSectionBlog from "../components/ecobacgiang/HeroSectionBlog";
import VideoHero from "../components/univisport/VideoHero";
import PromoBanner from "../components/ecobacgiang/PromoBanner";
import BannerSale from "../components/ecobacgiang/BannerSale";
import MonthlySales from "../components/ecobacgiang/MonthlySales";

DealsSection
// Helper chuyển path Cloudinary
const toCloudinaryUrl = (relativePath) => {
  if (!relativePath || typeof relativePath !== "string") {
    return "/images/placeholder.jpg";
  }
  if (relativePath.includes("/image/upload/")) {
    const parts = relativePath.split("/");
    const vIdx = parts.findIndex((p) => p.startsWith("v") && !isNaN(p.slice(1)));
    if (vIdx !== -1) {
      const clean = parts.slice(vIdx + 1).join("/");
      return `https://res.cloudinary.com/dcgtt1jza/image/upload/v1/${clean}`;
    }
  }
  const clean = relativePath.startsWith("/") ? relativePath.slice(1) : relativePath;
  return `https://res.cloudinary.com/dcgtt1jza/image/upload/v1/${clean}`;
};

export default function Home({ posts, meta }) {
  // JSON-LD Schema.org cho Eco Bắc Giang
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Eco Bắc Giang",
    url: "https://ecobacgiang.vn",
    logo: "https://ecobacgiang.vn/logo.png",
    sameAs: [
      "https://www.facebook.com/ecobacgiang",
      "https://www.linkedin.com/company/ecobacgiang",
    ],
    description:
      "Eco Bắc Giang – thương hiệu dẫn đầu về nông nghiệp thông minh và sản xuất hữu cơ bền vững tại Việt Nam, hướng tới Net Zero 2050.",
  };

  return (
    <DefaultLayout meta={meta}>
      <Head>
        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <h1 className="hidden">
        Eco Bắc Giang - Nông nghiệp hữu cơ - Ứng dụng IT, AI và Robot trong nông nghiệp
      </h1>
      <CarouselComponent />
      <FeaturedProducts />
      <PromoBanner />
      <MonthlySales />
      <BannerSale />
      <Product3 />
      <VideoHero />
      <OrganicProcess />
      <AboutUsSection />
      <HeroSectionBlog />
      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-2 pb-6">
          {posts.slice(0, 8).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>

      <SubscribeSection />
    </DefaultLayout>
  );
}

export async function getServerSideProps() {
  // Lấy bài viết và format
  const raw = await readPostsFromDb(8, 0);
  const posts = formatPosts(raw);

  // SEO meta cho Eco Bắc Giang
  const meta = {
    title: "Eco Bắc Giang – Nông nghiệp thông minh & sản xuất hữu cơ bền vững",
    description:
      "Eco Bắc Giang ứng dụng công nghệ IoT, tự động hóa và giải pháp xanh để phát triển nông nghiệp hữu cơ chất lượng cao, hướng tới Net Zero 2050.",
    keywords:
      "Eco Bắc Giang, nông nghiệp thông minh, hữu cơ, bền vững, IoT, tự động hóa, Net Zero 2050",
    robots: "index, follow",
    author: "Eco Bắc Giang",
    canonical: "https://ecobacgiang.vn",
    og: {
      title: "Eco Bắc Giang – Nông nghiệp thông minh & hữu cơ bền vững",
      description:
        "Eco Bắc Giang ứng dụng công nghệ cao để sản xuất nông sản hữu cơ đạt chuẩn, hướng tới phát triển bền vững.",
      type: "website",
      image: "https://ecobacgiang.vn/baner.webp",
      imageWidth: "1200",
      imageHeight: "630",
      url: "https://ecobacgiang.vn",
    },
    twitter: {
      card: "summary_large_image",
      title: "Eco Bắc Giang – Nông nghiệp thông minh & hữu cơ bền vững",
      description:
        "Thương hiệu Eco Bắc Giang dẫn đầu về nông nghiệp hữu cơ và công nghệ xanh tại Việt Nam.",
      image: "https://ecobacgiang.vn/baner.webp",
    },
  };

  return {
    props: { posts, meta },
  };
}
