import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import debounce from "lodash/debounce";

// TypeScript-like interface for type safety
const Coupon = {
  _id: String,
  coupon: String,
  startDate: String,
  endDate: String,
  discount: Number,
};

const CouponForm = () => {
  const [coupon, setCoupon] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const [couponsLoading, setCouponsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);

  // Debounced input handlers
  const debouncedSetCoupon = useCallback(
    debounce((value) => setCoupon(value), 300),
    []
  );
  const debouncedSetDiscount = useCallback(
    debounce((value) => setDiscount(value), 300),
    []
  );

  // Format date utility
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  // Fetch coupons
  const fetchCoupons = async () => {
    setCouponsLoading(true);
    try {
      const res = await axios.get("/api/coupon");
      setCoupons(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi lấy danh sách phiếu giảm giá");
    } finally {
      setCouponsLoading(false);
    }
  };

  // Auto-fetch coupons on mount
  useEffect(() => {
    fetchCoupons();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (new Date(startDate) > new Date(endDate)) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu");
      return;
    }
    if (Number(discount) <= 0 || Number(discount) > 100) {
      toast.error("Giảm giá phải từ 1 đến 100");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/coupon", {
        coupon,
        startDate,
        endDate,
        discount: Number(discount),
      });
      toast.success("Tạo phiếu giảm giá thành công!");
      setCoupon("");
      setStartDate("");
      setEndDate("");
      setDiscount("");
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Lỗi khi tạo phiếu giảm giá");
    } finally {
      setLoading(false);
    }
  };

  // Handle coupon deletion
  const handleDelete = async (couponId) => {
    try {
      await axios.delete(`/api/coupon/${couponId}`);
      toast.success("Đã xóa phiếu giảm giá!");
      fetchCoupons();
    } catch (error) {
      toast.error("Lỗi khi xóa phiếu giảm giá");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100">
      {/* Header Section */}
      <div className="text-center mb-2">
       
        <h2 className="text-3xl font-bold text-gray-800">Quản lý phiếu giảm giá</h2>
        <p className="text-gray-600">Tạo và quản lý các mã giảm giá cho khách hàng</p>
      </div>

      {/* Form Section */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-8 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Tạo phiếu giảm giá mới
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mã phiếu giảm giá
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={coupon}
                  onChange={(e) => debouncedSetCoupon(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="Nhập mã phiếu..."
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phần trăm giảm giá
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => debouncedSetDiscount(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                  placeholder="0-100"
                  min="1"
                  max="100"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 text-sm font-medium">%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày bắt đầu
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày kết thúc
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
                required
              />
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tạo phiếu giảm giá...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Tạo phiếu giảm giá
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Coupons List Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Danh sách phiếu giảm giá
          </h3>
        </div>

        {couponsLoading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
              <svg className="animate-spin h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <p className="text-gray-600">Đang tải danh sách phiếu giảm giá...</p>
          </div>
        ) : coupons.length === 0 ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">Chưa có phiếu giảm giá nào</p>
            <p className="text-sm text-gray-500">Tạo phiếu giảm giá đầu tiên để bắt đầu</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {coupons.map((c) => (
              <div key={c._id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <div className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full mr-3">
                        {c.discount}% OFF
                      </div>
                      <span className="text-lg font-bold text-gray-900 font-mono bg-gray-100 px-3 py-1 rounded">
                        {c.coupon}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span><strong>Bắt đầu:</strong> {formatDate(c.startDate)}</span>
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span><strong>Kết thúc:</strong> {formatDate(c.endDate)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="ml-4 p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                    title="Xóa phiếu giảm giá"
                  >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponForm;