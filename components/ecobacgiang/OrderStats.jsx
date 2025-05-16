import { useState, useEffect } from 'react';
import { ShoppingCart, XCircle, RefreshCw, CheckCircle } from 'lucide-react';

export default function OrderStats() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Lỗi khi lấy dữ liệu thống kê');
        }
        const data = await response.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu thống kê:', error);
        setOrders([]);
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

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Calculate Today's Revenue
  const todayRevenue = orders
    .filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= today;
    })
    .reduce((sum, order) => sum + order.finalTotal, 0);

  // Calculate Yesterday's Revenue
  const yesterdayRevenue = orders
    .filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= yesterday && orderDate < today;
    })
    .reduce((sum, order) => sum + order.finalTotal, 0);

  // Calculate This Month's Revenue
  const thisMonthRevenue = orders
    .filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startOfMonth;
    })
    .reduce((sum, order) => sum + order.finalTotal, 0);

  // Calculate This Year's Revenue
  const thisYearRevenue = orders
    .filter((order) => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startOfYear;
    })
    .reduce((sum, order) => sum + order.finalTotal, 0);

  // Calculate Today's Orders
  const todayOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= today;
  }).length;

  // Calculate Today's Canceled Orders
  const todayCanceledOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= today && order.status.toLowerCase() === 'canceled';
  }).length;

  // Calculate This Month's Orders
  const thisMonthOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= startOfMonth;
  }).length;

  // Calculate This Month's Canceled Orders
  const thisMonthCanceledOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= startOfMonth && order.status.toLowerCase() === 'canceled';
  }).length;

  if (loading) {
    return <div>Đang tải thống kê...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div className="mb-6">
      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-green-500 text-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">Doanh thu hôm nay</h3>
            <div className="opacity-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </div>
          </div>
          <p className="text-xl font-bold">{formatVND(todayRevenue)}</p>
        </div>
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">Doanh thu hôm qua</h3>
            <div className="opacity-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </div>
          </div>
          <p className="text-xl font-bold">{formatVND(yesterdayRevenue)}</p>
        </div>
        <div className="bg-orange-500 text-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">Tháng này</h3>
            <div className="opacity-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </div>
          </div>
          <p className="text-xl font-bold">{formatVND(thisMonthRevenue)}</p>
        </div>
        <div className="bg-purple-500 text-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold">Cả năm</h3>
            <div className="opacity-50">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="2" />
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
            </div>
          </div>
          <p className="text-xl font-bold">{formatVND(thisYearRevenue)}</p>
        </div>
      </div>

      {/* Order Count Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow flex items-center">
          <div className="bg-green-500 text-white rounded-full p-2 mr-3">
            <ShoppingCart size={24} />
          </div>
          <div>
            <p className="text-sm">Đơn hàng hôm nay</p>
            <p className="text-lg font-bold">{todayOrders}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow flex items-center">
          <div className="bg-red-500 text-white rounded-full p-2 mr-3">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-sm">Đơn hủy hôm nay</p>
            <p className="text-lg font-bold">{todayCanceledOrders}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow flex items-center">
          <div className="bg-orange-500 text-white rounded-full p-2 mr-3">
            <RefreshCw size={24} />
          </div>
          <div>
            <p className="text-sm">Đơn hàng tháng này</p>
            <p className="text-lg font-bold">{thisMonthOrders}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow flex items-center">
          <div className="bg-purple-500 text-white rounded-full p-2 mr-3">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm">Đơn hủy tháng này</p>
            <p className="text-lg font-bold">{thisMonthCanceledOrders}</p>
          </div>
        </div>
      </div>
    </div>
  );
}