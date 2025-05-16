"use client";
import React, { useState, useEffect } from "react";

export default function CustomDataTable() {
  const PAGE_SIZE = 5; // Match API default limit
  const [currentPage, setCurrentPage] = useState(0); // API uses 0-based pageNo
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [users, setUsers] = useState([]); // State for API data
  const [total, setTotal] = useState(0); // Total number of users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch user data from /api/user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/user?pageNo=${currentPage}&limit=${PAGE_SIZE}`);
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();

        // Ensure users is an array
        if (!data || !Array.isArray(data.users)) {
          throw new Error("Invalid data format from API");
        }

        setUsers(data.users);
        setTotal(data.total || data.users.length); // Use total if available, else fallback
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]); // Refetch when currentPage changes

  // Pagination calculations
  const numberOfPages = Math.ceil(total / PAGE_SIZE);
  const itemStartIndex = currentPage * PAGE_SIZE + 1;
  const itemEndIndex = Math.min((currentPage + 1) * PAGE_SIZE, total);

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 0 && page < numberOfPages) {
      setCurrentPage(page);
    }
  };

  // Handle checkbox selection
  const handleSelectRow = (id) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(id)) {
      newSelectedRows.delete(id);
    } else {
      newSelectedRows.add(id);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allIds = users.map((item) => item.id);
      setSelectedRows(new Set(allIds));
    } else {
      setSelectedRows(new Set());
    }
  };

  // Render loading state
  if (loading) {
    return <div className="text-center p-4">Đang tải dữ liệu...</div>;
  }

  // Render error state
  if (error) {
    return <div className="text-center p-4 text-red-600">Lỗi: {error}</div>;
  }

  // Render empty state
  if (users.length === 0) {
    return <div className="text-center p-4">Không có dữ liệu người dùng</div>;
  }

  return (
    <div className="">
      <h3 className="mb-4 text-green-800 dark:text-slate-50 font-bold">
        Danh sách khách hàng của Eco Bắc Giang
      </h3>

      {/* Table */}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
            
              <th scope="col" className="px-6 py-3">
                STT
              </th>
              <th scope="col" className="px-6 py-3">
                Tên
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3">
                Số điện thoại
              </th>
            
              <th scope="col" className="px-6 py-3">
                Giới tính
              </th>
              <th scope="col" className="px-6 py-3">
                Địa chỉ
              </th>
           
            </tr>
          </thead>
          <tbody>
            {users.map((item, index) => (
              <tr
                key={item.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
               
                <td className="px-6 py-4">{currentPage * PAGE_SIZE + index + 1}</td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {item.name}
                </th>
                <td className="px-6 py-4">{item.email}</td>
                <td className="px-6 py-4">{item.phone || "Chưa cung cấp"}</td>
                <td className="px-6 py-4">{item.gender || "Chưa cung cấp"}</td>
                <td className="px-6 py-4">
                  {item.address && item.address.length > 0
                    ? (() => {
                        const addr = item.address.find((addr) => addr.isDefault) || item.address[0];
                        return `${addr.address1}, ${addr.wardName}, ${addr.districtName}, ${addr.cityName}`;
                      })()
                    : "Chưa cập nhật"}
                </td>
             
              </tr>
            ))}
          </tbody>
        </table>
        <nav
          className="flex items-center flex-column flex-wrap md:flex-row justify-between p-4"
          aria-label="Table navigation"
        >
          <span className="text-slate-800 dark:text-slate-50 text-sm font-normal mb-4 md:mb-0 block w-full md:inline md:w-auto">
            Hiện thị{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-50">
              {itemStartIndex}-{itemEndIndex}
            </span>{" "}
            của{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-50">
              {total}
            </span>
          </span>
          <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Lùi
              </button>
            </li>
            {Array.from({ length: numberOfPages }, (_, index) => (
              <li key={index}>
                <button
                  onClick={() => handlePageChange(index)}
                  disabled={currentPage === index}
                  className={
                    currentPage === index
                      ? "flex items-center justify-center px-3 h-8 leading-tight text-gray-50 bg-blue-600 border border-blue-300 hover:bg-blue-800 hover:text-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                      : "flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  }
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === numberOfPages - 1}
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Tiếp
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}