import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import { FiMinus, FiPlus } from "react-icons/fi";
import Navbar from "../../components/header/Navbar";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  setCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../store/cartSlice";
import { AiOutlineClose } from "react-icons/ai";
import EditAddressPopup from "../../components/fontend/common/EditAddressPopup";
import SelectAddressPopup from "../../components/fontend/common/SelectAddressPopup";
import { io } from "socket.io-client";

export default function Cart() {
  const dispatch = useDispatch();
  const { data: session } = useSession();
  const {
    cartItems,
    coupon: appliedCoupon,
    discount: reduxDiscount,
    totalAfterDiscount,
  } = useSelector((state) => state.cart);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // --- Payment state ---
  // State payment
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [paymentCode, setPaymentCode] = useState("");      // QR động Sepay/MoMo
  const [isPaid, setIsPaid] = useState(false);             // Trạng thái thanh toán
  const [loadingPayment, setLoadingPayment] = useState(false); // Loading khi tạo thanh toán
  const [qrUrl, setQrUrl] = useState("");                  // QR Sepay/MoMo hoặc BankTransfer
  const [payUrl, setPayUrl] = useState("");                // URL thanh toán MoMo
  const [showQR, setShowQR] = useState(false);             // QR BankTransfer

  // State cho mã giảm giá
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingCoupon, setLoadingCoupon] = useState(false);

  // State xác nhận xóa địa chỉ (chứa _id của địa chỉ cần xóa)
  const [confirmDeleteAddress, setConfirmDeleteAddress] = useState(null);

  // State thông tin người dùng và địa chỉ
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  const discountAmount = (totalPrice * reduxDiscount) / 100;
  const finalTotalAfterDiscount =
    totalAfterDiscount || totalPrice - discountAmount;
  const shippingFee = 30000; // 30.000 VND
  const finalTotal = finalTotalAfterDiscount + shippingFee;

  // Thông tin chuyển khoản
  const bankInfo = {
    bankId: "TPB", // Mã ngân hàng (VD: Vietcombank = "VCB", Techcombank = "TCB", BIDV = "BIDV")
    bankName: "Ngân hàng Tiên Phong", // Tên ngân hàng đầy đủ
    bankAccount: "0392 4302 701", // Số tài khoản nhận tiền
    accountName: "NGO QUANG TRUONG", // Tên người nhận tiền
  };

  // Hàm chuyển đổi tiếng Việt có dấu thành không dấu
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D") // Chuyển đ -> d
      .replace(/[^\w\s]/g, "") // Xóa ký tự đặc biệt
      .trim();
  };

  // State popup chỉnh sửa/ thêm địa chỉ
  const [showEditAddressPopup, setShowEditAddressPopup] = useState(false);
  const [editAddressData, setEditAddressData] = useState({
    _id: "",
    fullName: "",
    phoneNumber: "",
    city: "",
    cityName: "",
    district: "",
    districtName: "",
    ward: "",
    wardName: "",
    address1: "",
    type: "home",
    isDefault: false,
  });

  useEffect(() => {
    if (paymentMethod === "BankTransfer") {
      const amount = finalTotal;
      const customerName = session?.user?.name ? removeVietnameseTones(session.user.name) : " ";
      const message = `Thanh toan ${customerName} - ${Date.now()}`;
      const qrCodeUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.bankAccount
        }-qr_only.png?amount=${amount}&addInfo=${encodeURIComponent(message)}`;
      setQrUrl(qrCodeUrl);
      setShowQR(true);
    } else {
      setShowQR(false);
    }
  }, [paymentMethod, finalTotal, session?.user?.name]);


  // Lấy thông tin người dùng (bao gồm địa chỉ)
  useEffect(() => {
    async function fetchUserInfo() {
      if (session?.user?.id) {
        try {
          const res = await axios.get(`/api/user/${session.user.id}`);
          const userData = res.data;
          setName(userData.name || "");
          setPhone(userData.phone || userData.address?.[0]?.phoneNumber || "");
          if (userData.address && userData.address.length > 0) {
            setAddresses(userData.address);
            // Chọn địa chỉ mặc định hoặc địa chỉ đầu tiên
            const defaultAddr =
              userData.address.find((addr) => addr.isDefault) ||
              userData.address[0];
            setSelectedAddress(defaultAddr);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      }
    }
    fetchUserInfo();
  }, [session]);

  // Đồng bộ mã giảm giá nếu có
  useEffect(() => {
    if (session?.user?.id && appliedCoupon) {
      setCoupon(appliedCoupon);
      setDiscount(reduxDiscount);
    } else {
      setCoupon("");
      setDiscount(0);
    }
  }, [session, appliedCoupon, reduxDiscount]);

  // Các hàm xử lý giỏ hàng
  const handleIncreaseQuantity = async (item) => {
    if (session?.user?.id) {
      try {
        const res = await axios.put(
          `/api/cart/${session.user.id}/${item.product}`,
          {
            type: "increase",
          }
        );
        dispatch(setCart(res.data));
      } catch (error) {
        console.error(error);
        toast.error("Có lỗi khi tăng số lượng.");
      }
    } else {
      dispatch(increaseQuantity(item.product));
    }
  };

  const handleDecreaseQuantity = async (item) => {
    if (item.quantity === 1) {
      // Xử lý xóa sản phẩm khỏi giỏ nếu số lượng = 1
      setConfirmDeleteAddress(item.product);
    } else {
      if (session?.user?.id) {
        try {
          const res = await axios.put(
            `/api/cart/${session.user.id}/${item.product}`,
            {
              type: "decrease",
            }
          );
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

  const handleRemoveItem = async (item) => {
    if (session?.user?.id) {
      try {
        const res = await axios.delete(
          `/api/cart/${session.user.id}/${item.product}`
        );
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

  // Xử lý mã giảm giá
  const handleApplyCoupon = async () => {
    setLoadingCoupon(true);
    if (!session?.user?.id) {
      toast.error("Vui lòng đăng nhập để áp dụng mã giảm giá.");
      setLoadingCoupon(false);
      return;
    }
    // Kiểm tra nếu mã giảm giá rỗng
    if (!coupon || coupon.trim() === "") {
      setDiscount(0);
      setErrorMessage("Vui lòng nhập mã giảm giá.");
      setLoadingCoupon(false);
      return;
    }
    try {
      const resCoupon = await axios.get(
        `/api/coupon?coupon=${coupon.toUpperCase()}`
      );
      const couponData =
        resCoupon.data && resCoupon.data.length > 0 ? resCoupon.data[0] : null;
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
      setErrorMessage("Có lỗi khi áp mã giảm giá.");
    } finally {
      setLoadingCoupon(false);
    }
  };


  const handleRemoveCoupon = async () => {
    if (session?.user?.id) {
      try {
        const res = await axios.put(
          `/api/cart/${session.user.id}/apply-coupon`,
          {
            coupon: "",
            discount: 0,
            totalAfterDiscount: totalPrice,
          }
        );
        dispatch(setCart(res.data));
        setCoupon("");
        setDiscount(0);
        setErrorMessage("");
      } catch (error) {
        console.error(error);
        setErrorMessage("Có lỗi khi xóa mã giảm giá.");
      }
    } else {
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
      setDiscount(0);
      setErrorMessage("");
    }
  };


  // Tạo thanh toán (Sepay/MoMo)
  const handleCreatePayment = async () => {
    if (!session?.user?.id) {
      toast.error("Vui lòng đăng nhập để sử dụng thanh toán online");
      setPaymentMethod("COD");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Giỏ hàng trống, không thể tạo thanh toán");
      setPaymentMethod("COD");
      return;
    }

    setLoadingPayment(true);
    try {
      let res;
      if (paymentMethod === "Sepay") {
        res = await axios.post("/api/create-sepay-payment", {
          amount: finalTotal,
          userId: session.user.id,
        });
      } else if (paymentMethod === "MoMo") {
        res = await axios.post("/api/create-momo-payment", {
          amount: finalTotal,
          userId: session.user.id,
          orderInfo: `Thanh toan don hang Eco Bac Giang - ${Date.now()}`
        });
      }

      if (res.data.success) {
        setPaymentCode(res.data.paymentCode);
        setQrUrl(res.data.qrUrl || res.data.qrCodeUrl);
        setPayUrl(res.data.payUrl);
        setIsPaid(false);
        toast.success(`Đã tạo thanh toán ${paymentMethod}!`);
      } else {
        throw new Error(res.data.error || "Không thể tạo thanh toán");
      }
    } catch (err) {
      console.error("Payment creation error:", err);
      const errorMessage = err.response?.data?.error || err.message || `Không tạo được phiếu thanh toán ${paymentMethod}!`;
      toast.error(errorMessage);
      setPaymentMethod("COD");
      setPaymentCode("");
      setQrUrl("");
      setPayUrl("");
    } finally {
      setLoadingPayment(false);
    }
  };

  // Sepay: Lắng nghe xác nhận thanh toán
  useEffect(() => {
    if (!paymentCode) return;

    // Khởi tạo WebSocket connection
    fetch("/api/socket");
    const socket = io({ path: "/api/socket" });

    // Join room để nhận thông báo
    socket.emit("join_payment", paymentCode);

    // Lắng nghe sự kiện thanh toán thành công
    socket.on("payment_paid", (data) => {
      if (data.paymentCode === paymentCode) {
        setIsPaid(true);
        toast.success(`✅ Thanh toán thành công! Số tiền: ${formatCurrency(data.amount || finalTotal)}`);

        // Tự động chuyển focus về nút thanh toán
        setTimeout(() => {
          const checkoutButton = document.querySelector('button[onClick="handleCheckout"]');
          if (checkoutButton) {
            checkoutButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 1000);
      }
    });

    // Lắng nghe lỗi kết nối
    socket.on("connect_error", (error) => {
      console.error("WebSocket connection error:", error);
      console.log("Falling back to polling mechanism...");
    });

    // Polling để kiểm tra trạng thái thanh toán (backup cho WebSocket)
    const checkPaymentStatus = async () => {
      try {
        const res = await axios.get(`/api/check-sepay-status?paymentCode=${paymentCode}`);
        if (res.data.success) {
          const payment = res.data.payment;

          if (payment.status === "paid") {
            setIsPaid(true);
            toast.success(`✅ Thanh toán thành công! Số tiền: ${formatCurrency(payment.amount)}`);

            // Tự động chuyển focus về nút thanh toán
            setTimeout(() => {
              const checkoutButton = document.querySelector('button[onClick="handleCheckout"]');
              if (checkoutButton) {
                checkoutButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }, 1000);

            // Dừng polling khi đã thanh toán thành công
            clearInterval(interval);
          } else if (payment.status === "expired") {
            toast.error("Mã QR đã hết hạn, vui lòng tạo lại");
            setPaymentCode("");
            setQrUrl("");
            clearInterval(interval);
          } else if (payment.status === "failed") {
            toast.error("Thanh toán thất bại, vui lòng thử lại");
            setPaymentCode("");
            setQrUrl("");
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error("Payment status check error:", error);
      }
    };

    // Kiểm tra ngay lập tức
    checkPaymentStatus();

    // Kiểm tra mỗi 5 giây (tăng tần suất để responsive hơn)
    const interval = setInterval(checkPaymentStatus, 5000);

    // Cleanup khi component unmount hoặc paymentCode thay đổi
    return () => {
      socket.off("payment_paid");
      socket.off("connect_error");
      socket.disconnect();
      clearInterval(interval);
    };
  }, [paymentCode, finalTotal]);

  // Xử lý khi thay đổi phương thức thanh toán
  useEffect(() => {
    if (paymentMethod === "Sepay" || paymentMethod === "MoMo") {
      if (session?.user?.id && cartItems.length > 0) {
        handleCreatePayment();
      } else {
        if (!session?.user?.id) {
          toast.error("Vui lòng đăng nhập để sử dụng thanh toán online");
          setPaymentMethod("COD");
        } else if (cartItems.length === 0) {
          toast.error("Giỏ hàng trống, không thể tạo thanh toán");
          setPaymentMethod("COD");
        }
      }
    } else {
      // Reset trạng thái khi chuyển sang phương thức khác
      setPaymentCode("");
      setQrUrl("");
      setPayUrl("");
      setIsPaid(false);
    }
  }, [paymentMethod, session?.user?.id, cartItems.length]);

  // --- Đặt hàng: chỉ cho Sepay nếu đã isPaid === true ---
  const handleCheckout = async () => {
    if (!session) {
      signIn(undefined, { callbackUrl: "/checkout" });
      toast.error("Hãy đăng nhập để tiếp tục");
      return;
    }
    if (!name || !phone || (!selectedAddress && !address)) {
      toast.error(
        "Vui lòng đảm bảo có đầy đủ Họ tên, Số điện thoại và Địa chỉ!"
      );
      return;
    }
    if (paymentMethod === "Sepay" && !isPaid) {
      toast.error("Bạn cần thanh toán Sepay trước khi đặt hàng!");
      return;
    }
    const orderData = {
      user: session ? session.user.id : null,
      orderItems: cartItems,
      shippingAddress: selectedAddress
        ? {
          address: `${selectedAddress.address1}, ${selectedAddress.wardName}, ${selectedAddress.districtName}, ${selectedAddress.cityName}`,
        }
        : { address },
      phone,
      name,
      note,
      coupon,
      discount,
      totalPrice,
      totalAfterDiscount: finalTotalAfterDiscount,
      finalTotal,
      shippingFee,
      paymentMethod,
      paymentCode: paymentMethod === "Sepay" ? paymentCode : undefined,
    };
    try {
      await axios.post("/api/checkout", orderData);
      toast.success("Đặt hàng thành công!");
      if (session && session.user && session.user.id) {
        await axios.delete("/api/cart/clear", {
          data: { userId: session.user.id },
        });
      }
      dispatch(
        setCart({
          products: [],
          cartTotal: 0,
          coupon: "",
          discount: 0,
          totalAfterDiscount: 0,
        })
      );
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi khi đặt hàng.");
    }
  };

  // Popup chọn địa chỉ
  const handleChangeAddress = () => {
    setShowAddressPopup(true);
  };
  const handleClosePopup = () => {
    setShowAddressPopup(false);
  };
  const handleConfirmAddress = () => {
    setShowAddressPopup(false);
  };

  // Popup chỉnh sửa/ thêm địa chỉ
  const handleOpenEditAddress = async (addr) => {
    if (addr) {
      setEditAddressData({
        _id: addr._id,
        fullName: addr.fullName,
        phoneNumber: addr.phoneNumber,
        city: addr.city,
        cityName: addr.cityName,
        district: addr.district,
        districtName: addr.districtName,
        ward: addr.ward,
        wardName: addr.wardName,
        address1: addr.address1,
        type: addr.type,
        isDefault: addr.isDefault,
      });
    } else {
      setEditAddressData({
        fullName: "",
        phoneNumber: "",
        city: "",
        cityName: "",
        district: "",
        districtName: "",
        ward: "",
        wardName: "",
        address1: "",
        type: "home",
        isDefault: false,
      });
    }
    setShowEditAddressPopup(true);
  };
  const handleCloseEditAddress = () => {
    setShowEditAddressPopup(false);
  };
  const handleSaveAddress = async () => {
    try {
      toast.success("Lưu địa chỉ thành công!");
      setShowEditAddressPopup(false);
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi khi lưu địa chỉ.");
    }
  };

  // --- CHỨC NĂNG XÓA ĐỊA CHỈ ---
  const handleDeleteAddress = (addressId) => {
    setConfirmDeleteAddress(addressId);
  };

  const confirmDeleteAddressHandler = async () => {
    if (session?.user?.id) {
      try {
        const res = await axios.delete(
          `/api/address?userId=${session.user.id}&addressId=${confirmDeleteAddress}`
        );
        setAddresses(res.data.addresses);
        if (selectedAddress && selectedAddress._id === confirmDeleteAddress) {
          setSelectedAddress(null);
        }
        toast.success("Đã xóa địa chỉ!");
      } catch (error) {
        console.error(error);
        toast.error("Có lỗi khi xóa địa chỉ.");
      }
    } else {
      const newAddresses = addresses.filter(
        (addr) => addr._id !== confirmDeleteAddress
      );
      setAddresses(newAddresses);
      if (selectedAddress && selectedAddress._id === confirmDeleteAddress) {
        setSelectedAddress(newAddresses[0] || null);
      }
      toast.success("Đã xóa địa chỉ!");
    }
    setConfirmDeleteAddress(null);
  };

  const cancelDeleteAddressHandler = () => {
    setConfirmDeleteAddress(null);
  };

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

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

        {/* Modal xác nhận xóa địa chỉ */}
        {confirmDeleteAddress && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-[9999]">
            <div className="bg-white p-4 rounded-lg shadow-lg text-center w-80">
              <p className="mb-4">
                Bạn có chắc chắn muốn xóa địa chỉ này không?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  onClick={confirmDeleteAddressHandler}
                >
                  Đồng ý
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={cancelDeleteAddressHandler}
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Layout 2 cột */}
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cột trái: Sản phẩm */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 text-xl">🛒</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Giỏ hàng</h2>
                <span className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  {cartItems.length} sản phẩm
                </span>
              </div>

              {cartItems.length > 0 ? (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow duration-200" key={item.product}>
                      <div className="flex items-center">
                        <div className="w-20 h-20 flex-shrink-0 relative bg-white rounded-lg overflow-hidden shadow-sm">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={80}
                            height={80}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 text-lg mb-1 truncate">{item.title}</h3>
                          {item.unit && (
                            <p className="text-gray-500 text-sm mb-2">
                              Đơn vị tính: <span className="font-medium text-gray-700">{item.unit}</span>
                            </p>
                          )}
                          <div className="text-green-600 font-bold text-lg">
                            {formatCurrency(item.price)}
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-3">
                          <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                            <button
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-l-lg transition-colors duration-200"
                              onClick={() => handleDecreaseQuantity(item)}
                            >
                              <FiMinus size={16} />
                            </button>
                            <span className="px-4 py-2 font-semibold text-gray-800 min-w-[3rem] text-center">{item.quantity}</span>
                            <button
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-r-lg transition-colors duration-200"
                              onClick={() => handleIncreaseQuantity(item)}
                            >
                              <FiPlus size={16} />
                            </button>
                          </div>
                          <button
                            className="text-red-500 hover:text-red-700 text-sm font-medium hover:bg-red-50 px-3 py-1 rounded-lg transition-colors duration-200"
                            onClick={() => handleRemoveItem(item)}
                          >
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Xóa
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-gray-400 text-3xl">🛒</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Giỏ hàng trống</h3>
                  <p className="text-gray-500 mb-6">
                    Bạn chưa có sản phẩm nào trong giỏ hàng.
                  </p>
                  <Link href="/">
                    <button className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium shadow-md">
                      Tiếp tục mua sắm
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Cột phải: Thanh toán */}
          {cartItems.length > 0 && (
            <div className="col-span-1 bg-gray-50 p-4 rounded-lg shadow-inner">
              <h2 className="text-xl font-semibold mb-1">
                Thông tin thanh toán
              </h2>
              <div className="mb-1">
                {session ? (
                  addresses.length > 0 ? (
                    selectedAddress ? (
                      <div className="border rounded-md p-2 flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-sm">
                            {selectedAddress.fullName || name}
                          </p>
                          <p className="text-gray-600 text-sm">
                            SĐT:{" "}
                            {selectedAddress.phoneNumber
                              ? `(+84) ${selectedAddress.phoneNumber}`
                              : phone}
                          </p>
                          <p className="text-gray-600 text-sm">
                            Địa chỉ: {selectedAddress.address1}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {selectedAddress.wardName},{" "}
                            {selectedAddress.districtName},{" "}
                            {selectedAddress.cityName}
                          </p>
                          {selectedAddress.type === "home" && (
                            <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded mt-1">
                              Nhà riêng
                            </span>
                          )}
                          {selectedAddress.type === "office" && (
                            <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded mt-1">
                              Văn phòng
                            </span>
                          )}
                          {selectedAddress.isDefault && (
                            <span className="inline-block bg-green-100 text-green-600 text-xs px-2 py-1 rounded ml-2">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={handleChangeAddress}
                            className="text-blue-500 hover:underline ml-2 text-sm whitespace-nowrap"
                          >
                            Thay đổi
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-500">
                          Chưa có địa chỉ nào được chọn.
                        </p>
                        <button
                          onClick={handleChangeAddress}
                          className="text-blue-500 hover:underline"
                        >
                          + Thêm địa chỉ mới
                        </button>
                      </div>
                    )
                  ) : (
                    <div>
                      <p className="text-gray-500">Bạn chưa có địa chỉ nào.</p>
                      <button
                        onClick={handleChangeAddress}
                        className="text-blue-500 hover:underline"
                      >
                        + Thêm địa chỉ mới
                      </button>
                    </div>
                  )
                ) : (
                  <div>
                    <p className="text-gray-500">
                      Hãy{" "}
                      <button
                        onClick={() => signIn()}
                        className="text-blue-500 hover:underline"
                      >
                        Đăng nhập
                      </button>{" "}
                      để tiếp tục.
                    </p>
                    <div className="mt-2 flex gap-4">
                      <p className="text-gray-500">
                        Nếu chưa có,{" "}
                        <Link
                          href="/dang-ky"
                          className="text-blue-500 hover:underline"
                        >
                          Đăng ký
                        </Link>{" "}
                        ngay.
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mb-2">
                <label className="block text-gray-600 font-semibold">
                  Phương thức thanh toán
                </label>
                <div className="flex flex-col gap-2 mt-1">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    Thanh toán khi nhận hàng (COD)
                  </label>

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Sepay"
                      checked={paymentMethod === "Sepay"}
                      onChange={() => setPaymentMethod("Sepay")}
                      disabled={loadingPayment}
                      className="mr-2"
                    />
                    Quét mã QR Sepay (chuyển khoản tự động xác nhận)
                    {loadingPayment && paymentMethod === "Sepay" && <span> ...đang tạo mã</span>}
                  </label>
                  {(paymentMethod === "Sepay" || paymentMethod === "MoMo") && paymentCode && (
                    <div className="text-center mt-4 border-2 border-blue-200 p-6 rounded-lg shadow-lg bg-gradient-to-br from-blue-50 to-white">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-lg">
                            {paymentMethod === "Sepay" ? "💳" : "📱"}
                          </span>
                        </div>
                        <h3 className="font-bold text-xl text-blue-700">
                          Thanh toán qua {paymentMethod}
                        </h3>
                      </div>

                      {loadingPayment ? (
                        <div className="py-8">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                          <p className="text-gray-600">Đang tạo thanh toán...</p>
                        </div>
                      ) : (
                        <>
                          <div className="bg-white p-4 rounded-lg shadow-md inline-block">
                            <img
                              src={qrUrl}
                              alt={`QR Code ${paymentMethod}`}
                              className="w-64 h-64 mx-auto border-2 border-gray-200 rounded-lg"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'block';
                              }}
                            />
                            <div className="hidden text-center py-8">
                              <p className="text-red-500 mb-2">Không thể tải mã QR</p>
                              <button
                                onClick={handleCreatePayment}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                              >
                                Thử lại
                              </button>
                            </div>
                          </div>

                          <div className="mt-6 space-y-3">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-sm text-gray-600 mb-1">Số tiền cần thanh toán:</p>
                              <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(finalTotal)}
                              </p>
                            </div>

                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm text-blue-700 mb-1">Mã giao dịch:</p>
                              <p className="font-mono text-sm text-blue-800 bg-white px-2 py-1 rounded">
                                {paymentCode}
                              </p>
                            </div>

                            {paymentMethod === "MoMo" && payUrl && (
                              <div className="bg-pink-50 p-3 rounded-lg">
                                <p className="text-sm text-pink-700 mb-2">Hoặc thanh toán qua app MoMo:</p>
                                <a
                                  href={payUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition-colors"
                                >
                                  📱 Mở app MoMo
                                </a>
                              </div>
                            )}

                            {!isPaid ? (
                              <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
                                <div className="flex items-center justify-center mb-2">
                                  <div className="animate-pulse w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                                  <p className="text-orange-700 font-medium">Đang chờ thanh toán</p>
                                </div>
                                <p className="text-sm text-orange-600 text-center">
                                  {paymentMethod === "Sepay" ? (
                                    <>
                                      📱 Quét mã QR bằng ứng dụng ngân hàng<br />
                                      💳 Hệ thống sẽ tự động xác nhận khi thanh toán thành công
                                    </>
                                  ) : (
                                    <>
                                      📱 Quét mã QR hoặc mở app MoMo<br />
                                      💳 Hệ thống sẽ tự động xác nhận khi thanh toán thành công
                                    </>
                                  )}
                                </p>
                              </div>
                            ) : (
                              <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                                <div className="flex items-center justify-center mb-2">
                                  <span className="text-green-600 text-xl mr-2">✅</span>
                                  <p className="text-green-700 font-bold">Thanh toán thành công!</p>
                                </div>
                                <p className="text-sm text-green-600 text-center">
                                  Bạn có thể tiếp tục đặt hàng
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="mt-4 text-xs text-gray-500">
                            <p>⏰ Mã QR có hiệu lực trong 15 phút</p>
                            <p>🔄 Tự động cập nhật trạng thái thanh toán</p>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="MoMo"
                      checked={paymentMethod === "MoMo"}
                      onChange={() => setPaymentMethod("MoMo")}
                      disabled={loadingPayment}
                      className="mr-2"
                    />
                    Thanh toán qua MoMo (QR Code + App)
                    {loadingPayment && paymentMethod === "MoMo" && <span> ...đang tạo thanh toán</span>}
                  </label>
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-gray-600 mb-1">Ghi chú</label>
                <textarea
                  placeholder="Thời gian giao hàng, yêu cầu đặc biệt..."
                  className="w-full border rounded p-2"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="flex justify-between mb-2">
                <p className="text-gray-600">Tổng tạm tính</p>
                <p className="font-medium">{formatCurrency(totalPrice)}</p>
              </div>

              <div className="mb-2">
                <label className="block text-gray-600">Mã giảm giá</label>
                <div className="relative w-full mt-2 flex gap-2">
                  <div className="relative flex-1">
                    {discount > 0 && (
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center bg-green-500 text-white px-2 py-1 rounded">
                        <span>{coupon.toUpperCase()}</span>
                        <button
                          className="ml-1 hover:text-gray-200"
                          onClick={handleRemoveCoupon}
                        >
                          <AiOutlineClose size={14} />
                        </button>
                      </div>
                    )}
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      placeholder="Nhập mã (VD: ECO10, ECO20...)"
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
                <p className="text-gray-600">Phí vận chuyển</p>
                <p className="font-medium">{formatCurrency(shippingFee)}</p>
              </div>

              <div className="flex justify-between mb-2">
                <p className="text-gray-600 font-semibold">Thành tiền</p>
                <p className="font-bold text-lg">
                  {formatCurrency(finalTotal)}
                </p>
              </div>

              <button
                className="w-full bg-green-500 text-white py-2 rounded-md mt-2 hover:bg-green-600 disabled:bg-gray-400"
                onClick={handleCheckout}
                disabled={paymentMethod === "Sepay" && !isPaid}
              >
                THANH TOÁN
              </button>

            </div>
          )}
        </div>
      </div>

      {/* Popup chọn địa chỉ */}
      <SelectAddressPopup
        isOpen={showAddressPopup}
        onClose={handleClosePopup}
        addresses={addresses}
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        onEditAddress={handleOpenEditAddress}
        onAddNewAddress={() => handleOpenEditAddress(null)}
        onConfirm={handleConfirmAddress}
        onDeleteAddress={handleDeleteAddress}
      />

      {/* Popup chỉnh sửa/ thêm địa chỉ */}
      <EditAddressPopup
        isOpen={showEditAddressPopup}
        onClose={handleCloseEditAddress}
        onSave={handleSaveAddress}
        addressData={editAddressData}
        setAddressData={setEditAddressData}
        refreshAddresses={() => {
          axios.get(`/api/user/${session.user.id}`).then((res) => {
            setAddresses(res.data.address);
            if (res.data.address.length > 0) {
              const defaultAddr =
                res.data.address.find((addr) => addr.isDefault) ||
                res.data.address[0];
              setSelectedAddress(defaultAddr);
            }
          });
        }}
      />
    </>
  );
}
