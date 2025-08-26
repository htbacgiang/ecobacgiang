export default async function handler(req, res) {
  const { vnp_ResponseCode, vnp_TxnRef } = req.query;
  // Nếu vnp_ResponseCode === "00" nghĩa là giao dịch thành công
  if (vnp_ResponseCode === "00") {
    // (Tùy chọn) Cập nhật trạng thái đơn hàng trong DB thành "paid" dựa trên vnp_TxnRef
    res.redirect(`/checkout?paymentResult=success&orderId=${vnp_TxnRef}`);
  } else {
    res.redirect(`/checkout?paymentResult=failure&orderId=${vnp_TxnRef}`);
  }
}
