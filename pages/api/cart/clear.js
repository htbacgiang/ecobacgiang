// /pages/api/cart/clear.js
import db from "../../../utils/db";
import Cart from "../../../models/Cart";

export default async function handler(req, res) {
  await db.connectDb();

  if (req.method === "DELETE") {
    try {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).json({ message: "Thiếu userId" });
      }
      // Xóa cart của user trong DB
      await Cart.findOneAndDelete({ user: userId });
      return res.status(200).json({ message: "Cart đã được xóa" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    return res
      .status(405)
      .json({ message: `Method ${req.method} không được hỗ trợ` });
  }
}
