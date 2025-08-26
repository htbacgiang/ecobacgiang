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
      <div className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700">
        {/* Thumbnail */}
        <div className="relative h-64 w-full overflow-hidden">
          {!thumbnail ? (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm bg-gray-100 dark:bg-gray-700">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p>Không có hình ảnh</p>
              </div>
            </div>
          ) : (
            <Image
              src={thumbnail}
              layout="fill"
              alt={title}
              objectFit="cover"
              className="group-hover:scale-110 transition-transform duration-500 ease-in-out"
            />
          )}
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col space-y-2">
          {/* Category Tag */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200 cursor-pointer">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
              </svg>
              {category || "Uncategorized"}
            </span>
            
            {/* Date */}
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {new Date(createdAt).toLocaleDateString("vi-VN", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>

          {/* Title */}
          <Link href={`/bai-viet/${slug}`} className="group">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200 line-clamp-2">
              {title.split(" ").map((word, index) =>
                word.toUpperCase() === "YOUR" ? (
                  <span key={index} className="text-yellow-500 dark:text-yellow-400">
                    {word}{" "}
                  </span>
                ) : (
                  word + " "
                )
              )}
            </h2>
          </Link>

          {/* Description */}
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-3">
            {trimText(meta, 120)}
          </p>

          {/* Read More Link */}
          <div className="pt-2">
            <Link 
              href={`/bai-viet/${slug}`}
              className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium text-sm transition-colors duration-200 group"
            >
              Đọc thêm
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </Link>
          </div>

          {/* Controls (Edit/Delete) */}
          {controls && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
              <Link
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                href={`/dashboard/bai-viet/update/${slug}`}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                Sửa
              </Link>
              <button
                disabled={busy}
                onClick={() => setShowModal(true)}
                className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm font-medium transition-colors duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                Xóa
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h2 className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">Xác nhận xóa</h2>
            </div>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
              >
                Hủy
              </button>
              <button
                disabled={busy}
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PostCard;
