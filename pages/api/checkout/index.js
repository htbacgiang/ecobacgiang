import db from "../../../utils/db";
import Order from "../../../models/Order";

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
        shippingFee,    // Nhận phí vận chuyển từ phía client
        finalTotal,     // Nhận tổng thanh toán cuối cùng từ phía client
        paymentMethod,  // Nhận phương thức thanh toán
      } = req.body;

      if (
        !orderItems ||
        orderItems.length === 0 ||
        !shippingAddress ||
        !phone ||
        !name ||
        !totalPrice ||
        !paymentMethod
      ) {
        return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
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
        shippingFee,    // Lưu phí vận chuyển
        finalTotal,     // Lưu tổng thanh toán cuối cùng
        paymentMethod,  // Lưu phương thức thanh toán
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
