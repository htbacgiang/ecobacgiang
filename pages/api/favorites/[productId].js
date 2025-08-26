import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import User from "../../../models/User";
import { authOptions } from "../auth/[...nextauth]";
import db from "../../../utils/db";

export default async function handler(req, res) {
  await db.connectDb();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const userId = session.user.id;
  const { productId } = req.query;

  if (!mongoose.isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    switch (req.method) {
      case "DELETE":
        // Remove product from wishlist
        const user = await User.findById(userId);
        const initialLength = user.wishlist.length;
        user.wishlist = user.wishlist.filter(
          (item) => item.product.toString() !== productId
        );

        if (user.wishlist.length === initialLength) {
          return res.status(404).json({ message: "Product not in wishlist" });
        }

        await user.save();
        return res.status(200).json({ message: "Removed from wishlist", wishlist: user.wishlist });

      default:
        return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Favorites API error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}