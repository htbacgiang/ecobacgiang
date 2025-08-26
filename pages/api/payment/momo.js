import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { orderId, amount } = req.body; // amount tính theo VND
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const requestId = orderId + "_" + new Date().getTime();
    const orderInfo = "Thanh toán đơn hàng " + orderId;
    const redirectUrl = process.env.MOMO_RETURN_URL;
    const ipnUrl = process.env.MOMO_IPN_URL;
    const extraData = "";

    const rawSignature =
      "accessKey=" +
      accessKey +
      "&amount=" +
      amount +
      "&extraData=" +
      extraData +
      "&ipnUrl=" +
      ipnUrl +
      "&orderId=" +
      orderId +
      "&orderInfo=" +
      orderInfo +
      "&partnerCode=" +
      partnerCode +
      "&redirectUrl=" +
      redirectUrl +
      "&requestId=" +
      requestId;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = {
      partnerCode,
      accessKey,
      requestId,
      amount: amount.toString(),
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      extraData,
      requestType: "captureMoMoWallet",
      signature,
    };

    const momoEndpoint = process.env.MOMO_ENDPOINT;
    const response = await fetch(momoEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();
    res.status(200).json({ paymentUrl: data.payUrl });
  } else {
    res.status(405).end("Method Not Allowed");
  }
}
