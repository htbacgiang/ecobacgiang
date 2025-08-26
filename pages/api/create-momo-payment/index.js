import db from "../../../utils/db";
import MomoPayment from "../../../models/MomoPayment";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await db.connectDb();

    const { amount, userId, orderInfo = "Thanh toan don hang" } = req.body;

    // Validation
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Số tiền không hợp lệ" });
    }

    if (!userId) {
      return res.status(400).json({ error: "Thiếu thông tin người dùng" });
    }

    if (!process.env.MOMO_PARTNER_CODE || !process.env.MOMO_ACCESS_KEY || !process.env.MOMO_SECRET_KEY) {
      return res.status(500).json({ error: "Cấu hình MoMo chưa hoàn tất" });
    }

    // Tạo payment code unique
    const paymentCode = `MOMO-${userId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Xác định callback URL
    const baseUrl = process.env.NEXTAUTH_URL || 
                   (process.env.NODE_ENV === 'production' 
                     ? 'https://ecobacgiang.vn' 
                     : 'http://localhost:3000');
    
    const callbackUrl = `${baseUrl}/api/momo-callback`;
    const redirectUrl = `${baseUrl}/checkout/success`;

    // Tạo request data cho MoMo
    const requestData = {
      partnerCode: process.env.MOMO_PARTNER_CODE,
      accessKey: process.env.MOMO_ACCESS_KEY,
      requestId: paymentCode,
      amount: Math.round(amount),
      orderId: paymentCode,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: callbackUrl,
      requestType: "captureWallet",
      extraData: JSON.stringify({ userId }),
      signature: "" // Sẽ được tính toán bên dưới
    };

    // Tạo signature
    const signature = createMomoSignature(requestData, process.env.MOMO_SECRET_KEY);
    requestData.signature = signature;

    console.log('Creating MoMo payment with data:', requestData);

    // Gọi API MoMo
    const momoResponse = await fetch("https://test-payment.momo.vn/v2/gateway/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!momoResponse.ok) {
      const errorData = await momoResponse.text();
      console.error("MoMo API Error:", errorData);
      return res.status(500).json({ 
        error: "Không thể tạo phiếu thanh toán MoMo",
        details: errorData 
      });
    }

    const momoData = await momoResponse.json();

    if (momoData.resultCode !== 0) {
      return res.status(500).json({ 
        error: "MoMo trả về lỗi",
        resultCode: momoData.resultCode,
        message: momoData.message 
      });
    }

    // Lưu thông tin thanh toán vào database
    await MomoPayment.create({ 
      paymentCode, 
      status: "pending", 
      amount: Math.round(amount), 
      userId,
      momoData: momoData,
      requestData: requestData
    });

    return res.status(200).json({
      success: true,
      paymentCode,
      payUrl: momoData.payUrl,
      deeplink: momoData.deeplink,
      qrCodeUrl: momoData.qrCodeUrl,
      amount: Math.round(amount),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 phút
    });

  } catch (error) {
    console.error("Create MoMo Payment Error:", error);
    return res.status(500).json({ 
      error: "Lỗi server khi tạo thanh toán",
      message: error.message 
    });
  }
}

// Hàm tạo signature cho MoMo
function createMomoSignature(data, secretKey) {
  const crypto = require('crypto');
  
  // Tạo chuỗi để ký
  const signatureString = `accessKey=${data.accessKey}&amount=${data.amount}&extraData=${data.extraData}&ipnUrl=${data.ipnUrl}&orderId=${data.orderId}&orderInfo=${data.orderInfo}&partnerCode=${data.partnerCode}&redirectUrl=${data.redirectUrl}&requestId=${data.requestId}&requestType=${data.requestType}`;
  
  // Tạo HMAC SHA256
  const signature = crypto.createHmac('sha256', secretKey)
    .update(signatureString)
    .digest('hex');
  
  return signature;
}
