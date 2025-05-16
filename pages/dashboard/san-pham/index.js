import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import AdminLayout from '../../../components/layout/AdminLayout';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEdit, FaTrash } from 'react-icons/fa';

export default function ProductsListPage() {
  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const tableContainerRef = useRef(null);

  // Hàm chuyển đổi đường dẫn tương đối thành URL Cloudinary
  const toCloudinaryUrl = (relativePath) => {
    if (!relativePath) {
      return '/images/placeholder.jpg';
    }
    const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    return `https://res.cloudinary.com/djbmybqt2/${cleanPath}`;
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/products');
      const products = response.data.products || [];
      console.log('Products from API:', products);
      setAllProducts(products);
      setTotalPages(Math.ceil(products.length / limit));
      setDisplayedProducts(products.slice(0, limit));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Không thể tải danh sách sản phẩm', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    setDisplayedProducts(allProducts.slice(startIndex, endIndex));

    if (tableContainerRef.current) {
      tableContainerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [page, allProducts, limit]);

  const handleDelete = async () => {
    if (!productToDelete) return;

    setLoading(true);
    try {
      await axios.delete(`/api/products?_id=${productToDelete}`);
      toast.success('Sản phẩm đã được xóa thành công', {
        position: 'top-right',
        autoClose: 3000,
      });
      const updatedProducts = allProducts.filter((product) => product._id !== productToDelete);
      setAllProducts(updatedProducts);
      setTotalPages(Math.ceil(updatedProducts.length / limit));
      if (updatedProducts.length > 0 && displayedProducts.length === 1 && page > 1) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Không thể xóa sản phẩm', {
        position: 'top-right',
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setProductToDelete(null);
    }
  };

  const confirmDelete = (id) => {
    setProductToDelete(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductToDelete(null);
  };

  const renderPagination = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    const ellipsis = "...";

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, page - 2);
      let endPage = Math.min(totalPages, page + 2);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push(ellipsis);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push(ellipsis);
        pageNumbers.push(totalPages);
      }
    }

    return (
      <div className="flex justify-center mt-4 space-x-1">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-2 py-1 text-gray-500 disabled:opacity-50"
        >
          Trước
        </button>
        {pageNumbers.map((num, index) => (
          <button
            key={index}
            onClick={() => typeof num === 'number' && setPage(num)}
            disabled={num === ellipsis}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm ${num === page
                ? 'bg-blue-500 text-white'
                : num === ellipsis
                  ? 'text-gray-500 cursor-default'
                  : 'text-black hover:bg-gray-200'
              }`}
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-2 py-1 text-gray-500 disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    );
  };

  return (
    <AdminLayout title="Danh sách sản phẩm">
      <div className="p-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 min-h-screen">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-black dark:text-white">Danh sách sản phẩm</h2>
          <Link href="/dashboard/them-san-pham">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Thêm sản phẩm
            </button>
          </Link>
        </div>

        {loading && allProducts.length === 0 ? (
          <div className="text-center text-black dark:text-white">Đang tải...</div>
        ) : (
          <div ref={tableContainerRef} className="overflow-x-auto">
            <table
              className="w-full border-collapse border border-gray-200"
              role="grid"
              aria-label="Danh sách sản phẩm"
            >
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-700">
                  <th className="px-4 py-2 text-left font-semibold text-black dark:text-white" scope="col">
                    STT
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-black dark:text-white" scope="col">
                    Tên sản phẩm
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-black dark:text-white" scope="col">
                    Ảnh đại diện
                  </th>
                  <th className="px-2 py-2 text-left font-semibold text-black dark:text-white" scope="col">
                    Mã sản phẩm
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-black dark:text-white" scope="col">
                    Danh mục
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-black dark:text-white" scope="col">
                    Giá
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-black dark:text-white" scope="col">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayedProducts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="border p-2 text-center text-black dark:text-white"
                    >
                      Không có sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  displayedProducts.map((product, index) => (
                    <tr
                      key={product._id}
                      className="border-t hover:bg-gray-50 dark:hover:bg-slate-800"
                      role="row"
                    >
                      <td className="px-4 py-2 text-black dark:text-white">{(page - 1) * limit + index + 1}</td>
                      <td className="px-4 py-2">
                        <span className="text-black dark:text-white">{product.name || 'N/A'}</span>
                      </td>
                      <td className="px-4 py-2">
                        <Image
                          src={toCloudinaryUrl(product.image && product.image.length > 0 ? product.image[0] : '')}
                          alt={product.name || 'Sản phẩm'}
                          width={40}
                          height={40}
                          loading="lazy"
                          className="rounded object-cover aspect-square"
                        />
                      </td>
                      <td className="px-4 py-2 text-black dark:text-white">{product.maSanPham || 'N/A'}</td>
                      <td className="px-4 py-2 text-black dark:text-white">
                        {product.categoryNameVN || product.category || 'Không xác định'}
                      </td>
                      <td className="px-4 py-2 text-black dark:text-white">
                        {(typeof product.price === 'number' ? product.price : 0).toLocaleString('vi-VN')} 
                        {product.promotionalPrice > 0 && (
                          <>
                            {' - '}
                            {(typeof product.promotionalPrice === 'number' ? product.promotionalPrice : 0).toLocaleString('vi-VN')}
                          </>
                        )}
                      </td>
                      <td className="px-4 py-2 flex space-x-2">
                        <Link href={`/dashboard/them-san-pham?_id=${product._id}`}>
                          <button
                            className="text-gray-500 hover:text-blue-500 dark:text-gray-300 dark:hover:text-blue-400"
                            aria-label={`Sửa sản phẩm ${product.name || 'Sản phẩm'}`}
                          >
                            <FaEdit />
                          </button>
                        </Link>
                        <button
                          onClick={() => confirmDelete(product._id)}
                          className="text-gray-500 hover:text-red-500 dark:text-gray-300 dark:hover:text-red-400"
                          aria-label={`Xóa sản phẩm ${product.name || 'Sản phẩm'}`}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && renderPagination()}

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 text-black dark:text-white">
                Xác nhận xóa
              </h3>
              <p className="text-black dark:text-white mb-4">
                Bạn có chắc muốn xóa sản phẩm này?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={closeModal}
                  className="bg-gray-300 dark:bg-slate-600 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-slate-500"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  disabled={loading}
                >
                  {loading ? 'Đang xóa...' : 'Xóa'}
                </button>
              </div>
            </div>
          </div>
        )}

        <ToastContainer />
      </div>
    </AdminLayout>
  );
}