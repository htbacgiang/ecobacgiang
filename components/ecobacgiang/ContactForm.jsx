"use client";
import { useState, useEffect, useRef } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");
  const [errors, setErrors] = useState({});
  const leftSectionRef = useRef(null);
  const rightSectionRef = useRef(null);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập họ và tên";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^\d{10,11}$/.test(formData.phone))
      newErrors.phone = "Số điện thoại phải có 10-11 chữ số";
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    if (!formData.message.trim()) newErrors.message = "Vui lòng nhập yêu cầu tư vấn";
    else if (formData.message.length > 500)
      newErrors.message = "Tin nhắn không được vượt quá 500 ký tự";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("slide-up");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    const leftSection = leftSectionRef.current;
    const rightSection = rightSectionRef.current;

    if (rightSection) observer.observe(rightSection);
    if (leftSection && window.innerWidth >= 768) observer.observe(leftSection);

    return () => {
      if (rightSection) observer.unobserve(rightSection);
      if (leftSection) observer.unobserve(leftSection);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setStatus("Đang gửi...");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setStatus("Đăng ký tư vấn thành công!");
        setFormData({ name: "", phone: "", email: "", message: "" });
        setTimeout(() => setStatus(""), 3000);
      } else {
        throw new Error(result.message || "Không thể gửi yêu cầu");
      }
    } catch (error) {
      setStatus("Lỗi: Vui lòng thử lại hoặc liên hệ qua hotline.");
    }
  };

  return (
    <div className="">
      <div className="max-w-8xl mx-auto">
        <div className="bg-gray-50 borde rounded-3xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div ref={leftSectionRef} className="opacity-0 md:block hidden">
              <h2 className="text-xl font-semibold text-[#105d97] uppercase tracking-wide mb-2">
                Đăng ký tư vấn
              </h2>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Nâng tầm phong cách với Đồng phục Univi
              </h3>
              <p className="text-lg text-gray-600">
                Đồng phục Univi mang đến trang phục thể thao chất lượng cao cho gym, yoga, chạy bộ và golf. Với công nghệ UNI DRY thoáng khí và chất liệu an toàn, không chứa formaldehyde hay Azo, chúng tôi đảm bảo sự thoải mái và hiệu suất tối ưu.
              </p>
              <p>
                Liên hệ ngay để nhận tư vấn về đồng phục thể thao phù hợp với bạn!
              </p>
            </div>

            <div ref={rightSectionRef} className="opacity-0">
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                role="form"
                aria-label="Form đăng ký tư vấn đồng phục Univi"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                 
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Họ và tên"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.name ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.name && (
                      <p id="name-error" className="text-red-500 text-sm mt-1">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                   
                    <input
                      id="phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Số điện thoại"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? "phone-error" : undefined}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.phone && (
                      <p id="phone-error" className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email của bạn (tùy chọn)"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-red-500 text-sm mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Yêu cầu tư vấn của bạn (ví dụ: đồng phục học sinh, đồng phục công ty, số lượng 100 áo...)"
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-32 resize-none ${
                      errors.message ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.message && (
                    <p id="message-error" className="text-red-500 text-sm mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={status === "Đang gửi..."}
                  className="w-full bg-[#105d97] text-white font-semibold py-3 rounded-full hover:bg-blue-500 transition-colors disabled:bg-gray-300 flex items-center justify-center gap-2"
                  aria-disabled={status === "Đang gửi..."}
                >
                  Đăng ký tư vấn <span>→</span>
                </button>
              </form>
              {status && (
                <p
                  className={`mt-2 text-center ${
                    status.includes("thành công") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {status}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .opacity-0 {
          opacity: 0;
        }
        .slide-up {
          animation: slideUp 0.6s ease-out forwards;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}