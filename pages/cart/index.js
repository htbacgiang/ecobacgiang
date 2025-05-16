import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { FiMinus, FiPlus } from "react-icons/fi";
import Navbar from "../../components/header/Navbar";
import { useSession } from "next-auth/react";
import axios from "axios";
import { setCart, increaseQuantity, decreaseQuantity, removeFromCart } from "../../store/cartSlice";
import { AiOutlineClose } from "react-icons/ai";

export default function Cart() {
  const dispatch = useDispatch();
  const { data: session } = useSession();

  // Lấy cart từ Redux (bao gồm coupon, totalAfterDiscount)
  const { cartItems, coupon: appliedCoupon, totalAfterDiscount } = useSelector((state) => state.cart);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  // State local cho coupon và discount
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Tính toán discountAmount và final total sau giảm
  const discountAmount = (totalPrice * discount) / 100;
  const finalTotalAfterDiscount = totalAfterDiscount || (totalPrice - discountAmount);

  // Đồng bộ coupon từ Redux khi load lại trang
  useEffect(() => {
    if (session?.user?.id && appliedCoupon) {
      setCoupon(appliedCoupon);
      if (totalPrice > 0) {
        const computedDiscount = Math.round(((totalPrice - finalTotalAfterDiscount) * 100) / totalPrice);
        setDiscount(computedDiscount);
      }
    } else {
      setCoupon("");
      setDiscount(0);
    }
  }, [session, appliedCoupon, totalPrice, finalTotalAfterDiscount]);

  // Hàm tăng sản phẩm
  const handleIncreaseQuantity = async (item) => {
    if (session?.user?.id) {
      try {
        const res = await axios.put(`/api/cart/${session.user.id}/${item.product}`, { type: "increase" });
        dispatch(setCart(res.data));
      } catch (error) {
        console.error(error);
        toast.error("Có lỗi khi tăng số lượng.");
      }
    } else {
      dispatch(increaseQuantity(item.product));
    }
  };

  // Hàm giảm sản phẩm: nếu số lượng bằng 1 thì xác nhận xóa
  const handleDecreaseQuantity = async (item) => {
    if (item.quantity === 1) {
      // Nếu số lượng 1, xác nhận xóa sản phẩm
      setConfirmDelete(item);
    } else {
      if (session?.user?.id) {
        try {
          const res = await axios.put(`/api/cart/${session.user.id}/${item.product}`, { type: "decrease" });
          dispatch(setCart(res.data));
        } catch (error) {
          console.error(error);
          toast.error("Có lỗi khi giảm số lượng.");
        }
      } else {
        dispatch(decreaseQuantity(item.product));
      }
    }
  };

  // Hàm xóa sản phẩm khi được xác nhận
  const handleRemoveItem = async (item) => {
    if (session?.user?.id) {
      try {
        const res = await axios.delete(`/api/cart/${session.user.id}/${item.product}`);
        dispatch(setCart(res.data));
        toast.success(`Đã xóa "${item.title}" khỏi giỏ hàng!`);
      } catch (error) {
        console.error(error);
        toast.error("Có lỗi khi xóa sản phẩm.");
      }
    } else {
      dispatch(removeFromCart(item.product));
    }
  };

  // Hàm áp mã giảm giá: lấy coupon từ DB và lưu vào cart
  const handleApplyCoupon = async () => {
    setLoadingCoupon(true);
    if (!session?.user?.id) {
      toast.error("Vui lòng đăng nhập để áp dụng mã giảm giá.");
      setLoadingCoupon(false);
      return;
    }
    try {
      const resCoupon = await axios.get(`/api/coupon?coupon=${coupon.toUpperCase()}`);
      const couponData = resCoupon.data && resCoupon.data.length > 0 ? resCoupon.data[0] : null;
      if (!couponData) {
        setDiscount(0);
        setErrorMessage("Mã giảm giá không hợp lệ.");
        setLoadingCoupon(false);
        return;
      }
      const currentDate = new Date();
      const start = new Date(couponData.startDate);
      const end = new Date(couponData.endDate);
      if (currentDate < start || currentDate > end) {
        setDiscount(0);
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
      setDiscount(discountValue);
      setErrorMessage("");
      toast.success("Áp dụng mã giảm giá thành công!");
    } catch (error) {
      console.error(error);
      setErrorMessage("Có lỗi khi áp dụng mã giảm giá.");
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
        setDiscount(0);
        setErrorMessage("");
      } catch (error) {
        console.error(error);
        setErrorMessage("Có lỗi khi xóa mã giảm giá.");
      }
    } else {
      dispatch(setCart({
        products: cartItems,
        cartTotal: totalPrice,
        coupon: "",
        discount: 0,
        totalAfterDiscount: totalPrice,
      }));
      setCoupon("");
      setDiscount(0);
      setErrorMessage("");
    }
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);

  return (
    <>
      <Navbar />
      <Head>
        <title>Giỏ hàng</title>
        <meta name="description" content="Giỏ hàng của bạn tại Eco Bắc Giang" />
      </Head>
      <div className="h-[80px] bg-white"></div>
      <div className="p-4 bg-gray-100 min-h-screen">
        <Toaster />
        {/* Confirm Delete Modal */}
        {confirmDelete !== null && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg text-center w-80">
              <p className="mb-4">Sản phẩm &quot;{confirmDelete.title}&quot; sẽ bị xóa khỏi giỏ hàng. Bạn có chắc không?</p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  onClick={() => {
                    handleRemoveItem(confirmDelete);
                    setConfirmDelete(null);
                  }}
                >
                  Đồng ý
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => setConfirmDelete(null)}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Danh sách sản phẩm */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">🛒 Giỏ hàng</h2>
            {cartItems.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <div className="flex items-center py-3" key={item.product}>
                    <div className="w-16 h-16 flex-shrink-0 relative">
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <p className="font-medium">{item.title}</p>
                      {item.unit && (
                        <p className="text-gray-500 text-sm">Đơn vị tính: {item.unit}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(item.price)}</p>
                      <div className="flex items-center mt-2">
                        <button
                          className="p-2 border rounded hover:bg-gray-200"
                          onClick={() => handleDecreaseQuantity(item)}
                        >
                          <FiMinus />
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          className="p-2 border rounded hover:bg-gray-200"
                          onClick={() => handleIncreaseQuantity(item)}
                        >
                          <FiPlus />
                        </button>
                      </div>
                      <button
                        className="text-red-500 text-sm mt-2 hover:underline"
                        onClick={() => setConfirmDelete(item)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">Giỏ hàng của bạn đang trống.</p>
                <Link href="/">
                  <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                    Tiếp tục mua sắm
                  </button>
                </Link>
              </div>
            )}
          </div>
          {/* Thông tin thanh toán */}
          {cartItems.length > 0 && (
            <div className="col-span-1 bg-gray-50 p-4 rounded-lg shadow-inner">
              <h2 className="text-xl font-semibold mb-4">Thanh toán</h2>
              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Tổng tạm tính</p>
                <p className="font-medium">{formatCurrency(totalPrice)}</p>
              </div>
              {/* Ô nhập mã giảm giá kiểu "chip in input" */}
              <div className="mb-2">
                <label className="block text-gray-600">Mã giảm giá</label>
                <div className="relative w-full mt-2 flex gap-2">
                  <div className="relative flex-1">
                    {discount > 0 && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center bg-green-500 text-white px-2 py-1 rounded">
                        <span>{coupon.toUpperCase()}</span>
                        <button className="ml-1 hover:text-gray-200" onClick={handleRemoveCoupon}>
                          <AiOutlineClose size={14} />
                        </button>
                      </div>
                    )}
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      placeholder="Nhập mã (ví dụ: ECO10, ECO20...)"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      disabled={discount > 0 || loadingCoupon}
                    />
                  </div>
                  <button
                    className="px-2 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap"
                    onClick={handleApplyCoupon}
                    disabled={loadingCoupon || discount > 0}
                  >
                    {loadingCoupon ? "Đang kiểm tra..." : "Áp dụng"}
                  </button>
                </div>
                {errorMessage && (
                  <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                )}
              </div>
              {discount > 0 && (
                <div className="flex justify-between mb-2 text-red-500">
                  <p>Giảm giá ({discount}%)</p>
                  <p>-{formatCurrency(discountAmount)}</p>
                </div>
              )}
              <div className="flex justify-between mb-2">
                <p className="text-gray-600 font-semibold">Thành tiền</p>
                <p className="font-bold text-lg">{formatCurrency(finalTotalAfterDiscount)}</p>
              </div>
              <button className="w-full bg-green-500 text-white py-2 rounded-md mt-4 hover:bg-green-600">
                THANH TOÁN
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

