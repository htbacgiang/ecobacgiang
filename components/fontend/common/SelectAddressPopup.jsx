import React from "react";

export default function SelectAddressPopup({
  isOpen,
  onClose,
  addresses,
  selectedAddress,
  setSelectedAddress,
  onEditAddress,
  onAddNewAddress,
  onConfirm,
  onDeleteAddress, // hàm xóa địa chỉ, truyền từ parent
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 relative transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Địa Chỉ Của Tôi</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Address List */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <div
                key={addr._id}
                className={`border-2 rounded-lg p-4 transition-all duration-200 cursor-pointer hover:shadow-md ${
                  selectedAddress?._id === addr._id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelectedAddress(addr)}
              >
                {/* Radio button và thông tin địa chỉ */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center mt-1">
                    <input
                      type="radio"
                      name="address"
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      checked={selectedAddress?._id === addr._id}
                      onChange={() => setSelectedAddress(addr)}
                    />
                  </div>
                  
                  <div className="flex-1">
                    {/* Header với tên và các nút */}
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800">
                          {addr.fullName}
                        </p>
                        {addr.isDefault && (
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                            Mặc định
                          </span>
                        )}
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditAddress(addr);
                          }}
                        >
                          Sửa
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteAddress(addr._id);
                          }}
                        >
                          Xóa
                        </button>
                      </div>
                    </div>

                    {/* Thông tin liên hệ */}
                    <div className="space-y-1 mb-3">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        (+84) {addr.phoneNumber}
                      </p>
                      <p className="text-sm text-gray-600 flex items-start gap-1">
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{addr.address1}, {addr.wardName}, {addr.districtName}, {addr.cityName}</span>
                      </p>
                    </div>

                    {/* Loại địa chỉ */}
                    <div className="flex gap-2">
                      {addr.type === "home" && (
                        <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                          Nhà riêng
                        </span>
                      )}
                      {addr.type === "office" && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          Văn phòng
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-gray-500 text-sm">Bạn chưa có địa chỉ nào.</p>
            </div>
          )}

          {/* Nút thêm địa chỉ mới */}
          <button
            className="w-full mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 font-medium flex items-center justify-center gap-2"
            onClick={onAddNewAddress}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            + Thêm Địa Chỉ Mới
          </button>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
          <button
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onConfirm}
            disabled={!selectedAddress}
          >
            Lựa chọn
          </button>
        </div>
      </div>
    </div>
  );
}
