import React, { FC } from "react";
import styles from "../../styles/posts.module.css";

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
    <div className={styles.paginationContainer}>
      {/* Nút Trước */}
      <button
        className={styles.paginationButton}
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        ←
      </button>

      {/* Các nút số trang */}
      {getPaginationGroup().map((page, index) => (
        <button
          key={index}
          className={`${styles.paginationButton} ${
            currentPage === page
              ? styles.active
              : ""
          }`}
          onClick={() => handlePageChange(page)}
          disabled={page === "..."}
        >
          {page}
        </button>
      ))}

      {/* Nút Tiếp */}
      <button
        className={styles.paginationButton}
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        →
      </button>
    </div>
  );
};

export default Pagination;
