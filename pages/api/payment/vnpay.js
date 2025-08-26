import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { orderId, amount } = req.body; // amount tính theo VND
    const vnp_TmnCode = process.env.VNP_TMNCODE;
    const vnp_HashSecret = process.env.VNP_HASHSECRET;
    const vnp_Url = process.env.VNP_URL;
    const vnp_ReturnUrl = process.env.VNP_RETURNURL;

    let vnp_Params = {};
    vnp_Params["vnp_Version"] = "2.1.0";
    vnp_Params["vnp_Command"] = "pay";
    vnp_Params["vnp_TmnCode"] = vnp_TmnCode;
    vnp_Params["vnp_Locale"] = "vn";
    vnp_Params["vnp_CurrCode"] = "VND";
    vnp_Params["vnp_TxnRef"] = orderId;
    vnp_Params["vnp_OrderInfo"] = "Thanh toán đơn hàng " + orderId;
    vnp_Params["vnp_OrderType"] = "other";
    vnp_Params["vnp_Amount"] = amount * 100; // VNPay yêu cầu số tiền * 100
    vnp_Params["vnp_ReturnUrl"] = vnp_ReturnUrl;

    const date = new Date();
    const createDate = date
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .substring(0, 14);
    vnp_Params["vnp_CreateDate"] = createDate;

    // Sắp xếp các tham số theo thứ tự chữ cái của key
    const sortedKeys = Object.keys(vnp_Params).sort();
    const signData = sortedKeys
      .map((key) => key + "=" + vnp_Params[key])
      .join("&");

    // Tạo chữ ký HMAC SHA512
    const vnp_SecureHash = crypto
      .createHmac("sha512", vnp_HashSecret)
      .update(Buffer.from(signData, "utf-8"))
      .digest("hex");
    vnp_Params["vnp_SecureHash"] = vnp_SecureHash;

    const querystring =
      sortedKeys
        .map((key) => key + "=" + encodeURIComponent(vnp_Params[key]))
        .join("&") + `&vnp_SecureHash=${vnp_SecureHash}`;

    const paymentUrl = `${vnp_Url}?${querystring}`;
    res.status(200).json({ paymentUrl });
  } else {
    res.status(405).end("Method Not Allowed");
  }
}
