import React, { FC, useState } from "react";
import { PostDetail } from "../../utils/types";
import PostCard from "./PostCard";

interface Props {
  posts: PostDetail[]; // Danh sách bài viết
  postsPerPage: number; // Số bài viết mỗi trang
}

const PaginatedPosts: FC<Props> = ({ posts, postsPerPage }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(posts.length / postsPerPage);
  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationControls = () => {
    const delta = 2;
    const range: (number | string)[] = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) range.unshift("...");
    if (currentPage + delta < totalPages - 1) range.push("...");
    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    return (
      <div className="flex items-center justify-center mt-4 space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 border rounded ${
            currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
          }`}
        >
          &lt;
        </button>
        {range.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 border rounded ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          ) : (
            <span key={index} className="px-3 py-1 text-gray-400">
              {page}
            </span>
          )
        )}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 border rounded ${
            currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"
          }`}
        >
          &gt;
        </button>
      </div>
    );
  };

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentPosts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      {renderPaginationControls()}
    </div>
  );
};

export default PaginatedPosts;
