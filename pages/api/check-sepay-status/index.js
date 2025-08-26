import db from "../../../utils/db";
import SepayPayment from "../../../models/SepayPayment";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await db.connectDb();

    const { paymentCode } = req.query;

    if (!paymentCode) {
      return res.status(400).json({ error: "Missing paymentCode parameter" });
    }

    // Tìm payment record
    const payment = await SepayPayment.findOne({ paymentCode });
    
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    // Kiểm tra xem payment có hết hạn chưa
    const now = new Date();
    const isExpired = payment.expiresAt && now > payment.expiresAt;
    
    if (isExpired && payment.status === "pending") {
      await SepayPayment.findOneAndUpdate(
        { paymentCode }, 
        { status: "expired" }
      );
      payment.status = "expired";
    }

    return res.status(200).json({
      success: true,
      payment: {
        paymentCode: payment.paymentCode,
        status: payment.status,
        amount: payment.amount,
        userId: payment.userId,
        createdAt: payment.createdAt,
        expiresAt: payment.expiresAt,
        paidAt: payment.paidAt,
        transactionId: payment.transactionId,
        isExpired: isExpired
      }
    });

  } catch (error) {
    console.error("Check Sepay Status Error:", error);
    return res.status(500).json({ 
      error: "Internal server error",
      message: error.message 
    });
  }
}
