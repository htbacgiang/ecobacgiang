import db from "../../../utils/db";
import SepayPayment from "../../../models/SepayPayment";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await db.connectDb();

    const { paymentCode, paymentStatus = "success", amount, transactionId } = req.body;

    console.log("=== TEST SEPAY CALLBACK ===");
    console.log("Payment Code:", paymentCode);
    console.log("Payment Status:", paymentStatus);
    console.log("Amount:", amount);
    console.log("Transaction ID:", transactionId);

    if (!paymentCode) {
      return res.status(400).json({ error: "Missing paymentCode" });
    }

    // Tìm payment record
    const payment = await SepayPayment.findOne({ paymentCode });
    
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Cập nhật trạng thái thanh toán
    let newStatus = "failed";
    if (paymentStatus === "success" || paymentStatus === "completed") {
      newStatus = "paid";
    } else if (paymentStatus === "pending") {
      newStatus = "pending";
    }

    await SepayPayment.findOneAndUpdate(
      { paymentCode }, 
      { 
        status: newStatus,
        transactionId: transactionId || `test-${Date.now()}`,
        paidAt: newStatus === "paid" ? new Date() : null,
        callbackData: req.body
      }
    );

    console.log(`Payment ${paymentCode} status updated to: ${newStatus}`);

    // Gửi thông báo qua WebSocket
    if (newStatus === "paid" && global.socketServer) {
      global.socketServer.to(paymentCode).emit("payment_paid", { 
        paymentCode,
        amount: payment.amount,
        transactionId: transactionId || `test-${Date.now()}`,
        paidAt: new Date()
      });
      console.log(`WebSocket notification sent for payment: ${paymentCode}`);
    }

    return res.status(200).json({ 
      success: true,
      paymentCode,
      status: newStatus,
      message: `Payment ${paymentCode} updated to ${newStatus}`
    });

  } catch (error) {
    console.error("Test Sepay Callback Error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    });
  }
}
