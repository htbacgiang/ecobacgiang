import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function TopProducts() {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Lỗi khi lấy dữ liệu sản phẩm');
        }
        const data = await response.json();
        const orders = data.orders || [];

        // Aggregate product quantities
        const productMap = {};

        orders.forEach((order) => {
          order.orderItems.forEach((item) => {
            const productId = item.product;
            if (!productMap[productId]) {
              productMap[productId] = {
                title: item.title,
                productCode: item.product, // Using product ID as the product code
                price: item.price,
                image: item.image,
                quantity: 0,
              };
            }
            productMap[productId].quantity += item.quantity;
          });
        });

        // Convert to array and sort by quantity
        const productList = Object.values(productMap);
        productList.sort((a, b) => b.quantity - a.quantity);

        // Take top 10 products
        setTopProducts(productList.slice(0, 10));
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
        setTopProducts([]);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  if (loading) {
    return <div>Đang tải danh sách sản phẩm...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  if (!topProducts.length) {
    return <div>Không có sản phẩm nào để hiển thị.</div>;
  }

  return (
    <div className="p-4 bg-white dark:bg-slate-900 shadow rounded-lg">
      <h2 className="text-lg font-bold mb-4">Top 10 Sản Phẩm Bán Chạy Nhất</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 dark:bg-slate-700">
            <tr>
              <th className="p-2">Tên</th>
              <th className="p-2">Mã Sản Phẩm</th>
              <th className="p-2">Giá</th>
              <th className="p-2">Số Lượng</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product, index) => (
              <tr key={index} className="border-b dark:border-slate-700">
                <td className="p-2 flex items-center">
                  <Image
                    src={product.image}
                    alt={product.title}
                    width={40}
                    height={40}
                    className="mr-2 rounded"
                  />
                  <span>{product.title}</span>
                </td>
                <td className="p-2">#{product.productCode.slice(-3)}</td>
                <td className="p-2">{formatVND(product.price)}</td>
                <td className="p-2">{product.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}