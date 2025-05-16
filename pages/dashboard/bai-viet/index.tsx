import axios from "axios";
import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from "next";
import { useState } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";
import PostCard from "../../../components/common/PostCard";
import Pagination from "../../../components/common/Pagination";
import { formatPosts, readPostsFromDb } from "../../../lib/utils";
import { PostDetail } from "../../../utils/types";
import Post from "../../../models/Post";
import db from "../../../utils/db";
import { _id } from "@next-auth/mongodb-adapter";

const limit = 9; // Số bài viết mỗi trang

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Posts: NextPage<Props> = ({ initialPosts, totalPages }) => {
  const [posts, setPosts] = useState<PostDetail[]>(initialPosts);
  const [currentPage, setCurrentPage] = useState(1);

  // Hàm xử lý đổi trang (server-side pagination)
  const handlePageChange = async (page: number) => {
    try {
      setCurrentPage(page);
      const skip = (page - 1) * limit;
      const { data } = await axios.get(`/api/posts?limit=${limit}&skip=${skip}`);
      setPosts(data.posts);
    } catch (error) {
      console.error(error);
    }
  };

  // Xử lý xoá bài viết theo postId
  const handleDelete = async (postId: string) => {
    try {
      await axios.delete(`/api/posts/${postId}`);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.slug}
            post={post}
            controls
            onDeleteClick={() => handleDelete(post.id)}
            
          />
        ))}
      </div>

      {/* Thanh phân trang */}
      <div className="mt-4 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps<{
  initialPosts: PostDetail[];
  totalPages: number;
}> = async () => {
  try {
    await db.connectDb();

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(0)
      .limit(limit)
      .lean();

    const formattedPosts = formatPosts(posts);

    return {
      props: {
        initialPosts: formattedPosts,
        totalPages,
      },
    };
  } catch (error) {
    console.error(error);
    return { notFound: true };
  }
};

export default Posts;
