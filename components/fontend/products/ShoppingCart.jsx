import React, { useState, useEffect } from "react";
import Image from "next/image";
import { AiOutlineClose, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
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
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-start justify-end"
      onClick={toggleCart}
    >
      <div
        className="w-[400px] bg-white h-full flex flex-col shadow-lg animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <header className="flex justify-between items-center p-4 bg-green-600 text-white">
          <h2 className="font-bold">Giỏ hàng</h2>
          <button className="cursor-pointer" onClick={toggleCart}>
            <AiOutlineClose size={25} />
          </button>
        </header>

        {/* Danh sách sản phẩm */}
        <div className="flex-1 p-4 overflow-auto">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.product}
                className="relative flex items-center mb-4 border-b pb-2"
              >
                <button
                  className="absolute top-0 left-2 text-gray-500 hover:text-white hover:bg-red-500 rounded-full p-1 bg-gray-100"
                  onClick={() => handleRemove(item.product)}
                >
                  <AiOutlineClose size={14} />
                </button>
                <div className="flex items-center ml-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={70}
                    height={70}
                    className="rounded"
                    priority
                  />
                  <div className="ml-4">
                    <p className="font-medium">{item.title}</p>
                    <p>{formatCurrency(item.price)}</p>
                    <div className="flex items-center mt-1">
                      <button
                        className="p-1 border rounded bg-gray-200 hover:bg-gray-300"
                        onClick={() => handleDecrease(item.product)}
                      >
                        <AiOutlineMinus size={14} />
                      </button>
                      <span className="mx-2">{item.quantity}</span>
                      <button
                        className="p-1 border rounded bg-gray-200 hover:bg-gray-300"
                        onClick={() => handleIncrease(item.product)}
                      >
                        <AiOutlinePlus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">
              Giỏ hàng của bạn đang trống.
            </p>
          )}
        </div>

        {/* Nếu có sản phẩm, hiển thị phần mã giảm giá */}
        {cartItems.length > 0 && (
          <div className="px-4 border-t">
            <div className="flex pt-2 justify-between mb-2">
              <p className="text-gray-600">Tổng tạm tính</p>
              <span className="text-green-600 font-bold">
                {formatCurrency(totalPrice)}
              </span>
            </div>

            {/* Ô nhập mã giảm giá */}
            <div className="mb-2">
              <label className="block text-gray-600">Mã giảm giá</label>
              <div className="flex items-center gap-2 mt-2">
                <div className="relative flex-1">
                  {reduxDiscount > 0 && (
                    <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                      <div className="bg-green-500 text-white px-2 py-1 rounded flex items-center">
                        <span>{coupon.toUpperCase()}</span>
                        <button
                          className="ml-1 hover:text-gray-200"
                          onClick={handleRemoveCoupon}
                        >
                          <AiOutlineClose size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                  <input
                    type="text"
                    className="w-full border rounded p-2"
                    readOnly={reduxDiscount > 0}
                    value={reduxDiscount > 0 ? coupon.toUpperCase() : coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    disabled={loadingCoupon}
                    placeholder="Nhập mã (ECO10, ECO20...)"
                  />
                </div>
                <button
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 whitespace-nowrap"
                  onClick={handleApplyCoupon}
                  disabled={loadingCoupon || reduxDiscount > 0}
                >
                  {loadingCoupon ? "Đang kiểm tra..." : "Áp dụng"}
                </button>
              </div>
              {errorMessage && (
                <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
              )}
            </div>

            {reduxDiscount > 0 && (
              <div className="flex justify-between mb-2 text-red-500">
                <p>Giảm giá ({reduxDiscount}%)</p>
                <p>-{formatCurrency(discountAmount)}</p>
              </div>
            )}

            <div className="flex justify-between mb-2">
              <p className="text-gray-600 font-semibold">Thành tiền</p>
              <p className="font-bold text-lg">
                {formatCurrency(finalTotalAfterDiscount)}
              </p>
            </div>
          </div>
        )}

        <div className="p-4 border-t flex space-x-4">
          <Link href="/cart" className="w-1/2">
            <button className="w-full bg-green-500 text-white py-2 rounded-md">
              Xem giỏ hàng
            </button>
          </Link>
          <Link href="/checkout" className="w-1/2">
            <button className="w-full bg-orange-600 text-white py-2 rounded-md">
              Thanh toán
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
