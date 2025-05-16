import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Eye, Trash2 } from 'lucide-react';

export default function TopCustomers() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch orders and aggregate by customer
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Lỗi khi lấy danh sách đơn hàng');
        const data = await response.json();
        const orders = data.orders || [];

        // Aggregate orders by customer
        const customerMap = {};
        orders.forEach((order) => {
          const customerId = order.customerId || order.name; // Use customerId if available, else name
          if (!customerMap[customerId]) {
            customerMap[customerId] = {
              id: customerId,
              name: order.name,
              phone: order.phone,
              address: order.shippingAddress.address,
              totalOrders: 0,
              totalSpent: 0,
              orders: [],
            };
          }
          customerMap[customerId].totalOrders += 1;
          customerMap[customerId].totalSpent += order.finalTotal;
          customerMap[customerId].orders.push(order);
        });

        const customerList = Object.values(customerMap).sort(
          (a, b) => b.totalOrders - a.totalOrders
        );
        setCustomers(customerList);
        setFilteredCustomers(customerList);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', error);
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
      if (e.key === 'Escape') setSelectedCustomer(null);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  // Reusable filter logic
  const filterCustomers = (customers, filterType) => {
    if (filterType === 'all') return customers;

    const now = new Date();
    const filtered = customers.map((customer) => {
      let filteredOrders = [];
      if (filterType === 'day') {
        filteredOrders = customer.orders.filter((order) => {
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

        filteredOrders = customer.orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= startOfWeek && orderDate <= endOfWeek;
        });
      } else if (filterType === 'month') {
        filteredOrders = customer.orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return (
            orderDate.getMonth() === now.getbasMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        });
      } else if (filterType === 'year') {
        filteredOrders = customer.orders.filter((order) => {
          const orderDate = new Date(order.createdAt);
          return orderDate.getFullYear() === now.getFullYear();
        });
      }

      return {
        ...customer,
        totalOrders: filteredOrders.length,
        totalSpent: filteredOrders.reduce((sum, order) => sum + order.finalTotal, 0),
        orders: filteredOrders,
      };
    });

    return filtered
      .filter((customer) => customer.totalOrders > 0)
      .sort((a, b) => b.totalOrders - a.totalOrders);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const filter = e.target.value;
    setFilterType(filter);
    setCurrentPage(1);
    let filtered = filterCustomers(customers, filter);
    if (searchQuery) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone.includes(searchQuery) ||
          customer.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredCustomers(filtered);
  };

  // Handle search
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = filterCustomers(customers, filterType).filter(
      (customer) =>
        customer.name.toLowerCase().includes(query.toLowerCase()) ||
        customer.phone.includes(query) ||
        customer.address.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCustomers(filtered);
    setCurrentPage(1);
  };

  // Handle delete customer (remove all their orders)
  const handleDelete = async (customerId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tất cả đơn hàng của khách hàng này?')) return;
    try {
      const response = await fetch(`/api/orders?customerId=${customerId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Lỗi khi xóa đơn hàng của khách hàng');
      const updatedCustomers = customers.filter((customer) => customer.id !== customerId);
      setCustomers(updatedCustomers);
      setFilteredCustomers(filterCustomers(updatedCustomers, filterType));
      setCurrentPage(1);
    } catch (error) {
      console.error('Lỗi khi xóa đơn hàng:', error);
      setError(error.message);
    }
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
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

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
            <span className="ml-2 text-sm">Khách hàng</span>
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
        </div>
        <div>
          <input
            type="text"
            placeholder="Tìm kiếm tên, số điện thoại, địa chỉ..."
            value={searchQuery}
            onChange={handleSearch}
            className="border rounded px-2 py-1 text-sm w-64"
          />
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          {filterType === 'day'
            ? 'Chưa có người đặt hàng hôm nay.'
            : 'Không có khách hàng nào phù hợp với bộ lọc.'}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left" aria-label="Danh sách khách hàng đặt hàng nhiều nhất">
              <thead className="bg-gray-100 dark:bg-slate-700">
                <tr>
                  <th className="p-2">STT</th>
                  <th className="p-2">Tên Khách Hàng</th>
                  <th className="p-2">Số Điện Thoại</th>
                  <th className="p-2">Địa Chỉ</th>
                  <th className="p-2">Tổng Đơn Hàng</th>
                  <th className="p-2">Tổng Chi Tiêu</th>
                  <th className="p-2">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((customer, index) => (
                  <tr key={customer.id} className="border-b dark:border-slate-700">
                    <td className="p-2">{indexOfFirstItem + index + 1}</td>
                    <td className="p-2">{customer.name}</td>
                    <td className="p-2 text-gray-500 dark:text-gray-400">{customer.phone}</td>
                    <td className="p-2">{customer.address}</td>
                    <td className="p-2">{customer.totalOrders}</td>
                    <td className="p-2">{formatVND(customer.totalSpent)}</td>
                    <td className="p-2 flex space-x-2">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Xem chi tiết đơn hàng"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Xóa khách hàng"
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
          <div className="flex justify W-between items-center mt-4">
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
              Tổng số: {filteredCustomers.length} khách hàng
            </span>
          </div>
        </>
      )}

      {/* Popup for Customer Order Details */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-2">Chi tiết đơn hàng của {selectedCustomer.name}</h2>
            {selectedCustomer.orders.map((order, index) => (
              <div key={order.id} className="mb-4 border-b pb-2">
                <p className="font-semibold">Đơn hàng #{order.id.slice(-6)}</p>
                <p>Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                <p>Tổng tiền: {formatVND(order.finalTotal)}</p>
                <p>Trạng thái: {order.status}</p>
                <div className="mt-2">
                  {order.orderItems.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center mb-2">
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
                </div>
              </div>
            ))}
            <button
              onClick={() => setSelectedCustomer(null)}
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