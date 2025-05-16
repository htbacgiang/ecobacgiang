import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Eye, Trash2 } from 'lucide-react';

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [selectedDate, setSelectedDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20 );

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Lỗi khi lấy danh sách đơn hàng');
        }
        const data = await response.json();
        const fetchedOrders = data.orders || [];
        setOrders(fetchedOrders);
        setFilteredOrders(fetchedOrders);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        setOrders([]);
        setFilteredOrders([]);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Close popup with Esc key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSelectedOrder(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Reusable filter logic
  const filterOrders = (orders, filterType, selectedDate) => {
    if (selectedDate) {
      const filterDate = new Date(selectedDate);
      return orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getDate() === filterDate.getDate() &&
          orderDate.getMonth() === filterDate.getMonth() &&
          orderDate.getFullYear() === filterDate.getFullYear()
        );
      });
    }

    const now = new Date();
    if (filterType === 'all') return orders;

    if (filterType === 'day') {
      return orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getDate() === now.getDate() &&
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (filterType === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay() + 1);
      startOfWeek.setHours(0, 0, 0, 0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      return orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= startOfWeek && orderDate <= endOfWeek;
      });
    } else if (filterType === 'month') {
      return orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getMonth() === now.getMonth() &&
          orderDate.getFullYear() === now.getFullYear()
        );
      });
    } else if (filterType === 'year') {
      return orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return orderDate.getFullYear() === now.getFullYear();
      });
    }
    return orders;
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const filter = e.target.value;
    setFilterType(filter);
    setSelectedDate(''); // Reset selected date when filter type changes
    setCurrentPage(1);
    let filtered = filterOrders(orders, filter, '');
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.phone.includes(searchQuery)
      );
    }
    setFilteredOrders(filtered);
  };

  // Handle date change
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setFilterType(''); // Reset filter type when a date is selected
    setCurrentPage(1);
    let filtered = filterOrders(orders, '', date);
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.phone.includes(searchQuery)
      );
    }
    setFilteredOrders(filtered);
  };

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = filterOrders(orders, filterType, selectedDate).filter(
      (order) =>
        order.id.toLowerCase().includes(query.toLowerCase()) ||
        order.name.toLowerCase().includes(query.toLowerCase()) ||
        order.phone.includes(query)
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  // Handle delete
  const handleDelete = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) return;
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Lỗi khi xóa đơn hàng');
      const updatedOrders = orders.filter((order) => order.id !== orderId);
      setOrders(updatedOrders);
      setFilteredOrders(filterOrders(updatedOrders, filterType, selectedDate));
      setCurrentPage(1);
    } catch (error) {
      console.error('Lỗi khi xóa đơn hàng:', error);
      setError(error.message);
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      pending: 'bg-yellow-500 text-white',
      paid: 'bg-green-500 text-white',
      cancelled: 'bg-red-500 text-white',
      shipped: 'bg-blue-500 text-white',
      default: 'bg-gray-500 text-white',
    };
    return statusMap[status.toLowerCase()] || statusMap.default;
  };

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
    return (
      <div className="p-4">
        {[...Array(itemsPerPage)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 animate-pulse mb-2 rounded"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        Lỗi: {error}
        <button
          onClick={() => fetchOrders()}
          className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-slate-900 shadow rounded-lg mt-6">
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label className="mr-2 text-sm">Hiển thị</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span className="ml-2 text-sm">Đơn hàng</span>
          </div>
          <div className="flex items-center">
            <label className="mr-2 text-sm">Lọc theo:</label>
            <select
              value={filterType}
              onChange={handleFilterChange}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">Tất cả</option>
              <option value="day">Ngày</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>
          <div className="flex items-center">
            <label className="mr-2 text-sm">Chọn ngày:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
        <div>
          <input
            type="text"
            placeholder="Tìm kiếm ID, tên, số điện thoại..."
            value={searchQuery}
            onChange={handleSearch}
            className="border rounded px-2 py-1 text-sm w-64"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          {selectedDate
            ? 'Chưa có đơn hàng trong ngày đã chọn.'
            : filterType === 'day'
            ? 'Chưa có người đặt hàng hôm nay.'
            : 'Không có đơn hàng nào phù hợp với bộ lọc.'}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left" aria-label="Danh sách đơn hàng">
              <thead className="bg-gray-100 dark:bg-slate-700">
                <tr>
                  <th className="p-2">ID</th>
                  <th className="p-2">Ngày Đặt</th>
                  <th className="p-2">Khách hàng</th>
                  <th className="p-2">Số Điện Thoại</th>
                  <th className="p-2">Địa Chỉ</th>
                  <th className="p-2">Tổng Tiền</th>
                  <th className="p-2">Thanh Toán</th>
                  <th className="p-2">Trạng Thái</th>
                  <th className="p-2">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((order) => (
                  <tr key={order.id} className="border-b dark:border-slate-700">
                    <td className="p-2">{order.id.slice(-6)}</td>
                    <td className="p-2">
                      {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="p-2">{order.name}</td>
                    <td className="p-2 text-gray-500 dark:text-gray-400">{order.phone}</td>
                    <td className="p-2">{order.shippingAddress.address}</td>
                    <td className="p-2">{formatVND(order.finalTotal)}</td>
                    <td className="p-2">{order.paymentMethod}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center mt-4">
            <div>
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-200 rounded disabled:bg-gray-400"
              >
                Trước
              </button>
              <span className="mx-2">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-200 rounded disabled:bg-gray-400"
              >
                Sau
              </button>
            </div>
            <span className="text-sm">
              Tổng số: {filteredOrders.length} đơn hàng
            </span>
          </div>
        </>
      )}

      {/* Popup for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-2">Chi tiết đơn hàng</h2>
            {selectedOrder.orderItems.map((item, index) => (
              <div key={index} className="flex items-center mb-2 border-b pb-2">
                <div className="relative w-10 h-10">
                  <Image
                    src={item.image}
                    alt={item.title}
                    layout="fill"
                    objectFit="cover"
                    className="mr-2"
                  />
                </div>
                <div>
                  <p>{item.title}</p>
                  <p>Số lượng: {item.quantity}</p>
                  <p>{formatVND(item.price)}</p>
                </div>
              </div>
            ))}
            <button
              onClick={() => setSelectedOrder(null)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}