import React, { FC } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const getPaginationGroup = () => {
    const delta = 2; // Số trang hiển thị xung quanh trang hiện tại
    const range = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      range.unshift("...");
    }

    if (currentPage + delta < totalPages - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    return range;
  };

  const handlePageChange = (page: number | string) => {
    if (typeof page === "number" && page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      {/* Nút Trước */}
      <button
        className={`px-3 py-1 border rounded ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`}
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        &lt;
      </button>

      {/* Các nút số trang */}
      {getPaginationGroup().map((page, index) => (
        <button
          key={index}
          className={`px-3 py-1 border rounded ${
            currentPage === page
              ? "bg-blue-500 text-white"
              : page === "..."
              ? "text-gray-400 cursor-default"
              : "hover:bg-gray-200"
          }`}
          onClick={() => handlePageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Nút Tiếp */}
      <button
        className={`px-3 py-1 border rounded ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "hover:bg-gray-200"}`}
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
