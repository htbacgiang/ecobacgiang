import { Server } from "socket.io";

export default function handler(req, res) {
  if (!res.socket.server.io) {
    const io = new Server(res.socket.server, { path: "/api/socket" });
    res.socket.server.io = io;
    global.socketServer = io;

    io.on("connection", (socket) => {
      socket.on("join_payment", (paymentCode) => {
        socket.join(paymentCode);
      });
    });
  }
  res.end();
}
