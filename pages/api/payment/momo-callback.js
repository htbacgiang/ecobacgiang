export default async function handler(req, res) {
    const { resultCode, orderId } = req.query;
    // Nếu resultCode === "0" nghĩa là giao dịch thành công
    if (resultCode === "0") {
      // (Tùy chọn) Cập nhật trạng thái đơn hàng thành "paid" trong DB dựa trên orderId
      res.redirect(`/checkout?paymentResult=success&orderId=${orderId}`);
    } else {
      res.redirect(`/checkout?paymentResult=failure&orderId=${orderId}`);
    }
  }
  