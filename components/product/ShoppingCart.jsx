import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { removeFromCart, updateCartInDB } from "../../store/cartSlice";

const ShoppingCart = ({ cartOpen, toggleCart, cartItems = [] }) => {
  const dispatch = useDispatch();
  console.log("Cart Items from Redux:", cartItems);
  if (!cartOpen) return null;

  // 🔄 Kiểm tra dữ liệu trước khi tính tổng tiền
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      if (!item.price || !item.quantity) return total; // Bỏ qua sản phẩm lỗi
      return total + item.price * item.quantity;
    }, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
    dispatch(updateCartInDB()); // Cập nhật MongoDB ngay khi xóa sản phẩm
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-start justify-end"
      onClick={toggleCart} 
    >
      <div
        className="w-[400px] bg-white h-full flex flex-col shadow-lg animate-slide-in-right"
        onClick={(e) => e.stopPropagation()} 
        role="dialog"
        aria-labelledby="cart-title"
        aria-modal="true"
      >
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-green-600 text-white">
          <h2 id="cart-title" className="font-bold">Giỏ hàng</h2>
          <button className="cursor-pointer" aria-label="Close cart" onClick={toggleCart}>
            <AiOutlineClose size={25} aria-hidden="true" />
          </button>
        </header>

        {/* Cart Items */}
        <div className="flex-1 p-4 overflow-auto">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div key={item._id} className="relative flex items-center mb-4 border-b pb-2">
                {/* Nút Xóa */}
                <button
                  className="absolute top-[-8px] left-2 text-gray-500 hover:text-white hover:bg-red-500 rounded-full p-1 bg-gray-100"
                  onClick={() => handleRemoveItem(item._id)}
                  aria-label={`Remove ${item.name}`}
                >
                  <AiOutlineClose size={10} aria-hidden="true" />
                </button>

                {/* Ảnh và Chi tiết */}
                <div className="flex items-center ml-4">
                  <Image
                    src={item.image || "/fallback-image.jpg"}
                    alt={item.name || "Không có tên"}
                    width={50}
                    height={50}
                  />
                  <div className="ml-4">
                    <p className="font-semibold">{item.name || "Sản phẩm không có tên"}</p>
                    <p>
                      {item.quantity || 1} x {formatCurrency(item.price || 0)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Giỏ hàng của bạn đang trống.</p>
          )}
        </div>

        {/* Subtotal */}
        <div className="p-4 border-t">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Tổng:</span>
            <span className="text-green-600 font-bold">
              {formatCurrency(calculateSubtotal())}
            </span>
          </div>
          <p className="text-sm text-gray-500">Miễn phí cho đơn hàng trên 300.000 ₫</p>
        </div>

        {/* Buttons */}
        <div className="p-4 border-t flex space-x-4">
          <button
            className="w-1/2 bg-green-500 text-white py-2 rounded-md"
            disabled={cartItems.length === 0}
          >
            Xem giỏ hàng
          </button>
          <button
            className="w-1/2 bg-orange-600 text-white py-2 rounded-md"
            disabled={cartItems.length === 0}
          >
            Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
