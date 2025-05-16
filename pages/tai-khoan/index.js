import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Camera, ChevronRight, Bell, Truck, Gift, Heart, Home, Layers, ShoppingCart, User } from "lucide-react";
import { useSession, signIn, signOut } from "next-auth/react";
import axios from "axios";
import UserSidebar from "../../components/users/UserSidebar";
import AddressesTab from "../../components/users/AddressesTab";
import OrdersTab from "../../components/users/OrdersTab";
import ChangePassword from "../../components/users/ChangePassword";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/users/LoadingSpinner";
import Head from "next/head";
import DefaultLayout3 from "../../components/layout/DefaultLayout3";
import LoginComponent from "../../components/ecobacgiang/LoginComponent";
import AccountSettingsList from "../../components/ecobacgiang/AccountSettingsList";

export default function UserProfile() {
  const { data: session, status } = useSession();

  const [selectedTab, setSelectedTab] = useState("account");
  const [tabLoading, setTabLoading] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [gender, setGender] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [initialUserData, setInitialUserData] = useState({});
  const [loginStatus, setLoginStatus] = useState(""); // Added to match LoginComponent
  const [rememberMe, setRememberMe] = useState(false); // Added to match LoginComponent

  const fetchUserData = async () => {
    if (!session || !session.user.id) return;
    try {
      const res = await axios.get(`/api/user/${session.user.id}`);
      const userData = res.data;
      setName(userData.name || "");
      setPhoneNumber(userData.phone || "");
      setEmail(userData.email || "");
      setImage(userData.image || "");
      setGender(userData.gender || "");
      if (userData.dateOfBirth) {
        setSelectedDate(new Date(userData.dateOfBirth));
      } else {
        setSelectedDate(null);
      }
      setInitialUserData({
        name: userData.name || "",
        phone: userData.phone || "",
        email: userData.email || "",
        image: userData.image || "",
        gender: userData.gender || "",
        dateOfBirth: userData.dateOfBirth
          ? new Date(userData.dateOfBirth).toISOString()
          : null,
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Có lỗi khi lấy thông tin tài khoản!");
    }
  };

  useEffect(() => {
    if (session && session.user) {
      fetchUserData();
    }
  }, [session]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      toast.error("Kích thước file không được vượt quá 5MB!");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ hỗ trợ file JPEG, JPG, PNG, WEBP!");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post("/api/image?type=avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { src } = res.data;
      setImage(src);
      toast.success("Upload ảnh đại diện thành công!");
    } catch (error) {
      console.error("Error uploading avatar:", error);
      const errorMessage = error.response?.data?.error || "Lỗi khi upload ảnh đại diện";
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!session || !session.user.id) return;
    const updatedUser = {
      name,
      phone: phoneNumber,
      email,
      image,
      gender,
      dateOfBirth: selectedDate,
    };

    const isDataChanged =
      updatedUser.name !== initialUserData.name ||
      updatedUser.phone !== initialUserData.phone ||
      updatedUser.email !== initialUserData.email ||
      updatedUser.image !== initialUserData.image ||
      updatedUser.gender !== initialUserData.gender ||
      ((updatedUser.dateOfBirth && updatedUser.dateOfBirth.toISOString()) || null) !==
      initialUserData.dateOfBirth;

    if (!isDataChanged) {
      toast("Không có gì thay đổi", { icon: "ℹ️" });
      return;
    }

    try {
      setLoading(true);
      await axios.put(`/api/user/${session.user.id}`, updatedUser);
      toast.success("Cập nhật thông tin thành công!");
      fetchUserData();
    } catch (error) {
      console.error("Error updating user info:", error);
      toast.error("Có lỗi khi cập nhật thông tin!");
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabName) => {
    setTabLoading(true);
    setSelectedTab(tabName);
    setTimeout(() => {
      setTabLoading(false);
    }, 500);
  };

  const handleLogin = async (values, { setSubmitting }) => {
    setLoginStatus("Đang đăng nhập...");
    setSubmitting(true);

    try {
      const isPhone = /^[0-9]{10,11}$/.test(values.login_email);
      const res = await signIn("credentials", {
        redirect: false,
        email: isPhone ? null : values.login_email,
        phone: isPhone ? values.login_email : null,
        password: values.login_password,
        callbackUrl: "/dashboard",
      });

      if (res?.error) {
        const errorMessages = {
          CredentialsSignin: "Email hoặc mật khẩu không đúng.",
          Default: "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.",
        };
        const errorMessage = errorMessages[res.error] || errorMessages.Default;
        setLoginStatus(`Lỗi: ${errorMessage}`);
        toast.error(errorMessage);
      } else {
        setLoginStatus("Đăng nhập thành công!");
        toast.success("Đăng nhập thành công!");
        if (rememberMe) {
          localStorage.setItem("savedEmail", values.login_email);
        } else {
          localStorage.removeItem("savedEmail");
        }
      }
    } catch (error) {
      setLoginStatus(`Lỗi: ${error.message || "Đã xảy ra lỗi khi đăng nhập"}`);
      toast.error(error.message || "Đã xảy ra lỗi");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSocialLogin = async (providerId) => {
    setLoginStatus(`Đang đăng nhập bằng ${providerId}...`);
    try {
      const res = await signIn(providerId, { redirect: false, callbackUrl: "/dashboard" });
      if (res?.error) {
        setLoginStatus(`Lỗi: ${res.error}`);
        toast.error(`Lỗi khi đăng nhập bằng ${providerId}: ${res.error}`);
      } else {
        setLoginStatus("Đăng nhập thành công!");
        toast.success(`Đăng nhập bằng ${providerId} thành công!`);
      }
    } catch (error) {
      setLoginStatus(`Lỗi: ${error.message || "Đã xảy ra lỗi khi đăng nhập"}`);
      toast.error(`Lỗi khi đăng nhập bằng ${providerId}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false, callbackUrl: "/" });
      toast.success("Đăng xuất thành công!");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Có lỗi khi đăng xuất!");
    }
  };

  const renderContent = () => {
    if (tabLoading) return <LoadingSpinner />;
    switch (selectedTab) {
      case "account":
        return (
          <div className="md:p-4">
            <h2 className="text-xl font-semibold mb-4 hidden md:block">Thông tin tài khoản</h2>
            <div className="mb-4 flex items-center flex-col md:flex-row">
              <div className="relative w-24 h-24">
                {image ? (
                  <img
                    src={image}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full aspect-square"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full text-gray-400 aspect-square">
                    Ảnh
                  </div>
                )}
                <label
                  htmlFor="avatarInput"
                  className="absolute bottom-1 right-1 w-8 h-8 bg-white flex items-center justify-center rounded-full cursor-pointer border border-gray-300 hover:bg-gray-100 transition-colors"
                  title="Thay đổi ảnh đại diện"
                >
                  <Camera size={16} className="text-gray-600" />
                </label>
                <input
                  id="avatarInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
              {uploading && (
                <p className="text-sm text-gray-500 ml-2 mt-2 md:mt-0 md:ml-4">
                  Đang upload ảnh...
                </p>
              )}
              <div className="md:ml-4 flex w-full items-center gap-2 mt-4 md:mt-0">
                <label className="font-medium">Họ & Tên:</label>
                <input
                  className="border rounded p-2 w-full md:w-auto"
                  placeholder="Nhập họ tên"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full">
              <div className="mb-4">
                <label className="font-medium mb-1">Số điện thoại</label>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="Nhập số điện thoại"
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="font-medium mb-1">Địa chỉ email</label>
                <input
                  className="w-full border p-2 rounded cursor-not-allowed bg-gray-100"
                  placeholder="Nhập email"
                  type="email"
                  value={email}
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="font-medium mb-1 mr-4">Ngày sinh:</label>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="border p-2 rounded w-full"
                  placeholderText="Chọn ngày sinh"
                />
              </div>
              <div className="mb-4">
                <span className="font-medium mr-4">Giới tính:</span>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    className="mr-2"
                    value="Nam"
                    checked={gender === "Nam"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Nam
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="gender"
                    className="mr-2"
                    value="Nữ"
                    checked={gender === "Nữ"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Nữ
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="gender"
                    className="mr-2"
                    value="Khác"
                    checked={gender === "Khác"}
                    onChange={(e) => setGender(e.target.value)}
                  />
                  Khác
                </label>
              </div>
              <button
                className="bg-blue-500 text-white rounded px-6 py-2 w-full md:w-auto"
                onClick={handleSave}
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        );
      case "notifications":
        return <div>Đây là trang Thông báo của tôi</div>;
      case "orders":
        return <OrdersTab />;
      case "returns":
        return <div>Đây là trang Quản lý đổi trả</div>;
      case "addresses":
        return <AddressesTab userId={session.user.id} />;
      case "payment":
        return <div>Đây là trang Thông tin thanh toán</div>;
      case "change-password":
        return <ChangePassword />;
      default:
        return <div>Chọn mục bên trái.</div>;
    }
  };

  if (status === "loading" || loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <LoginComponent handleLogin={handleLogin} handleSocialLogin={handleSocialLogin} />;
  }

  return (
    <DefaultLayout3>
      <div className="h-[80px] bg-white md:block hidden"></div>
      <Head>
        <title>Thông tin tài khoản | Eco Bắc Giang</title>
        <meta
          name="description"
          content="Trang thông tin tài khoản của bạn, nơi bạn có thể quản lý thông tin cá nhân, đơn hàng và địa chỉ giao hàng."
        />
        <meta
          name="keywords"
          content="tài khoản, thông tin cá nhân, đơn hàng, địa chỉ giao hàng"
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Thông tin tài khoản | Tên Website"
        />
        <meta
          property="og:description"
          content="Trang thông tin tài khoản của bạn, nơi bạn có thể quản lý thông tin cá nhân, đơn hàng và địa chỉ giao hàng."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://example.com/tai-khoan" />
        <meta
          property="og:image"
          content="https://example.com/static/account.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Thông tin tài khoản | Tên Website"
        />
        <meta
          name="twitter:description"
          content="Trang thông tin tài khoản của bạn, nơi bạn có thể quản lý thông tin cá nhân, đơn hàng và địa chỉ giao hàng."
        />
        <meta
          name="twitter:image"
          content="https://example.com/static/account.jpg"
        />
      </Head>
      {/* Mobile Layout */}
      <div className="md:hidden min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-green-600 text-white p-4 flex flex-col items-start">
          <div className="flex items-center w-full">
            <ChevronRight className="w-6 h-6 transform rotate-180" />
            <h1 className="text-lg font-semibold flex-1 text-center">Thông tin tài khoản</h1>
            <Bell className="w-6 h-6 relative" />
            <span className="absolute top-5 right-5 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">12</span>
          </div>
          <div className="flex items-center mt-4">
            <div className="w-12 h-12 rounded-full overflow-hidden">
              {image ? (
                <img
                  src={image}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                  Ảnh
                </div>
              )}
            </div>
            <div className="ml-4">
              <p className="font-semibold">{name || "Ngô Quang Trường"}</p>
              <p className="text-sm">{email || "truong@truongnq.vn"}</p>
            </div>
          </div>
        </div>
        {/* Navigation Buttons */}
        <div className="flex justify-around p-4 bg-white rounded-lg mx-4 mt-4 shadow">
          <button className="flex flex-col items-center" onClick={() => handleTabClick("orders")}>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Truck className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm mt-1">Đơn hàng</span>
          </button>
          <button className="flex flex-col items-center" onClick={() => handleTabClick("returns")}>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <Gift className="w-5 h-5 text-red-500" />
            </div>
            <span className="text-sm mt-1">Quà tặng</span>
          </button>
          <button className="flex flex-col items-center" onClick={() => handleTabClick("favorites")}>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-sm mt-1">Đã thích</span>
          </button>
        </div>
        {/* Account Settings List */}
        <AccountSettingsList handleTabClick={handleTabClick} onSignOut={handleSignOut} />
        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-t p-2 flex justify-around">
          <button className="flex flex-col items-center">
            <Home className="w-6 h-6 text-gray-500" />
            <span className="text-xs text-gray-500">Trang chủ</span>
          </button>
          <button className="flex flex-col items-center">
            <Layers className="w-6 h-6 text-gray-500" />
            <span className="text-xs text-gray-500">Danh mục</span>
          </button>
          <button className="flex flex-col items-center">
            <ShoppingCart className="w-6 h-6 text-gray-500" />
            <span className="text-xs text-gray-500">Giỏ hàng</span>
          </button>
          <button className="flex flex-col items-center">
            <User className="w-6 h-6 text-green-600" />
            <span className="text-xs text-green-600">Tài khoản</span>
          </button>
        </div>
      </div>
      {/* Desktop Layout */}
      <div className="hidden md:block min-h-screen bg-gray-100 p-4 md:p-6">
        <div className="bg-white shadow rounded-lg p-4 md:p-6 flex flex-col md:flex-row">
          <UserSidebar
            selectedTab={selectedTab}
            onTabClick={handleTabClick}
            userName={session.user.name}
            userImage={session.user.image}
          />
          <div className="flex-grow md:ml-6">
            {renderContent()}
          </div>
        </div>
      </div>
    </DefaultLayout3>
  );
}