// components/OrderDetailsPopup.jsx
import React from "react";
import Image from "next/image"; // Import Image from next/image
export default function OrderDetailsPopup({ order, onClose }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-md p-4 rounded-md shadow-lg">
        <h3 className="text-xl font-bold mb-4">Chi tiết đơn hàng</h3>
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div key={item._id || item.id} className="flex items-center gap-4 border-b pb-2">
              <Image
                  src={item.image || "/path/to/fallback-image.jpg"} // Fallback image
                  alt={item.title}
                  width={64} // Matches w-16 (16 * 4px = 64px)
                  height={64} // Matches h-16 (16 * 4px = 64px)
                  className="rounded object-cover" // Preserve rounded corners and object-cover
                  unoptimized={item.image?.startsWith("http")} // Optional: Disable optimization for external images
                />
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                <p className="text-sm text-gray-600">
                  {Number(item.price).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
