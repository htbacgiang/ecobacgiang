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
    return (
      <div className="loading-container">
        <div className="loading-skeleton"></div>
        <div className="loading-skeleton"></div>
        <div className="loading-skeleton"></div>
        <div className="loading-skeleton"></div>
        <div className="loading-skeleton"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div>Lỗi: {error}</div>
        <button onClick={() => window.location.reload()}>
          Thử lại
        </button>
      </div>
    );
  }

  if (!topProducts.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🏆</div>
        <div className="empty-state-title">Không có sản phẩm</div>
        <div className="empty-state-description">
          Chưa có sản phẩm nào được bán để hiển thị trong danh sách bán chạy.
        </div>
      </div>
    );
  }

  return (
    <div className="top-products-container">
      <div className="top-products-header">
        <div className="top-products-title">
          🏆 Top 10 Sản Phẩm Bán Chạy Nhất
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="top-products-table">
          <thead>
            <tr>
              <th>Tên Sản Phẩm</th>
              <th>Mã Sản Phẩm</th>
              <th>Giá</th>
              <th>Số Lượng Đã Bán</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product, index) => (
              <tr key={index}>
                <td>
                  <div className="product-info">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={50}
                      height={50}
                      className="product-image"
                    />
                    <div className="product-details">
                      <div className="product-name">{product.title}</div>
                      <div className="product-code">#{product.productCode.slice(-3)}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="product-code">#{product.productCode.slice(-6)}</span>
                </td>
                <td>
                  <span className="product-price">{formatVND(product.price)}</span>
                </td>
                <td>
                  <span className="product-quantity">{product.quantity}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}