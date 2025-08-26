import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function EditAddressPopup({
  isOpen,
  onClose,
  addressData,
  setAddressData,
  refreshAddresses, // Hàm này sẽ được gọi để cập nhật danh sách địa chỉ (cho user đã đăng nhập) hoặc lưu vào state cho khách vãng lai
}) {
  const { data: session } = useSession();
  const [dataAll, setDataAll] = useState([]);

  useEffect(() => {
    if (isOpen && dataAll.length === 0) {
      fetchAllData();
    }
  }, [isOpen]);

  const fetchAllData = async () => {
    try {
      const res = await axios.get("https://provinces.open-api.vn/api/?depth=3");
      const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
      setDataAll(sorted);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu Tỉnh/Thành!");
    }
  };

  const selectedProvince = dataAll.find(
    (p) => p.code.toString() === addressData.city
  );
  const districts = selectedProvince
    ? selectedProvince.districts.sort((a, b) => a.name.localeCompare(b.name))
    : [];
  const selectedDistrict = districts.find(
    (d) => d.code.toString() === addressData.district
  );
  const wards = selectedDistrict
    ? selectedDistrict.wards.sort((a, b) => a.name.localeCompare(b.name))
    : [];

  // Khi chọn tỉnh: lưu cả code và tên tỉnh
  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const provinceObj = dataAll.find(
      (p) => p.code.toString() === provinceCode
    );
    setAddressData({
      ...addressData,
      city: provinceCode,
      cityName: provinceObj ? provinceObj.name : "",
      district: "",
      districtName: "",
      ward: "",
      wardName: "",
    });
  };

  // Khi chọn quận: lưu cả code và tên quận
  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    const districtObj = selectedProvince?.districts.find(
      (d) => d.code.toString() === districtCode
    );
    setAddressData({
      ...addressData,
      district: districtCode,
      districtName: districtObj ? districtObj.name : "",
      ward: "",
      wardName: "",
    });
  };

  // Khi chọn phường: lưu cả code và tên phường
  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    const wardObj = selectedDistrict?.wards.find(
      (w) => w.code.toString() === wardCode
    );
    setAddressData({
      ...addressData,
      ward: wardCode,
      wardName: wardObj ? wardObj.name : "",
    });
  };

  const handleSubmit = async () => {
    // Nếu khách hàng đăng nhập, gọi API để lưu vào DB
    if (session?.user?.id) {
      try {
        if (addressData._id) {
          // Cập nhật địa chỉ: dùng PUT
          await axios.put(`/api/address?userId=${session.user.id}`, {
            addressId: addressData._id,
            ...addressData,
          });
        } else {
          // Thêm địa chỉ mới: dùng POST (loại bỏ _id nếu có)
          const { _id, ...newAddress } = addressData;
          await axios.post(`/api/address?userId=${session.user.id}`, newAddress);
        }
        toast.success("Lưu địa chỉ thành công!");
        if (refreshAddresses) refreshAddresses();
        onClose();
      } catch (error) {
        console.error(error);
        toast.error("Có lỗi khi lưu địa chỉ.");
      }
    } else {
      // Với khách vãng lai (không đăng nhập), ta chỉ cập nhật state trong component cha
      // Ví dụ: gọi refreshAddresses với dữ liệu địa chỉ mới
      toast.success("Lưu địa chỉ thành công!");
      if (refreshAddresses) refreshAddresses(addressData);
      onClose();
    }
  };

  if (!isOpen) return null;

  const isUpdate = !!addressData._id;
  const titleText = isUpdate ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới";
  const buttonText = isUpdate ? "Cập nhật" : "Thêm mới";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-xl shadow-2xl p-6 relative transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">{titleText}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Content */}
        <div className="space-y-3">
          {/* Họ tên & SĐT trên cùng 1 hàng */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Họ và tên</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={addressData.fullName}
                onChange={(e) =>
                  setAddressData({ ...addressData, fullName: e.target.value })
                }
                placeholder="Nhập họ và tên"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                value={addressData.phoneNumber}
                onChange={(e) =>
                  setAddressData({ ...addressData, phoneNumber: e.target.value })
                }
                placeholder="Nhập số điện thoại"
              />
            </div>
          </div>

          {/* Tỉnh/Thành, Quận/Huyện, Phường/Xã */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tỉnh/Thành, Quận/Huyện, Phường/Xã
            </label>
            <div className="grid grid-cols-3 gap-2">
              <select
                className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                value={addressData.city}
                onChange={handleProvinceChange}
              >
                <option value="">Chọn Tỉnh/Thành</option>
                {dataAll.map((prov) => (
                  <option key={prov.code} value={prov.code.toString()}>
                    {prov.name}
                  </option>
                ))}
              </select>
              <select
                className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={addressData.district}
                onChange={handleDistrictChange}
                disabled={!addressData.city || districts.length === 0}
              >
                <option value="">Chọn Quận/Huyện</option>
                {districts.map((dist) => (
                  <option key={dist.code} value={dist.code.toString()}>
                    {dist.name}
                  </option>
                ))}
              </select>
              <select
                className="w-full border border-gray-300 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={addressData.ward}
                onChange={handleWardChange}
                disabled={!addressData.district || wards.length === 0}
              >
                <option value="">Chọn Phường/Xã</option>
                {wards.map((w) => (
                  <option key={w.code} value={w.code.toString()}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Địa chỉ cụ thể */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ cụ thể</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Số 5, ngách 1 ngõ 5..."
              value={addressData.address1}
              onChange={(e) =>
                setAddressData({ ...addressData, address1: e.target.value })
              }
            />
          </div>

          {/* Loại địa chỉ */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Loại địa chỉ</label>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                  addressData.type === "home"
                    ? "bg-red-500 text-white border-red-500 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:border-red-300 hover:bg-red-50"
                }`}
                onClick={() =>
                  setAddressData({ ...addressData, type: "home" })
                }
              >
                Nhà Riêng
              </button>
              <button
                type="button"
                className={`flex-1 px-3 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                  addressData.type === "office"
                    ? "bg-blue-500 text-white border-blue-500 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                }`}
                onClick={() =>
                  setAddressData({ ...addressData, type: "office" })
                }
              >
                Văn Phòng
              </button>
            </div>
          </div>

          {/* Đặt làm địa chỉ mặc định */}
          <div className="flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                checked={addressData.isDefault}
                onChange={(e) =>
                  setAddressData({
                    ...addressData,
                    isDefault: e.target.checked,
                  })
                }
              />
              <span className="ml-2 text-sm text-gray-700 font-medium">Đặt làm địa chỉ mặc định</span>
            </label>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-gray-200">
          <button
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
            onClick={onClose}
          >
            Trở Lại
          </button>
          <button
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            onClick={handleSubmit}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
