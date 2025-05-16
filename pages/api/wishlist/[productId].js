import db from "../../../utils/db";
import User from "../../../models/User";

export default async function handler(req, res) {
  await db.connectDb();
  const { method } = req;
  const { userId } = req.body;
  const { productId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (method === "DELETE") {
      user.wishlist = user.wishlist.filter(
        (item) => item.product.toString() !== productId
      );
      await user.save();
      const updatedUser = await User.findById(userId)
        .select("wishlist")
        .populate("wishlist.product");
      return res.status(200).json({ wishlist: updatedUser.wishlist });
    } else {
      return res.status(405).json({ message: `Method ${method} not allowed` });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}