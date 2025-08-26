import db from "../../../utils/db";
import SepayPayment from "../../../models/SepayPayment";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await db.connectDb();

    const { paymentCode, paymentStatus, amount, transactionId } = req.body;

    console.log("=== SEPAY CALLBACK RECEIVED ===");
    console.log("Payment Code:", paymentCode);
    console.log("Payment Status:", paymentStatus);
    console.log("Amount:", amount);
    console.log("Transaction ID:", transactionId);
    console.log("Timestamp:", new Date().toISOString());
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    console.log("================================");

    // Validation
    if (!paymentCode) {
      console.error("Missing paymentCode in callback");
      return res.status(400).json({ error: "Missing paymentCode" });
    }

    if (!paymentStatus) {
      console.error("Missing paymentStatus in callback");
      return res.status(400).json({ error: "Missing paymentStatus" });
    }

    // Tìm payment record
    const payment = await SepayPayment.findOne({ paymentCode });
    
    if (!payment) {
      console.error(`Payment not found for code: ${paymentCode}`);
      return res.status(404).json({ error: "Payment not found" });
    }

    console.log("Found payment record:", {
      paymentCode: payment.paymentCode,
      status: payment.status,
      amount: payment.amount,
      userId: payment.userId
    });

    // Kiểm tra trạng thái hiện tại
    if (payment.status === "paid") {
      console.log(`Payment ${paymentCode} already marked as paid`);
      return res.status(200).json({ message: "Payment already processed" });
    }

    // Cập nhật trạng thái thanh toán
    let newStatus = "failed";
    if (paymentStatus === "success" || paymentStatus === "completed") {
      newStatus = "paid";
    } else if (paymentStatus === "pending") {
      newStatus = "pending";
    }

    console.log(`Updating payment status from ${payment.status} to ${newStatus}`);

    await SepayPayment.findOneAndUpdate(
      { paymentCode }, 
      { 
        status: newStatus,
        transactionId: transactionId || null,
        paidAt: newStatus === "paid" ? new Date() : null,
        callbackData: req.body // Lưu toàn bộ data callback để debug
      }
    );

    console.log(`Payment ${paymentCode} status updated to: ${newStatus}`);

    // Gửi thông báo qua WebSocket nếu thanh toán thành công
    if (newStatus === "paid" && global.socketServer) {
      global.socketServer.to(paymentCode).emit("payment_paid", { 
        paymentCode,
        amount: payment.amount,
        transactionId,
        paidAt: new Date()
      });
      console.log(`WebSocket notification sent for payment: ${paymentCode}`);
    } else if (newStatus === "paid") {
      console.log("WebSocket server not available, payment status updated in DB only");
    }

    return res.status(200).json({ 
      success: true,
      paymentCode,
      status: newStatus
    });

  } catch (error) {
    console.error("Sepay Callback Error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    });
  }
}
