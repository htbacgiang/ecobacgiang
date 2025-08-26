import db from "../../../utils/db";
import MomoPayment from "../../../models/MomoPayment";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await db.connectDb();

    const { 
      partnerCode, 
      orderId, 
      requestId, 
      amount, 
      orderInfo, 
      orderType, 
      transId, 
      resultCode, 
      message, 
      payType, 
      signature 
    } = req.body;

    console.log("=== MOMO CALLBACK RECEIVED ===");
    console.log("Partner Code:", partnerCode);
    console.log("Order ID:", orderId);
    console.log("Request ID:", requestId);
    console.log("Amount:", amount);
    console.log("Result Code:", resultCode);
    console.log("Message:", message);
    console.log("Transaction ID:", transId);
    console.log("Signature:", signature);
    console.log("================================");

    // Validation
    if (!orderId || !requestId || !resultCode) {
      console.error("Missing required fields in callback");
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Verify signature (optional but recommended)
    if (signature) {
      const isValidSignature = verifyMomoSignature(req.body, process.env.MOMO_SECRET_KEY);
      if (!isValidSignature) {
        console.error("Invalid signature in callback");
        return res.status(400).json({ error: "Invalid signature" });
      }
    }

    // Tìm payment record
    const payment = await MomoPayment.findOne({ paymentCode: orderId });
    
    if (!payment) {
      console.error(`Payment not found for orderId: ${orderId}`);
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
      console.log(`Payment ${orderId} already marked as paid`);
      return res.status(200).json({ message: "Payment already processed" });
    }

    // Cập nhật trạng thái thanh toán
    let newStatus = "failed";
    if (resultCode === 0) {
      newStatus = "paid";
    } else if (resultCode === 1006) {
      newStatus = "pending"; // User cancelled
    }

    console.log(`Updating payment status from ${payment.status} to ${newStatus}`);

    await MomoPayment.findOneAndUpdate(
      { paymentCode: orderId }, 
      { 
        status: newStatus,
        transactionId: transId || null,
        paidAt: newStatus === "paid" ? new Date() : null,
        callbackData: req.body,
        resultCode: resultCode,
        message: message
      }
    );

    console.log(`Payment ${orderId} status updated to: ${newStatus}`);

    // Gửi thông báo qua WebSocket nếu thanh toán thành công
    if (newStatus === "paid" && global.socketServer) {
      global.socketServer.to(orderId).emit("payment_paid", { 
        paymentCode: orderId,
        amount: payment.amount,
        transactionId: transId,
        paidAt: new Date(),
        paymentMethod: "MoMo"
      });
      console.log(`WebSocket notification sent for payment: ${orderId}`);
    }

    return res.status(200).json({ 
      success: true,
      orderId,
      status: newStatus
    });

  } catch (error) {
    console.error("MoMo Callback Error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    });
  }
}

// Hàm verify signature cho MoMo
function verifyMomoSignature(data, secretKey) {
  const crypto = require('crypto');
  
  // Tạo chuỗi để verify
  const signatureString = `accessKey=${data.accessKey}&amount=${data.amount}&extraData=${data.extraData}&ipnUrl=${data.ipnUrl}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&partnerCode=${data.partnerCode}&redirectUrl=${data.redirectUrl}&requestId=${data.requestId}&requestType=${data.requestType}&resultCode=${data.resultCode}&transId=${data.transId}`;
  
  // Tạo HMAC SHA256
  const expectedSignature = crypto.createHmac('sha256', secretKey)
    .update(signatureString)
    .digest('hex');
  
  return expectedSignature === data.signature;
}
