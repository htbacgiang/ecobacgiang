import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Camera, ChevronRight, Bell, Truck, Gift, Heart, Home, Layers, ShoppingCart, User, ArrowLeft, Settings, Edit3, MapPin, FileText, CreditCard } from "lucide-react";
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
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
    setShowMobileMenu(false);
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
           <div className="p-4 md:p-6">
             <div className="md:hidden mb-3">
               <h2 className="text-xl font-bold text-gray-900 mb-1">Thông tin tài khoản</h2>
               <p className="text-gray-600 text-sm">Cập nhật thông tin cá nhân của bạn</p>
             </div>

             {/* Avatar Section */}
             <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-3 md:p-4 mb-4 md:mb-6 shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
                <div className="relative">
                  <div className="w-20 h-20 md:w-28 md:h-28 lg:w-24 lg:h-24 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl ring-4 ring-green-100">
                    {image ? (
                      <img
                        src={image}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-2xl md:text-3xl font-bold">
                        {name ? name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                  <label
                    htmlFor="avatarInput"
                    className="absolute -bottom-0 -right-2 w-7 h-7 md:w-10 md:h-10 bg-white rounded-full shadow-xl flex items-center justify-center cursor-pointer border-2 border-green-500 hover:bg-green-50 transition-all duration-300 hover:scale-110"
                    title="Thay đổi ảnh đại diện"
                  >
                    <Camera size={18} className="text-green-600" />
                  </label>
                  <input
                    id="avatarInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
           
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">{name || "Chưa có tên"}</h3>
                  <p className="text-gray-600">{email || "Chưa có email"}</p>
                </div>
                {uploading && (
                  <div className="flex items-center gap-2 md:gap-3 text-sm text-gray-600 bg-green-50 px-3 md:px-4 py-2 rounded-full">
                    <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    Đang upload ảnh...
                  </div>
                )}
              </div>
            </div>

                         {/* Form Section */}
             <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
               <div className="space-y-3 md:space-y-4">
                {/* Name Field */}
                                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">
                     Họ và tên <span className="text-red-500">*</span>
                   </label>
                   <div className="relative">
                     <input
                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 placeholder-gray-400 text-base"
                       placeholder="Nhập họ và tên của bạn"
                       type="text"
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                     />
                     <Edit3 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                   </div>
                 </div>

                {/* Phone Field */}
                                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">
                     Số điện thoại <span className="text-red-500">*</span>
                   </label>
                   <div className="relative">
                     <input
                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 placeholder-gray-400 text-base"
                       placeholder="Nhập số điện thoại"
                       type="tel"
                       value={phoneNumber}
                       onChange={(e) => setPhoneNumber(e.target.value)}
                     />
                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                         <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                       </svg>
                     </div>
                   </div>
                 </div>

                {/* Email Field */}
                                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">
                     Địa chỉ email
                   </label>
                   <div className="relative">
                     <input
                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 cursor-not-allowed text-gray-500 text-base"
                       placeholder="Email của bạn"
                       type="email"
                       value={email}
                       disabled
                     />
                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                         <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                         <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                       </svg>
                     </div>
                   </div>
                   <p className="text-sm text-gray-500 mt-2 flex items-center">
                     <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                     </svg>
                     Email không thể thay đổi
                   </p>
                 </div>

                {/* Date of Birth Field */}
                                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">
                     Ngày sinh
                   </label>
                   <div className="relative">
                     <DatePicker
                       selected={selectedDate}
                       onChange={handleDateChange}
                       dateFormat="dd/MM/yyyy"
                       className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 placeholder-gray-400 text-base"
                       placeholderText="Chọn ngày sinh"
                     />
                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                         <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                       </svg>
                     </div>
                   </div>
                 </div>

                {/* Gender Field */}
                                 <div>
                   <label className="block text-sm font-semibold text-gray-700 mb-2">
                     Giới tính
                   </label>
                   <div className="flex flex-wrap gap-3">
                     {["Nam", "Nữ", "Khác"].map((option) => (
                       <label
                         key={option}
                         className={`flex items-center px-4 py-2 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${gender === option
                             ? "border-green-500 bg-green-50 text-green-700 shadow-lg"
                             : "border-gray-200 hover:border-gray-300 bg-white"
                           }`}
                       >
                         <input
                           type="radio"
                           name="gender"
                           className="sr-only"
                           value={option}
                           checked={gender === option}
                           onChange={(e) => setGender(e.target.value)}
                         />
                         <span className="font-semibold text-base">{option}</span>
                       </label>
                     ))}
                   </div>
                 </div>

                                 {/* Save Button */}
                 <div className="pt-4">
                   <button
                     className={`w-full md:w-auto px-6 md:px-8 py-3 rounded-xl font-bold text-base transition-all duration-300 transform hover:scale-105 ${loading
                         ? "bg-gray-400 cursor-not-allowed"
                         : "bg-green-600 hover:bg-green-700 text-white shadow-xl hover:shadow-2xl"
                       }`}
                     onClick={handleSave}
                     disabled={loading}
                   >
                     {loading ? (
                       <div className="flex items-center justify-center gap-2">
                         <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                         Đang lưu...
                       </div>
                     ) : (
                       "Lưu thay đổi"
                     )}
                   </button>
                 </div>
              </div>
            </div>
          </div>
        );
      case "notifications":
        return (
          <div className="p-4 md:p-8">
            <div className="md:hidden mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Thông báo</h2>
              <p className="text-gray-600">Quản lý thông báo từ hệ thống</p>
            </div>
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Cài đặt thông báo</h3>
              <div className="space-y-4 md:space-y-6">
                <div className="flex items-center justify-between p-4 md:p-6 border-2 border-gray-200 rounded-xl md:rounded-2xl hover:border-gray-300 transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-green-100 flex items-center justify-center mr-3 md:mr-4">
                      <Bell className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base md:text-lg">Thông báo đơn hàng</h4>
                      <p className="text-gray-600 text-sm md:text-base">Nhận thông báo khi đơn hàng có cập nhật</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" id="notifications" />
                    <label htmlFor="notifications" className="block w-12 h-6 md:w-14 md:h-7 bg-gray-200 rounded-full cursor-pointer transition-colors duration-200">
                      <div className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow transform transition-transform duration-200 translate-x-1 translate-y-1"></div>
                    </label>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 md:p-6 border-2 border-gray-200 rounded-xl md:rounded-2xl hover:border-gray-300 transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl bg-green-100 flex items-center justify-center mr-3 md:mr-4">
                      <Bell className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-base md:text-lg">Thông báo khuyến mãi</h4>
                      <p className="text-gray-600 text-sm md:text-base">Nhận thông báo về các chương trình khuyến mãi</p>
                    </div>
                  </div>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" id="promotions" defaultChecked />
                    <label htmlFor="promotions" className="block w-12 h-6 md:w-14 md:h-7 bg-green-500 rounded-full cursor-pointer transition-colors duration-200">
                      <div className="w-4 h-4 md:w-5 md:h-5 bg-white rounded-full shadow transform transition-transform duration-200 translate-x-6 md:translate-x-8 translate-y-1"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "orders":
        return <OrdersTab />;

      case "addresses":
        return <AddressesTab userId={session.user.id} />;
      case "payment":
        return (
          <div className="p-4 md:p-8">
            <div className="md:hidden mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Phương thức thanh toán</h2>
              <p className="text-gray-600">Quản lý thẻ và ví điện tử</p>
            </div>
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
              <div className="text-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <CreditCard className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Chưa có phương thức thanh toán</h3>
                <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg">Thêm thẻ hoặc ví điện tử để thanh toán nhanh chóng</p>
                <button className="bg-green-600  text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-base md:text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-105 shadow-xl">
                  Thêm phương thức thanh toán
                </button>
              </div>
            </div>
          </div>
        );
      case "change-password":
        return <ChangePassword />;

      default:
        return (
          <div className="p-4 md:p-8">
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <User className="w-10 h-10 md:w-12 md:h-12 text-green-600" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4">Chào mừng!</h3>
              <p className="text-gray-600 text-base md:text-lg">Vui lòng chọn mục bên trái để bắt đầu.</p>
            </div>
          </div>
        );
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
      <div className="md:hidden min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-br from-green-600 via-green-500 to-green-700 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
            <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -translate-x-8 -translate-y-8"></div>
          </div>

          <div className="relative p-6">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => window.location.href = '/'}
                className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm shadow-lg"
              >
                <Home size={20} />
              </button>
              <h1 className="text-xl font-bold">Tài khoản</h1>
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-3 rounded-2xl bg-white/20 hover:bg-white/30 transition-all duration-300 backdrop-blur-sm shadow-lg"
              >
                <Settings size={20} />
              </button>
            </div>

            {/* User Info Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-white/20 flex items-center justify-center ring-4 ring-white/30 shadow-lg">
                    {image ? (
                      <img
                        src={image}
                        alt="User Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                        {name ? name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="font-bold text-lg text-white">{name || "Người dùng"}</p>
                  <p className="text-sm text-white/90">{email || "user@example.com"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="bg-white border-b border-gray-200 shadow-2xl">
            <AccountSettingsList handleTabClick={handleTabClick} onSignOut={handleSignOut} />
          </div>
        )}

        {/* Content Area */}
        <div className="pb-24 px-4">
          <div className="mt-6">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-8">
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
            <div className="flex">
              <div className="w-80 bg-gradient-to-b from-gray-50 to-white border-r border-gray-100">
                <UserSidebar
                  selectedTab={selectedTab}
                  onTabClick={handleTabClick}
                  userName={session.user.name}
                  userImage={session.user.image}
                />
              </div>
              <div className="flex-1 bg-white">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout3>
  );
}