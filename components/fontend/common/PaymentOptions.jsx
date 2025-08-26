import { useState } from "react";
import axios from "axios";

const PaymentOptions = ({ orderId, amount }) => {
  const [paymentUrl, setPaymentUrl] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");

  const handlePayment = async (method) => {
    setSelectedMethod(method);
    let response;
    if (method === "VNPay") {
      response = await axios.post("/api/payment/vnpay", { orderId, amount });
    } else if (method === "MoMo") {
      response = await axios.post("/api/payment/momo", { orderId, amount });
    }
    setPaymentUrl(response.data.paymentUrl);
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-semibold mb-4">Chọn phương thức thanh toán</h2>
      <div className="flex gap-4">
        <button
          onClick={() => handlePayment("VNPay")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Thanh toán qua VNPay
        </button>
        <button
          onClick={() => handlePayment("MoMo")}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Thanh toán qua MoMo
        </button>
      </div>

      {paymentUrl && (
        <div className="text-center mt-4">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
              paymentUrl
            )}&size=200x200`}
            alt={`${selectedMethod} QR Code`}
            className="mx-auto border p-2 shadow-md"
          />
          <p className="mt-2">
            Quét mã QR để thanh toán qua {selectedMethod}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentOptions;
