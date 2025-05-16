import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import OrderDetailsPopup from "./OrderDetailsPopup";
import { paymentMethodText, orderStatusText, orderStatusColors } from "../../utils/mappings";

function formatCurrency(amount) {
  return amount.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });
}

export default function OrdersTab() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmCancelOrderId, setConfirmCancelOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const ordersPerPage = 5;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const fetchOrders = useCallback(async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      const res = await axios.get("/api/orders");
      const sortedOrders = (res.data.orders || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session) {
      fetchOrders();
    }
  }, [session, fetchOrders]);

  const handleCancelOrder = async (orderId) => {
    try {
      await axios.put(`/api/orders/cancel?orderId=${orderId}`);
      toast.success("Đơn hàng đã bị hủy.");
      fetchOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Có lỗi khi hủy đơn hàng.");
    }
  };

  const confirmCancel = async () => {
    if (!confirmCancelOrderId) return;
    await handleCancelOrder(confirmCancelOrderId);
    setConfirmCancelOrderId(null);
  };

  if (!session) {
    return (
      <div className="p-4">
        Vui lòng đăng nhập để xem đơn hàng của bạn.
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h2>
      {loading ? (
        <p>Đang tải đơn hàng...</p>
      ) : orders.length === 0 ? (
        <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-2 py-3">STT</th>
                  <th className="px-4 py-3">Ngày đặt</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Phương thức</th>
                  <th className="px-4 py-3">Tổng thanh toán</th>
                  <th className="px-4 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order, index) => (
                  <tr key={order._id} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-3">
                      {index + 1 + indexOfFirstOrder}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        Ngày:{" "}
                        {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                          day: "numeric",
                          month: "numeric",
                          year: "numeric",
                        })}
                      </div>
                      <div>
                        Giờ:{" "}
                        {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className={`px-4 py-3 ${orderStatusColors[order.status]}`}>
                      {orderStatusText[order.status]}
                    </td>
                    <td className="px-4 py-3">
                      {paymentMethodText[order.paymentMethod]}
                    </td>
                    <td className="px-4 py-3 font-semibold">
                      {order.finalTotal.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:underline"
                        aria-label={`Xem chi tiết đơn hàng ${order._id}`}
                      >
                        Xem chi tiết
                      </button>
                      {order.status === "pending" && (
                        <button
                          onClick={() => setConfirmCancelOrderId(order._id)}
                          className="ml-2 text-red-600 hover:underline"
                          aria-label={`Hủy đơn hàng ${order._id}`}
                        >
                          Hủy đơn
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-center items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              aria-label="Trang trước"
            >
              Lùi
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 border rounded hover:bg-gray-100 ${
                  currentPage === i + 1 ? "bg-blue-500 text-white" : ""
                }`}
                aria-label={`Trang ${i + 1}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
              aria-label="Trang tiếp theo"
            >
              Tiếp
            </button>
          </div>
        </>
      )}

      {selectedOrder && (
        <OrderDetailsPopup
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {confirmCancelOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-4 rounded-md shadow-md text-center w-80">
            <p className="mb-4">Bạn có chắc chắn muốn hủy đơn hàng?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                aria-label="Xác nhận hủy đơn hàng"
              >
                Xác nhận
              </button>
              <button
                onClick={() => setConfirmCancelOrderId(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                aria-label="Hủy thao tác"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}