import db from "../../../utils/db";
import SepayPayment from "../../../models/SepayPayment";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await db.connectDb();

    const { amount, userId } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Số tiền không hợp lệ" });
    }

    if (!userId) {
      return res.status(400).json({ error: "Thiếu thông tin người dùng" });
    }

    if (!process.env.SEPAY_API_KEY) {
      return res.status(500).json({ error: "Cấu hình Sepay chưa hoàn tất" });
    }

    // Tạo payment code unique
    const paymentCode = `ECOBG-${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Xác định callback URL dựa trên môi trường
    const baseUrl = process.env.NEXTAUTH_URL || 
                   (process.env.NODE_ENV === 'production' 
                     ? 'https://ecobacgiang.vn' 
                     : 'http://localhost:3000');
    
    const callbackUrl = `${baseUrl}/api/sepay-callback`;

    console.log('Creating Sepay payment with callback URL:', callbackUrl);

    // Tạo phiếu thanh toán trên Sepay
    const sepayResponse = await fetch("https://api.sepay.vn/api/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.SEPAY_API_KEY,
      },
      body: JSON.stringify({
        amount: Math.round(amount), // Đảm bảo số nguyên
        paymentCode,
        callbackUrl: callbackUrl,
        description: `Thanh toán đơn hàng Eco Bắc Giang - ${paymentCode}`,
        customerName: "Khách hàng Eco Bắc Giang",
        customerEmail: "customer@ecobacgiang.vn",
      }),
    });

    if (!sepayResponse.ok) {
      const errorData = await sepayResponse.text();
      console.error("Sepay API Error:", errorData);
      return res.status(500).json({ 
        error: "Không thể tạo phiếu thanh toán Sepay",
        details: errorData 
      });
    }

    const sepayData = await sepayResponse.json();

    if (!sepayData.qrUrl) {
      return res.status(500).json({ 
        error: "Sepay không trả về mã QR",
        response: sepayData 
      });
    }

    // Lưu thông tin thanh toán vào database
    await SepayPayment.create({ 
      paymentCode, 
      status: "pending", 
      amount: Math.round(amount), 
      userId,
      sepayData: sepayData // Lưu thêm response từ Sepay nếu cần
    });

    return res.status(200).json({
      success: true,
      paymentCode,
      qrUrl: sepayData.qrUrl,
      payUrl: sepayData.payUrl || null,
      amount: Math.round(amount),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 phút
    });

  } catch (error) {
    console.error("Create Sepay Payment Error:", error);
    return res.status(500).json({ 
      error: "Lỗi server khi tạo thanh toán",
      message: error.message 
    });
  }
}
