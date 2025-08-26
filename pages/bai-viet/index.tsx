import { useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { trimText } from "../../utils/helper";

import DefaultLayout from "../../components/layout/DefaultLayout";
import PaginatedPosts from "../../components/common/PaginatedPosts";
import MainCategories from "../../components/common/MainCategories";

import { formatPosts, readPostsFromDb } from "../../lib/utils";
import { PostDetail } from "../../utils/types";

type MetaData = {
  title: string;
  description: string;
  keywords: string;
  author: string;
  robots: string;
  canonical: string;
  og: {
    title: string;
    description: string;
    type: string;
    image: string;
    imageWidth: string;
    imageHeight: string;
    url: string;
    siteName: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
};

type Props = {
  posts: PostDetail[];
  meta: MetaData;
};

const Blogs: NextPage<Props> = ({ posts, meta }) => {
  const [filteredPosts, setFilteredPosts] = useState<PostDetail[]>(posts);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const postsPerPage = 5;

  const formatDate = (date: string): string =>
    new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category);
    if (category) {
      setFilteredPosts(posts.filter((post) => post.category === category));
    } else {
      setFilteredPosts(posts);
    }
  };

  const featuredPosts = filteredPosts.slice(0, 4);
  const recentPosts = filteredPosts.slice(4);

  return (
    <DefaultLayout>
      <div className="h-[80px] bg-white"></div>
      <div className="pb-12">
        <div className="flex flex-col gap-4 justify-center w-full ">
          {/* Breadcrumb */}
          <div className="flex gap-2 px-4 lg:px-12 uppercase">
            <Link href="/">Trang chủ</Link>
            <span>•</span>
            <Link href="/bai-viet" className="text-green-800 uppercase">
              Bài viết & Chia Sẻ
            </Link>
          </div>

          {/* Featured Posts */}
          <div className="flex flex-col lg:flex-row gap-6 justify-between px-4 lg:px-12">
            {/* Main Featured */}
            {featuredPosts[0]?.thumbnail && (
              <div className="w-full lg:w-8/12 flex flex-col gap-2">
                <Link href={`/bai-viet/${featuredPosts[0].slug}`}>
                  <div className="aspect-video relative cursor-pointer rounded shadow-sm shadow-secondary-dark overflow-hidden">
                    <Image
                      src={featuredPosts[0].thumbnail!}
                      layout="fill"
                      className="object-cover hover:scale-105 transition-all ease duration-300"
                      alt={featuredPosts[0].title}
                    />
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/bai-viet/${featuredPosts[0].slug}`}
                    className="text-green-800 lg:text-lg uppercase font-semibold"
                  >
                    {featuredPosts[0].title}
                  </Link>

                </div>
                <p className="text-base font-medium line-clamp-2">
                  {trimText(featuredPosts[0].meta, 160)}
                </p>
              </div>
            )}

            {/* Secondary Featured */}
            <div className="w-full lg:w-6/12 flex flex-col gap-4">
              {featuredPosts.slice(1, 4).map((post, idx) => (
                post.thumbnail && (
                  <div key={idx} className="flex justify-between gap-4 h-auto lg:h-1/3">
                    <Link href={`/bai-viet/${post.slug}`} className="w-1/3 aspect-video relative cursor-pointer rounded shadow-sm shadow-secondary-dark overflow-hidden">
                      <Image
                        src={post.thumbnail!}
                        layout="fill"
                        className="object-cover hover:scale-105 transition-all ease duration-300"
                        alt={post.title}
                      />
                    </Link>
                    <div className="w-2/3 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-sm lg:text-base mb-1">
                        <Link href={`/bai-viet/${post.slug}`} className="text-green-800 uppercase font-semibold">
                          {post.title}
                        </Link>
                      </div>
                      <p className="text-base font-medium line-clamp-2">
                        {trimText(post.meta, 100)}
                      </p>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Main Categories */}
          <MainCategories onCategorySelect={handleCategorySelect} />

          {/* Recent Posts */}
          <div className="my-2 px-4 lg:px-12">
            <PaginatedPosts
              posts={recentPosts}
              postsPerPage={postsPerPage}
            />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  try {
    const limit = 9;
    const posts = await readPostsFromDb(limit, 0);
    const formattedPosts = formatPosts(posts);

    const meta: MetaData = {
      title: "Tin tức & Chia sẻ Nông nghiệp Hữu cơ - IoT AI và Robot từ Eco Bắc Giang",
      description: "Khám phá tin tức, kiến thức và chia sẻ về nông nghiệp hữu cơ, công nghệ IoT và sản xuất bền vững từ Eco Bắc Giang.",
      keywords: "Eco Bắc Giang, nông nghiệp hữu cơ, nông nghiệp thông minh, IoT nông nghiệp, sản xuất bền vững",
      author: "Eco Bắc Giang",
      robots: "index, follow",
      canonical: "https://ecobacgiang.vn/bai-viet",
      og: {
        title: "Eco Bắc Giang - Tin tức & Kiến thức Nông nghiệp Hữu cơ",
        description: "Khám phá tin tức, kiến thức và chia sẻ về nông nghiệp hữu cơ, công nghệ IoT và sản xuất bền vững.",
        type: "website",
        image: "https://ecobacgiang.vn//baner.webp",
        imageWidth: "1200",
        imageHeight: "630",
        url: "https://ecobacgiang.vn/bai-viet",
        siteName: "Eco Bắc Giang",
      },
      twitter: {
        card: "summary_large_image",
        title: "Eco Bắc Giang - Tin tức & Kiến thức Nông nghiệp Hữu cơ",
        description: "Khám phá tin tức, kiến thức và chia sẻ về nông nghiệp hữu cơ, công nghệ IoT và sản xuất bền vững.",
        image: "https://ecobacgiang.vn//baner.webp",
      },
    };

    return {
      props: {
        posts: formattedPosts,
        meta,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

export default Blogs;
