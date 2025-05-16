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
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Mặc định là COD
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState("");

  const discountAmount = (totalPrice * reduxDiscount) / 100;
  const finalTotalAfterDiscount =
    totalAfterDiscount || totalPrice - discountAmount;
  const shippingFee = 30000; // 30.000 VND
  const finalTotal = finalTotalAfterDiscount + shippingFee;

  // Thông tin chuyển khoản
  const bankInfo = {
    bankId: "TCB", // Mã ngân hàng (VD: Vietcombank = "VCB", Techcombank = "TCB", BIDV = "BIDV")
    bankName: "Ngân hàng Techcombank", // Tên ngân hàng đầy đủ
    bankAccount: "8270188888", // Số tài khoản nhận tiền
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
      const amount = finalTotal; // Số tiền thanh toán
      const customerName = session?.user?.name
        ? removeVietnameseTones(session.user.name)
        : " ";
      const message = `Thanh toan ${customerName} - ${Date.now()}`; // Nội dung không dấu

      const qrCodeUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${
        bankInfo.bankAccount
      }-qr_only.png?amount=${amount}&addInfo=${encodeURIComponent(message)}`;
      setQrUrl(qrCodeUrl);
      setShowQR(true);
    } else {
      setShowQR(false);
    }
  }, [paymentMethod, totalPrice, session?.user?.name]);

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

  // Đặt hàng
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
      paymentMethod, // Gửi phương thức thanh toán
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
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Cột trái: Sản phẩm */}
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
                        <p className="text-gray-500 text-sm">
                          Đơn vị tính: {item.unit}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {formatCurrency(item.price)}
                      </p>
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
                        onClick={() => handleRemoveItem(item)}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">
                  Giỏ hàng của bạn đang trống.
                </p>
                <Link href="/">
                  <button className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">
                    Tiếp tục mua sắm
                  </button>
                </Link>
              </div>
            )}
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
                      value="BankTransfer"
                      checked={paymentMethod === "BankTransfer"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    Chuyển khoản ngân hàng
                  </label>
                  {paymentMethod === "BankTransfer" && showQR && (
                    <div className="text-center mt-4 border p-4 rounded-md shadow-md">
                      <p className="font-semibold text-lg text-blue-600">
                        Quét mã QR để thanh toán
                      </p>
                      <img
                        src={qrUrl}
                        alt="QR Code"
                        className="w-56 h-56 mx-auto border p-2 shadow-md"
                      />

                      <div className="mt-4 text-left text-sm">
                        <p>
                          <strong>💰 Số tiền:</strong>{" "}
                          {finalTotal.toLocaleString()} VND
                        </p>
                        <p>
                          <strong>🏦 Ngân hàng:</strong> {bankInfo.bankName}
                        </p>
                        <p className="">
                          <strong>📌 Số tài khoản:</strong>{" "}
                          {bankInfo.bankAccount}
                        </p>
                        <p className="">
                          <strong>👤 Tên người nhận:</strong>{" "}
                          {bankInfo.accountName}
                        </p>
                        <p>
                          <strong className="text-sm">
                            📝 Nội dung chuyển khoản:
                          </strong>{" "}
                          <span className="text-red-500">
                            {`Thanh toan ${
                              session?.user?.name
                                ? removeVietnameseTones(session.user.name)
                                : " "
                            } - ${Date.now()}`}
                          </span>
                        </p>
                      </div>

                      <p className="text-gray-500 text-sm mt-2">
                        Vui lòng chuyển khoản chính xác số tiền và nội dung.
                      </p>
                    </div>
                  )}

                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="MoMo"
                      checked={paymentMethod === "MoMo"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-2"
                    />
                    Thanh toán qua MoMo
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
                className="w-full bg-green-500 text-white py-2 rounded-md mt-2 hover:bg-green-600"
                onClick={handleCheckout}
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
