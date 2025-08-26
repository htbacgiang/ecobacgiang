import React from "react";

interface PaginationProps {
  currentPage: number;              // Trang hiện tại
  totalPages: number;              // Tổng số trang
  onPageChange: (page: number) => void; // Hàm xử lý khi đổi trang
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  // Số trang tối đa hiển thị (không tính trang đầu/cuối)
  const maxVisiblePages = 5;

  // Tạo mảng các trang để hiển thị
  const getPageNumbers = () => {
    // Ví dụ: currentPage=6 => startPage=4 => hiển thị [4,5,6,7,8]
    let startPage = Math.max(currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = startPage + maxVisiblePages - 1;

    // Nếu endPage vượt quá totalPages, ta lùi lại
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(totalPages - maxVisiblePages + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pages = getPageNumbers();

  // Hàm chuyển trang
  const handleClick = (page: number) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Nút Previous */}
      <button
        onClick={() => handleClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
      >
        &lt;
      </button>

      {/* Nếu trang đầu tiên hiển thị > 1 thì hiển thị nút 1 và ... */}
      {pages[0] > 1 && (
        <>
          <button
            onClick={() => handleClick(1)}
            className={`px-3 py-1 rounded hover:bg-gray-200 ${
              currentPage === 1 ? "bg-blue-500 text-white" : ""
            }`}
          >
            1
          </button>
          {pages[0] > 2 && <span className="mx-1">...</span>}
        </>
      )}

      {/* Nút các trang */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handleClick(page)}
          className={`px-3 py-1 rounded hover:bg-gray-200 ${
            currentPage === page ? "bg-blue-500 text-white" : ""
          }`}
        >
          {page}
        </button>
      ))}

      {/* Nếu trang cuối cùng hiển thị < tổng trang => hiển thị ... và nút cuối */}
      {pages[pages.length - 1] < totalPages && (
        <>
          {pages[pages.length - 1] < totalPages - 1 && (
            <span className="mx-1">...</span>
          )}
          <button
            onClick={() => handleClick(totalPages)}
            className={`px-3 py-1 rounded hover:bg-gray-200 ${
              currentPage === totalPages ? "bg-blue-500 text-white" : ""
            }`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Nút Next */}
      <button
        onClick={() => handleClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded disabled:opacity-50 hover:bg-gray-200"
      >
        &gt;
      </button>
    </div>
  );
}
