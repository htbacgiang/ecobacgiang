import db from "../../../../utils/db";
import Cart from "../../../../models/Cart";

export default async function handler(req, res) {
  await db.connectDb();
  const { method } = req;
  const { userId } = req.query;

  if (method !== "PUT") {
    return res.status(405).json({ message: `Method ${method} not allowed.` });
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) return res.status(404).json({ message: "Cart not found." });

  try {
    const { coupon, discount, totalAfterDiscount } = req.body;
    cart.coupon = coupon || "";
    cart.discount = discount || 0;
    cart.totalAfterDiscount = totalAfterDiscount || cart.cartTotal;
    // Nếu cart rỗng thì reset coupon
    if (cart.products.length === 0) {
      cart.coupon = "";
      cart.discount = 0;
      cart.totalAfterDiscount = 0;
    }
    await cart.save();
    return res.json(cart);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
