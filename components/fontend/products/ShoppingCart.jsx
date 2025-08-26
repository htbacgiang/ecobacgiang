import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus, AiOutlineShoppingCart, AiOutlineGift, AiOutlineCreditCard } from "react-icons/ai";
import { BiTrash } from "react-icons/bi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  setCart,
} from "../../../store/cartSlice";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";

const ShoppingCart = ({ toggleCart }) => {
  // Thêm keyboard support để đóng cart bằng ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        toggleCart();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [toggleCart]);

  // Đảm bảo body không scroll khi cart mở
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);
  const dispatch = useDispatch();
  const { data: session } = useSession();

  // Lấy dữ liệu cart từ Redux
  const {
    cartItems,
    coupon: appliedCoupon,
    discount: reduxDiscount,
    totalAfterDiscount,
  } = useSelector((state) => state.cart);

  // Tính tổng tiền từ cartItems (như ở trang cart)
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // State local cho coupon, errorMessage, loading
  const [coupon, setCoupon] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  // Tính phần giảm giá và tổng thanh toán sau giảm dựa trên totalPrice
  const discountAmount = (totalPrice * reduxDiscount) / 100;
  const finalTotalAfterDiscount = totalAfterDiscount || totalPrice - discountAmount;

  // Đồng bộ coupon từ Redux (nếu đã áp)
  useEffect(() => {
    if (session?.user?.id && appliedCoupon) {
      setCoupon(appliedCoupon);
    } else {
      setCoupon("");
    }
  }, [session, appliedCoupon]);

  // Các hàm xử lý tăng/giảm/xóa sản phẩm
  const handleIncrease = async (productId) => {
    if (session?.user?.id) {
      try {
        const res = await axios.put(`/api/cart/${session.user.id}/${productId}`, {
          type: "increase",
        });
        dispatch(setCart(res.data));
      } catch (error) {
        console.error(error);
      }
    } else {
      dispatch(increaseQuantity(productId));
    }
  };

  const handleDecrease = async (productId) => {
    if (session?.user?.id) {
      try {
        const res = await axios.put(`/api/cart/${session.user.id}/${productId}`, {
          type: "decrease",
        });
        dispatch(setCart(res.data));
      } catch (error) {
        console.error(error);
      }
    } else {
      dispatch(decreaseQuantity(productId));
    }
  };

  const handleRemove = async (productId) => {
    if (session?.user?.id) {
      try {
        const res = await axios.delete(`/api/cart/${session.user.id}/${productId}`);
        dispatch(setCart(res.data));
      } catch (error) {
        console.error(error);
      }
    } else {
      dispatch(removeFromCart(productId));
    }
  };

  // Hàm áp mã giảm giá
  const handleApplyCoupon = async () => {
    setLoadingCoupon(true);
    if (!session?.user?.id) {
      toast.error("Vui lòng đăng nhập để áp dụng mã giảm giá.");
      setLoadingCoupon(false);
      return;
    }
        // Kiểm tra nếu mã giảm giá rỗng
  if (!coupon || coupon.trim() === "") {
    setErrorMessage("Vui lòng nhập mã giảm giá.");
    setLoadingCoupon(false);
    return;
  }
    try {
      const resCoupon = await axios.get(`/api/coupon?coupon=${coupon.toUpperCase()}`);
      const couponData =
        resCoupon.data && resCoupon.data.length > 0 ? resCoupon.data[0] : null;
      if (!couponData) {
        setErrorMessage("Mã giảm giá không hợp lệ.");
        setLoadingCoupon(false);
        return;
      }
      const now = new Date();
      const start = new Date(couponData.startDate);
      const end = new Date(couponData.endDate);
      if (now < start || now > end) {
        setErrorMessage("Mã giảm giá đã hết hạn hoặc chưa có hiệu lực.");
        setLoadingCoupon(false);
        return;
      }
      const discountValue = couponData.discount;
      const discountAmt = (totalPrice * discountValue) / 100;
      const newTotalAfterDiscount = totalPrice - discountAmt;

      const res = await axios.put(`/api/cart/${session.user.id}/apply-coupon`, {
        coupon: coupon.toUpperCase(),
        discount: discountValue,
        totalAfterDiscount: newTotalAfterDiscount,
      });
      dispatch(setCart(res.data));
      setErrorMessage("");
      toast.success("Áp dụng mã giảm giá thành công!");
    } catch (error) {
      console.error(error);
      setErrorMessage("Có lỗi khi áp mã giảm giá.");
    } finally {
      setLoadingCoupon(false);
    }
  };

  // Hàm xóa mã giảm giá
  const handleRemoveCoupon = async () => {
    if (session?.user?.id) {
      try {
        const res = await axios.put(`/api/cart/${session.user.id}/apply-coupon`, {
          coupon: "",
          discount: 0,
          totalAfterDiscount: totalPrice,
        });
        dispatch(setCart(res.data));
        setCoupon("");
        toast.success("Đã xóa mã giảm giá.");
      } catch (error) {
        console.error(error);
        setErrorMessage("Có lỗi khi xóa mã giảm giá.");
      }
    } else {
      // Xử lý cục bộ
      dispatch(
        setCart({
          products: cartItems,
          cartTotal: totalPrice,
          coupon: "",
          discount: 0,
          totalAfterDiscount: totalPrice,
        })
      );
      setCoupon("");
      toast.success("Đã xóa mã giảm giá.");
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  return (
    <div
      className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-[10000] flex items-start justify-end backdrop-blur-sm transition-all duration-300"
      onClick={toggleCart}
      style={{ height: '100vh' }}
    >
      <div
        className="w-full sm:w-[380px] bg-white h-screen flex flex-col shadow-2xl transform transition-all duration-300 ease-out animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        style={{ 
          height: '100vh',
          maxHeight: '100vh',
          minHeight: '100vh'
        }}
      >
        {/* Header với màu đơn giản */}
        <header className="flex justify-between items-center p-3 bg-green-600 text-white shadow-lg">
          <div className="flex items-center space-x-3">
            <AiOutlineShoppingCart size={24} className="text-green-200" />
            <h2 id="cart-title" className="font-bold text-xl">Giỏ hàng</h2>
            {cartItems.length > 0 && (
              <span className="bg-white text-green-600 text-xs font-bold px-2 py-1 rounded-full">
                {cartItems.length}
              </span>
            )}
          </div>
          <button 
            className="cursor-pointer hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50" 
            onClick={toggleCart}
            aria-label="Đóng giỏ hàng"
          >
            <AiOutlineClose size={22} />
          </button>
        </header>

        {/* Danh sách sản phẩm */}
        <div className="flex-1 p-2 overflow-auto bg-gray-50 min-h-0">
          {cartItems.length > 0 ? (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div
                  key={item.product}
                  className="relative bg-white rounded-lg p-1.5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group"
                >
                  {/* Nút xóa với hiệu ứng đẹp */}
                  <button
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    onClick={() => handleRemove(item.product)}
                    title="Xóa sản phẩm"
                  >
                    <BiTrash size={16} />
                  </button>
                  
                  <div className="flex items-center">
                    {/* Hình ảnh sản phẩm với border radius đẹp */}
                    <div className="relative">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover shadow-sm"
                        priority
                      />
                      {/* Badge số lượng */}
                      <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {item.quantity}
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-green-600 font-bold text-lg mb-3">
                        {formatCurrency(item.price)}
                      </p>
                      
                      {/* Điều khiển số lượng với thiết kế đẹp */}
                      <div className="flex items-center space-x-2">
                        <button
                          className="w-8 h-8 border border-gray-300 rounded-lg bg-white hover:bg-green-50 hover:border-green-300 transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-green-600"
                          onClick={() => handleDecrease(item.product)}
                          disabled={item.quantity <= 1}
                        >
                          <AiOutlineMinus size={14} />
                        </button>
                        <span className="w-12 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-semibold text-gray-700">
                          {item.quantity}
                        </span>
                        <button
                          className="w-8 h-8 border border-gray-300 rounded-lg bg-white hover:bg-green-50 hover:border-green-300 transition-all duration-200 flex items-center justify-center text-gray-600 hover:text-green-600"
                          onClick={() => handleIncrease(item.product)}
                        >
                          <AiOutlinePlus size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AiOutlineShoppingCart size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">Giỏ hàng của bạn đang trống</p>
              <p className="text-gray-400 text-sm">Hãy thêm các sản phẩm rau củ hữu cơ vào giỏ hàng nhé!</p>
            </div>
          )}
        </div>

        {/* Phần tổng tiền và mã giảm giá */}
        {cartItems.length > 0 && (
          <div className="px-4 py-2 bg-white border-t border-gray-100">
            {/* Tổng tạm tính */}
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-medium">Tổng tạm tính</span>
              <span className="text-green-600 font-bold text-lg">
                {formatCurrency(totalPrice)}
              </span>
            </div>

            {/* Mã giảm giá */}
            <div className="mb-4">
              <label className="block text-gray-600 font-medium mb-2 flex items-center">
                <MdOutlineLocalOffer className="mr-2 text-orange-500" />
                Mã giảm giá
              </label>
              
              {reduxDiscount > 0 ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AiOutlineGift className="text-green-600" />
                      <span className="text-green-800 font-medium">{coupon.toUpperCase()}</span>
                      <span className="text-green-600 text-sm">(-{reduxDiscount}%)</span>
                    </div>
                    <button
                      className="text-green-600 hover:text-green-800 transition-colors"
                      onClick={handleRemoveCoupon}
                      title="Xóa mã giảm giá"
                    >
                      <AiOutlineClose size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-24 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      disabled={loadingCoupon}
                      placeholder="Nhập mã giảm giá..."
                    />
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white px-3 py-1.5 rounded-md hover:bg-green-600 transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleApplyCoupon}
                      disabled={loadingCoupon || !coupon.trim()}
                    >
                      {loadingCoupon ? "Đang kiểm tra..." : "Áp dụng"}
                    </button>
                  </div>
                </div>
              )}
              
              {errorMessage && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  {errorMessage}
                </p>
              )}
            </div>

            {/* Hiển thị giảm giá nếu có */}
            {reduxDiscount > 0 && (
              <div className="flex justify-between items-center mb-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-700 font-medium">Giảm giá ({reduxDiscount}%)</span>
                <span className="text-red-700 font-bold">-{formatCurrency(discountAmount)}</span>
              </div>
            )}

            {/* Phí vận chuyển */}
            <div className="flex justify-between items-center mb-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-blue-700 font-medium flex items-center">
                🚚 Phí vận chuyển
              </span>
              <span className="text-blue-700 font-bold">
                {totalPrice >= 500000 ? "Miễn phí" : formatCurrency(30000)}
              </span>
            </div>

            {/* Tổng thành tiền và nút thanh toán */}
            <div className="flex justify-between items-center py-2 border-t border-gray-200">
              <span className="text-gray-800 font-bold text-base">Thành tiền:</span>
              <div className="flex items-center space-x-3">
                <span className="text-green-600 font-bold text-lg">
                  {formatCurrency(totalPrice >= 500000 ? finalTotalAfterDiscount : finalTotalAfterDiscount + 30000)}
                </span>
                <Link href="/checkout">
                  <button className="bg-green-600 text-white py-2 px-4 rounded-lg font-bold hover:bg-green-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg">
                    <AiOutlineCreditCard size={18} />
                    <span>Thanh toán</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
