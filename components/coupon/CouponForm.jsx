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
    <div className="mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Tạo phiếu giảm giá</h2>
      <div>
        <div className="mb-3">
          <label className="block mb-1">Mã phiếu</label>
          <input
            type="text"
            value={coupon}
            onChange={(e) => debouncedSetCoupon(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Ngày bắt đầu</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Ngày kết thúc</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="mb-3">
          <label className="block mb-1">Giảm giá (%)</label>
          <input
            type="number"
            value={discount}
            onChange={(e) => debouncedSetDiscount(e.target.value)}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white p-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Đang tạo..." : "Tạo phiếu giảm giá"}
        </button>
      </div>
      <hr className="my-4" />
      <h3 className="text-lg font-bold mb-2">Danh sách phiếu giảm giá</h3>
      {couponsLoading ? (
        <div>Đang tải danh sách phiếu giảm giá...</div>
      ) : (
        <ul>
          {coupons.map((c) => (
            <li key={c._id} className="border p-2 rounded mb-2">
              <p>
                <strong>Mã:</strong> {c.coupon}
              </p>
              <p>
                <strong>Giảm giá:</strong> {c.discount}%
              </p>
              <p>
                <strong>Hiệu lực:</strong> {formatDate(c.startDate)} -{" "}
                {formatDate(c.endDate)}
              </p>
              <button
                onClick={() => handleDelete(c._id)}
                className="text-red-500 hover:text-red-700 mt-2"
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CouponForm;