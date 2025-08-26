import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { getSession } from "next-auth/react";
import Router from "next/router";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Shield, Key, CheckCircle, AlertCircle } from "lucide-react";

// Schema validation với Yup
const changePasswordValidation = Yup.object({
  currentPassword: Yup.string()
    .required("Vui lòng nhập mật khẩu hiện tại.")
    .min(6, "Mật khẩu hiện tại phải có ít nhất 6 ký tự."),
  newPassword: Yup.string()
    .required("Vui lòng nhập mật khẩu mới.")
    .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự.")
    .notOneOf([Yup.ref("currentPassword")], "Mật khẩu mới không được trùng với mật khẩu hiện tại."),
  confirmNewPassword: Yup.string()
    .required("Vui lòng xác nhận mật khẩu mới.")
    .oneOf([Yup.ref("newPassword"), null], "Mật khẩu xác nhận không khớp."),
});

export default function ChangePassword() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [status, setStatus] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((prev) => !prev);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const toggleConfirmNewPasswordVisibility = () => {
    setShowConfirmNewPassword((prev) => !prev);
  };

  const changePasswordHandler = async (values, setSubmitting) => {
    try {
      setStatus("Đang đổi mật khẩu...");
      console.log("Submitting change password:", values); // Debug
      const { data } = await axios.post(
        `${baseUrl}/api/auth/change-password`,
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmNewPassword: values.confirmNewPassword,
        },
        { withCredentials: true } // Gửi cookie xác thực
      );
      console.log("Change password response:", data); // Debug
      setSuccess(data.message);
      setError("");
      setStatus("Đổi mật khẩu thành công!");
      toast.success("Đổi mật khẩu thành công!");
      setSubmitting(false);
      setTimeout(() => {
        Router.push("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Change password error:", error.response?.data || error.message);
      setStatus("");
      setSuccess("");
      setError(error.response?.data?.message || "Đã xảy ra lỗi.");
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi.");
      setSubmitting(false);
      setTimeout(() => {
        setError("");
      }, 3000);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-gray-200">
          <div className="p-3 bg-green-100 rounded-xl">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Đổi mật khẩu</h2>
            <p className="text-gray-600 mt-1">Cập nhật mật khẩu tài khoản của bạn</p>
          </div>
        </div>

        <Formik
          initialValues={{
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
          }}
          validationSchema={changePasswordValidation}
          validateOnChange={true}
          validateOnBlur={true}
          onSubmit={(values, { setSubmitting }) => {
            console.log("Form values:", values); // Debug
            changePasswordHandler(values, setSubmitting);
          }}
        >
          {({ values, handleChange, errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              {/* Current Password */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Key className="w-4 h-4 mr-2 text-green-600" />
                  Mật khẩu hiện tại <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={values.currentPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Nhập mật khẩu hiện tại"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleCurrentPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.currentPassword && touched.currentPassword && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.currentPassword}
                  </div>
                )}
              </div>

              {/* New Password */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Key className="w-4 h-4 mr-2 text-green-600" />
                  Mật khẩu mới <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={values.newPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Nhập mật khẩu mới"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleNewPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.newPassword && touched.newPassword && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.newPassword}
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Key className="w-4 h-4 mr-2 text-green-600" />
                  Xác nhận mật khẩu mới <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showConfirmNewPassword ? "text" : "password"}
                    name="confirmNewPassword"
                    value={values.confirmNewPassword}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                    placeholder="Xác nhận mật khẩu mới"
                    required
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmNewPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.confirmNewPassword && touched.confirmNewPassword && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.confirmNewPassword}
                  </div>
                )}
              </div>

              {/* Status Messages */}
              {status && (
                <div className={`p-4 rounded-lg border ${
                  status.includes("thành công") 
                    ? "bg-green-50 border-green-200 text-green-800" 
                    : "bg-blue-50 border-blue-200 text-blue-800"
                }`}>
                  <div className="flex items-center">
                    {status.includes("thành công") ? (
                      <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    ) : (
                      <div className="w-5 h-5 mr-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    )}
                    <span className="font-medium">{status}</span>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center text-green-800">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                    <span className="font-medium">{success}</span>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center text-red-800">
                    <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                    <span className="font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Đổi mật khẩu
                    </>
                  )}
                </button>
              </div>

              {/* Security Tips */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Lưu ý bảo mật
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Mật khẩu phải có ít nhất 6 ký tự</li>
                  <li>• Không sử dụng mật khẩu cũ</li>
                  <li>• Chọn mật khẩu khó đoán</li>
                </ul>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const session = await getSession({ req });
  console.log("Change password session:", session); // Debug

  if (!session) {
    console.log("Redirecting to login");
    return {
      redirect: {
        destination: "/dang-nhap",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}