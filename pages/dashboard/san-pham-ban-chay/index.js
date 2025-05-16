import React, { useEffect, useState } from 'react';
import AdminLayout from '../../../components/layout/AdminLayout';
import BestSellers from '../../../components/ecobacgiang/BestSellers';

export default function Index() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await fetch('/api/orders/bestsellers');
        if (!response.ok) {
          throw new Error('Không thể tải danh sách sản phẩm bán chạy');
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <AdminLayout title="Sản Phẩm Bán Chạy">
      <div className="p-2 bg-white dark:bg-slate-900 text-gray-800 min-h-screen">
        {loading && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 animate-pulse">Đang tải...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-lg text-red-500 bg-red-50 p-4 rounded-lg">
              Lỗi: {error}
            </p>
          </div>
        )}

        {!loading && !error && <BestSellers products={products} />}
      </div>
    </AdminLayout>
  );
}