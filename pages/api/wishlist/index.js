import db from "../../../utils/db";
import User from "../../../models/User";

export default async function handler(req, res) {
  await db.connectDb();
  const { method } = req;

  switch (method) {
    case "GET": {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      try {
        const user = await User.findById(userId)
          .select("wishlist")
          .populate("wishlist.product");
        if (!user) {
          return res.status(200).json({ wishlist: [] });
        }
        return res.status(200).json({ wishlist: user.wishlist });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
    case "POST": {
      const { userId, product, style } = req.body;
      if (!userId || !product) {
        return res.status(400).json({ message: "userId and product are required" });
      }
      try {
        const user = await User.findById(userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const exists = user.wishlist.some((item) => item.product.toString() === product);
        if (!exists) {
          user.wishlist.push({ product, style });
        }
        await user.save();
        const updatedUser = await User.findById(userId)
          .select("wishlist")
          .populate("wishlist.product");
        return res.status(200).json({ wishlist: updatedUser.wishlist });
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}