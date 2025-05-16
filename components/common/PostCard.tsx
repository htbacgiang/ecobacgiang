import Image from "next/image";
import { FC, useState } from "react";
import { PostDetail as BasePostDetail } from "../../utils/types";
import Link from "next/link";
import { trimText } from "../../utils/helper";

// Mở rộng kiểu dữ liệu PostDetail gốc để thêm các thuộc tính mới
interface ExtendedPostDetail extends BasePostDetail {
  category: string; // Thêm danh mục
  createdAt: string; // Thêm ngày tạo
}

interface Props {
  post: ExtendedPostDetail;
  busy?: boolean;
  controls?: boolean;
  onDeleteClick?(): void;
}

const PostCard: FC<Props> = ({
  controls = false,
  post,
  busy,
  onDeleteClick,
}): JSX.Element => {
  const { title, slug, meta, thumbnail, category, createdAt } = post;
  const [showModal, setShowModal] = useState(false);

  const handleDelete = () => {
    if (onDeleteClick) {
      onDeleteClick();
    }
    setShowModal(false);
  };

  return (
    <>
      <div className="bg-gray-900 rounded-lg overflow-hidden shadow-lg flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-56 w-full">
          {!thumbnail ? (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm bg-gray-800">
              Không có hình ảnh
            </div>
          ) : (
            <Image
              src={thumbnail}
              layout="fill"
              alt={title}
              objectFit="cover"
              className="rounded-t-lg hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          )}
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col space-y-2">
          {/* Category Tag */}
          <span className="category-tag p-2 cursor-pointer text-green-800 text-lg bg-green-500 hover:bg-green-400 hover:text-white">
            {category || "Uncategorized"}
          </span>

          {/* Title */}
          <Link href={`/bai-viet/${slug}`}>
            <h2 className="text-xl font-bold text-white">
              {title.split(" ").map((word, index) =>
                word.toUpperCase() === "YOUR" ? (
                  <span key={index} className="text-yellow-400">
                    {word}{" "}
                  </span>
                ) : (
                  word + " "
                )
              )}
            </h2>
          </Link>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-6">
            {trimText(meta, 100)}
          </p>

          {/* Date */}
          <div className="mt-2 flex items-center text-gray-500 text-sm">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            {new Date(createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>

          {/* Controls (Edit/Delete) */}
          {controls && (
            <div className="mt-4 flex justify-between">
              <Link
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                href={`/dashboard/bai-viet/update/${slug}`}
              >
                Sửa
              </Link>
              <button
                disabled={busy}
                onClick={() => setShowModal(true)}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Xóa
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gray-900 p-6 rounded-md shadow-md">
            <h2 className="text-lg font-semibold text-white mb-4">Xác nhận</h2>
            <p className="mb-6 text-gray-400">
              Bạn có chắc chắn muốn xóa bài viết này?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                disabled={busy}
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
