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
      <div className="loading-container">
        {[...Array(itemsPerPage)].map((_, i) => (
          <div key={i} className="loading-skeleton"></div>
        ))}
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

  return (
    <div className="top-customers-container">
      <div className="order-list-controls">
        <div className="order-list-filters">
          <div className="filter-group">
            <label>Hiển thị</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <span>Khách hàng</span>
          </div>
          <div className="filter-group">
            <label>Lọc theo:</label>
            <select
              value={filterType}
              onChange={handleFilterChange}
            >
              <option value="all">Tất cả</option>
              <option value="day">Ngày</option>
              <option value="week">Tuần</option>
              <option value="month">Tháng</option>
              <option value="year">Năm</option>
            </select>
          </div>
        </div>
        <div className="order-search">
          <input
            type="text"
            placeholder="Tìm kiếm tên, số điện thoại, địa chỉ..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <div className="empty-state-title">Không có khách hàng</div>
          <div className="empty-state-description">
            {filterType === 'day'
              ? 'Chưa có người đặt hàng hôm nay.'
              : 'Không có khách hàng nào phù hợp với bộ lọc.'}
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="top-customers-table" aria-label="Danh sách khách hàng đặt hàng nhiều nhất">
              <thead>
                <tr>
                  <th>Xếp Hạng</th>
                  <th>Tên Khách Hàng</th>
                  <th>Số Điện Thoại</th>
                  <th>Tổng Đơn Hàng</th>
                  <th>Tổng Chi Tiêu</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((customer, index) => (
                  <tr key={customer.id}>
                    <td>
                      <span className="customer-rank">#{indexOfFirstItem + index + 1}</span>
                    </td>
                    <td>
                      <span className="customer-name-cell">{customer.name}</span>
                    </td>
                    <td>
                      <span className="customer-phone-cell">{customer.phone}</span>
                    </td>
                  
                    <td>
                      <span className="customer-orders">{customer.totalOrders}</span>
                    </td>
                    <td>
                      <span className="customer-spent">{formatVND(customer.totalSpent)}</span>
                    </td>
                    <td>
                      <div className="order-actions">
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="action-btn view-btn"
                          aria-label="Xem chi tiết đơn hàng"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="action-btn delete-btn"
                          aria-label="Xóa khách hàng"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="pagination-container">
            <div className="pagination-controls">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                ← Trước
              </button>
              <span className="pagination-info">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Sau →
              </button>
            </div>
            <span className="pagination-count">
              Tổng số: {filteredCustomers.length} khách hàng
            </span>
          </div>
        </>
      )}

      {/* Popup for Customer Order Details */}
      {selectedCustomer && (
        <div 
          className="modalOverlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedCustomer(null);
            }
          }}
        >
          <div className="modalContent">
            <div className="modalHeader">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="modalTitle">Chi tiết đơn hàng của {selectedCustomer.name}</h2>
                  <p className="text-blue-50 mt-1">Tổng {selectedCustomer.totalOrders} đơn hàng</p>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="modalClose"
                  aria-label="Đóng"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="modalBody">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Customer Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-base font-semibold mb-3 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Thông tin khách hàng
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Tên:</span>
                      <span className="font-medium text-sm">{selectedCustomer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Số điện thoại:</span>
                      <span className="font-medium text-sm">{selectedCustomer.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Địa chỉ:</span>
                      <span className="font-medium text-sm text-right max-w-xs">{selectedCustomer.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Tổng đơn hàng:</span>
                      <span className="font-medium text-sm">{selectedCustomer.totalOrders}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Tổng chi tiêu:</span>
                      <span className="font-bold text-green-600 text-sm">{formatVND(selectedCustomer.totalSpent)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-base font-semibold mb-3 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Tóm tắt đơn hàng
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Đơn hàng gần nhất:</span>
                      <span className="font-medium text-sm">
                        {selectedCustomer.orders.length > 0 
                          ? new Date(selectedCustomer.orders[0].createdAt).toLocaleDateString('vi-VN')
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Đơn hàng đầu tiên:</span>
                      <span className="font-medium text-sm">
                        {selectedCustomer.orders.length > 0 
                          ? new Date(selectedCustomer.orders[selectedCustomer.orders.length - 1].createdAt).toLocaleDateString('vi-VN')
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Trung bình/đơn:</span>
                      <span className="font-medium text-sm">
                        {formatVND(selectedCustomer.totalSpent / selectedCustomer.totalOrders)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order History */}
              <div className="mt-4">
                <h3 className="text-base font-semibold mb-3 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Lịch sử đơn hàng
                </h3>
                <div className="space-y-2">
                  {selectedCustomer.orders.map((order, index) => (
                    <div key={order.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-semibold text-sm">Đơn hàng #{order.id.slice(-6)}</p>
                        <span className={`order-status status-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs text-gray-600">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                        <p className="text-sm font-semibold text-green-600">Tổng tiền: {formatVND(order.finalTotal)}</p>
                      </div>
                      <div className="mt-2">
                        <h4 className="font-medium text-sm mb-2">Sản phẩm:</h4>
                        <div className="space-y-1">
                          {order.orderItems.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center p-2 bg-gray-50 rounded">
                              <div className="relative w-8 h-8 mr-2">
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  layout="fill"
                                  objectFit="cover"
                                  className="rounded"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium">{item.title}</p>
                                <p className="text-xs text-gray-600">Số lượng: {item.quantity}</p>
                                <p className="text-xs font-semibold text-green-600">{formatVND(item.price)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="modalFooter">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Tổng chi tiêu: {formatVND(selectedCustomer.totalSpent)}
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="modalBtn modalBtnPrimary"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}