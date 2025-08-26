import db from "../../../utils/db";
import Order from "../../../models/Order";
import SepayPayment from "../../../models/SepayPayment";

export default async function handler(req, res) {
  await db.connectDb();
  if (req.method === "POST") {
    try {
      const {
        user,
        orderItems,
        shippingAddress,
        phone,
        name,
        note,
        coupon,
        discount,
        totalPrice,
        totalAfterDiscount,
        shippingFee,
        finalTotal,
        paymentMethod,
        paymentCode,
      } = req.body;

      if (
        !orderItems ||
        orderItems.length === 0 ||
        !shippingAddress ||
        !phone ||
        !name ||
        !totalPrice ||
        !paymentMethod ||
        (paymentMethod === "Sepay" && !paymentCode)
      ) {
        return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
      }

      // Kiểm tra trạng thái Sepay đã thanh toán chưa
      if (paymentMethod === "Sepay" && paymentCode) {
        const payment = await SepayPayment.findOne({ paymentCode });
        if (!payment || payment.status !== "paid") {
          return res.status(400).json({ message: "Thanh toán Sepay chưa thành công" });
        }
      }

      const order = new Order({
        user: user || null,
        orderItems,
        shippingAddress,
        phone,
        name,
        note,
        coupon,
        discount,
        totalPrice,
        totalAfterDiscount: totalAfterDiscount || totalPrice,
        shippingFee,
        finalTotal,
        paymentMethod,
        paymentCode, // Lưu vào DB
      });

      await order.save();

      res.status(201).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi server", error: error.message });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} không được hỗ trợ`);
  }
}
