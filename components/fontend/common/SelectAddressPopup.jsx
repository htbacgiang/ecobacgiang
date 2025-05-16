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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-md rounded-md p-4 relative">
        <h3 className="text-lg font-semibold mb-4">Địa Chỉ Của Tôi</h3>
        <div className="space-y-3 max-h-80 overflow-auto">
          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <div
                key={addr._id}
                className="border rounded p-3 flex items-start gap-2"
              >
                {/* Radio button để chọn địa chỉ */}
                <input
                  type="radio"
                  name="address"
                  className="mt-1"
                  checked={selectedAddress?._id === addr._id}
                  onChange={() => setSelectedAddress(addr)}
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-semibold text-sm">
                      {addr.fullName}
                      {addr.isDefault && (
                        <span className="ml-2 bg-green-100 text-green-600 text-xs px-2 py-1 rounded">
                          Mặc định
                        </span>
                      )}
                    </p>
                    <div className="flex gap-1">
                      {/* Nút "Cập nhật" */}
                      <button
                        className="text-blue-500 text-xs underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditAddress(addr);
                        }}
                      >
                        Cập nhật
                      </button>
                      {/* Nút "Xóa" */}
                      <button
                        className="text-red-500 text-xs underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAddress(addr._id);
                        }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    (+84) {addr.phoneNumber}
                  </p>
                  <p className="text-sm text-gray-600">
                    {addr.address1}, {addr.wardName}, {addr.districtName}, {addr.cityName}
                  </p>
                  {addr.type === "home" && (
                    <span className="inline-block bg-red-100 text-red-600 text-xs px-2 py-1 rounded mt-1">
                      Nhà riêng
                    </span>
                  )}
                  {addr.type === "office" && (
                    <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded mt-1">
                      Văn phòng
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Bạn chưa có địa chỉ nào.</p>
          )}

          {/* Nút thêm địa chỉ mới */}
          <button
            className="text-blue-500 hover:underline mt-2"
            onClick={onAddNewAddress}
          >
            + Thêm Địa Chỉ Mới
          </button>
        </div>

        {/* Nút Hủy / Xác nhận */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={onConfirm}
          >
            Lựa chọn
          </button>
        </div>
      </div>
    </div>
  );
}
