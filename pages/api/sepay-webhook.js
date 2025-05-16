import { Server } from "socket.io";

let io;
export default async function handler(req, res) {
  if (!res.socket.server.io) {
    io = new Server(res.socket.server);
    res.socket.server.io = io;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const transaction = req.body;

    // Kiểm tra tính hợp lệ của webhook
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Apikey ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Lấy số dư mới nhất (accumulated)
    const { accumulated, transactionDate } = transaction;

    // Phát số dư qua WebSocket
    io.emit("balanceUpdate", {
      balance: accumulated,
      date: transactionDate,
    });

    return res.status(200).json({ message: "Webhook received successfully" });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}