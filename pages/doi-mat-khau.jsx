import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { getSession } from "next-auth/react";
import Router from "next/router";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

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

      <section
        className="min-h-screen flex items-center justify-center relative"
        style={{
          backgroundImage: `url('/dang-ky.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-70"></div>

        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md relative z-10 opacity-90">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Đổi mật khẩu</h2>

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
                  <label className="block text-white text-sm mb-2">
                    Mật khẩu hiện tại <span className="text-orange-500">*</span>
                  </label>
                  <div className="flex items-center border border-gray-600 rounded-lg bg-gray-800 gap-4">
                    <span className="pl-3 text-orange-500">
                      <FaLock />
                    </span>
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={values.currentPassword}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Mật khẩu hiện tại"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleCurrentPasswordVisibility}
                      className="pr-3 text-gray-400 hover:text-white"
                    >
                      {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.currentPassword && touched.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                  )}
                </div>

                {/* New Password */}
                <div className="relative">
                  <label className="block text-white text-sm mb-2">
                    Mật khẩu mới <span className="text-orange-500">*</span>
                  </label>
                  <div className="flex items-center border border-gray-600 rounded-lg bg-gray-800 gap-4">
                   

                    <span className="pl-3 text-orange-500">
                      <FaLock />
                    </span>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={values.newPassword}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Mật khẩu mới"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleNewPasswordVisibility}
                      className="pr-3 text-gray-400 hover:text-white"
                    >
                      {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.newPassword && touched.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div className="relative">
                  <label className="block text-white text-sm mb-2">
                    Xác nhận mật khẩu mới <span className="text-orange-500">*</span>
                  </label>
                  <div className="flex items-center border border-gray-600 rounded-lg bg-gray-800 gap-4">
                    <span className="pl-3 text-orange-500">
                      <FaLock />
                    </span>
                    <input
                      type={showConfirmNewPassword ? "text" : "password"}
                      name="confirmNewPassword"
                      value={values.confirmNewPassword}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Xác nhận mật khẩu mới"
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmNewPasswordVisibility}
                      className="pr-3 text-gray-400 hover:text-white"
                    >
                      {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmNewPassword && touched.confirmNewPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmNewPassword}</p>
                  )}
                </div>

                {/* Status Message */}
                {status && (
                  <p
                    className={`text-center ${
                      status.includes("thành công") ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {status}
                  </p>
                )}
                {success && <p className="text-center text-green-500">{success}</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Đổi mật khẩu
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </section>
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