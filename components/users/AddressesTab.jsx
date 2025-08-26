import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MapPin, Phone, User, Home, Building } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AddressesTab({ userId }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State cho form popup thêm/chỉnh sửa địa chỉ
  const [showForm, setShowForm] = useState(false);
  const [addressData, setAddressData] = useState({
    _id: "",
    fullName: "",
    phoneNumber: "",
    address1: "",
    city: "",
    cityName: "",
    district: "",
    districtName: "",
    ward: "",
    wardName: "",
    type: "home",
    isDefault: false,
  });
  
  // State lưu dữ liệu tỉnh/TP, quận/huyện, phường/xã
  const [dataAll, setDataAll] = useState([]);
  const [selectedProvinceDetails, setSelectedProvinceDetails] = useState(null);
  
  // State xác nhận xóa địa chỉ
  const [confirmDeleteAddressId, setConfirmDeleteAddressId] = useState(null);
  
  useEffect(() => {
    if (showForm && dataAll.length === 0) {
      fetchAllData();
    }
  }, [showForm]);

  const fetchAllData = async () => {
    try {
      // Sử dụng API cũ với depth=3 để có đầy đủ dữ liệu
      const res = await axios.get("https://provinces.open-api.vn/api/?depth=3");
      const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
      setDataAll(sorted);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải dữ liệu Tỉnh/Thành!");
    }
  };



  // Dropdown dữ liệu dựa trên form addressData
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
  


  // Fetch danh sách địa chỉ của user
  const fetchAddresses = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/address?userId=${userId}`);
      setAddresses(res.data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error("Lỗi lấy địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  const resetForm = () => {
    setAddressData({
      _id: "",
      fullName: "",
      phoneNumber: "",
      address1: "",
      city: "",
      cityName: "",
      district: "",
      districtName: "",
      ward: "",
      wardName: "",
      type: "home",
      isDefault: false,
    });
    setSelectedProvinceDetails(null);
  };

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

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    const wardObj = wards.find(
      (w) => w.code.toString() === wardCode
    );
    setAddressData({
      ...addressData,
      ward: wardCode,
      wardName: wardObj ? wardObj.name : "",
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (addressData._id) {
        const payload = { ...addressData, addressId: addressData._id };
        await axios.put(`/api/address?userId=${userId}`, payload);
        toast.success("Địa chỉ cập nhật thành công!");
      } else {
        const { _id, ...newAddress } = addressData;
        await axios.post(`/api/address?userId=${userId}`, newAddress);
        toast.success("Địa chỉ thêm thành công!");
      }
      resetForm();
      setShowForm(false);
      fetchAddresses();
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error("Có lỗi khi lưu địa chỉ");
    }
  };

  const handleEdit = (addr) => {
    setAddressData(addr);
    setShowForm(true);
  };

  // Khi bấm nút xóa, không xóa ngay mà lưu id cần xóa vào state confirmDeleteAddressId
  const onDeleteClick = (addrId) => {
    setConfirmDeleteAddressId(addrId);
  };

  // Xác nhận xóa: gọi API xóa địa chỉ, sau đó reset state confirmDeleteAddressId
  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/address?userId=${userId}&addressId=${confirmDeleteAddressId}`);
      toast.success("Đã xóa địa chỉ!");
      fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Có lỗi khi xóa địa chỉ");
    } finally {
      setConfirmDeleteAddressId(null);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="flex items-center justify-between border-b border-gray-200 pb-6 mb-8">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-green-500 rounded-xl shadow-lg">
            <MapPin className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Sổ địa chỉ</h2>
            <p className="text-gray-500 text-sm mt-1">Quản lý địa chỉ giao hàng của bạn</p>
          </div>
        </div>
        <button
          className="flex items-center px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          Thêm địa chỉ mới
        </button>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600"></div>
          <span className="ml-4 text-gray-600 font-medium">Đang tải địa chỉ...</span>
        </div>
      ) : addresses.length > 0 ? (
        <div className="grid gap-6">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="border border-gray-200 p-8 rounded-2xl hover:shadow-xl transition-all duration-300 bg-white hover:bg-gray-50 group"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-3 rounded-xl shadow-md ${
                      addr.type === 'home' 
                        ? 'bg-blue-500' 
                        : 'bg-purple-500'
                    }`}>
                      {addr.type === 'home' ? (
                        <Home className="w-6 h-6 text-white" />
                      ) : (
                        <Building className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
                        {addr.fullName}
                      </h3>
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mt-2">
                        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                          <Phone className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{addr.phoneNumber}</span>
                        </div>
                        <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                          <MapPin className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{addr.type === 'home' ? 'Nhà riêng' : 'Văn phòng'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-16">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <p className="text-gray-700 leading-relaxed font-medium">
                        {addr.address1}, {addr.wardName}, {addr.districtName}, {addr.cityName}
                      </p>
                    </div>
                    {addr.isDefault && (
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-green-500 text-white mt-3 shadow-md">
                        <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                        Địa chỉ mặc định
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3 ml-6">
                  <button
                    className="flex items-center px-4 py-2 text-blue-600 text-sm font-semibold hover:bg-blue-50 rounded-xl transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                    onClick={() => handleEdit(addr)}
                  >
                    <Edit size={18} className="mr-2" />
                    Chỉnh sửa
                  </button>
                  <button
                    className="flex items-center px-4 py-2 text-red-600 text-sm font-semibold hover:bg-red-50 rounded-xl transition-all duration-200 hover:shadow-md transform hover:-translate-y-0.5"
                    onClick={() => onDeleteClick(addr._id)}
                  >
                    <Trash2 size={18} className="mr-2" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="p-6 bg-gray-200 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
            <MapPin className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Chưa có địa chỉ nào</h3>
          <p className="text-gray-500 text-lg mb-4">Hãy thêm địa chỉ đầu tiên của bạn</p>
          <button
            className="inline-flex items-center px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm địa chỉ đầu tiên
          </button>
        </div>
      )}

      {showForm && (
        <div className="mt-8 p-8 border border-gray-200 rounded-2xl bg-gray-50 shadow-xl">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-green-500 rounded-xl shadow-lg">
              <Plus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {addressData._id ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
              </h3>
              <p className="text-gray-500 text-sm mt-1">Điền thông tin địa chỉ giao hàng</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <User className="w-5 h-5 inline mr-2 text-green-600" />
                  Họ và Tên
                </label>
                <input
                  type="text"
                  value={addressData.fullName}
                  onChange={(e) =>
                    setAddressData({ ...addressData, fullName: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white shadow-sm"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  <Phone className="w-5 h-5 inline mr-2 text-green-600" />
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={addressData.phoneNumber}
                  onChange={(e) =>
                    setAddressData({ ...addressData, phoneNumber: e.target.value })
                  }
                  className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white shadow-sm"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <MapPin className="w-5 h-5 inline mr-2 text-green-600" />
                Địa chỉ chi tiết
              </label>
              <input
                type="text"
                value={addressData.address1}
                onChange={(e) =>
                  setAddressData({ ...addressData, address1: e.target.value })
                }
                className="w-full border-2 border-gray-200 p-4 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white shadow-sm"
                placeholder="Số nhà, tên đường, phường/xã..."
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <MapPin className="w-5 h-5 inline mr-2 text-green-600" />
                Tỉnh/Thành, Quận/Huyện, Phường/Xã
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <select
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white shadow-sm"
                  value={addressData.city}
                  onChange={handleProvinceChange}
                  required
                >
                  <option value="">Chọn Tỉnh/Thành</option>
                  {dataAll.map((prov) => (
                    <option key={prov.code} value={prov.code.toString()}>
                      {prov.name}
                    </option>
                  ))}
                </select>
                
                <select
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={addressData.district}
                  onChange={handleDistrictChange}
                  required
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
                  className="w-full border-2 border-gray-200 rounded-xl p-4 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 bg-white shadow-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  value={addressData.ward}
                  onChange={handleWardChange}
                  required
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
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Loại địa chỉ
              </label>
              <div className="flex space-x-6">
                <button
                  type="button"
                  className={`flex items-center px-8 py-4 rounded-xl border-2 text-sm font-semibold transition-all duration-300 ${
                    addressData.type === "home"
                      ? "bg-blue-500 text-white border-blue-500 shadow-xl transform scale-105"
                      : "bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50 shadow-md hover:shadow-lg"
                  }`}
                  onClick={() =>
                    setAddressData({ ...addressData, type: "home" })
                  }
                >
                  <Home className="w-5 h-5 mr-3" />
                  Nhà Riêng
                </button>
                <button
                  type="button"
                  className={`flex items-center px-8 py-4 rounded-xl border-2 text-sm font-semibold transition-all duration-300 ${
                    addressData.type === "office"
                      ? "bg-purple-500 text-white border-purple-500 shadow-xl transform scale-105"
                      : "bg-white text-gray-700 border-gray-200 hover:border-purple-300 hover:bg-purple-50 shadow-md hover:shadow-lg"
                  }`}
                  onClick={() =>
                    setAddressData({ ...addressData, type: "office" })
                  }
                >
                  <Building className="w-5 h-5 mr-3" />
                  Văn Phòng
                </button>
              </div>
            </div>
            
            <div className="flex items-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200 shadow-sm">
              <input
                type="checkbox"
                className="form-checkbox h-6 w-6 text-green-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                checked={addressData.isDefault}
                onChange={(e) =>
                  setAddressData({
                    ...addressData,
                    isDefault: e.target.checked,
                  })
                }
              />
              <label className="ml-4 text-base font-semibold text-blue-800">
                Đặt làm địa chỉ mặc định
              </label>
            </div>
            
            <div className="flex justify-end space-x-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="px-8 py-4 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 font-semibold text-gray-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-8 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105"
              >
                {addressData._id ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Modal xác nhận xóa */}
      {confirmDeleteAddressId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-96">
           
            <h3 className="text-lg font-bold text-gray-800 mb-2">Xác nhận xóa</h3>
            <p className="text-gray-600 mb-6">Bạn có chắc chắn muốn xóa địa chỉ này?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
              >
                Xóa
              </button>
              <button
                onClick={() => setConfirmDeleteAddressId(null)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
