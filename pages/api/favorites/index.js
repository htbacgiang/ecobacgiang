import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import User from "../../../models/User";
import Product from "../../../models/Product";
import { authOptions } from "../auth/[...nextauth]";
import db from "../../../utils/db";

export default async function handler(req, res) {
  await db.connectDb();

  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = session.user.id;

  try {
    switch (req.method) {
      case "POST":
        const { productId } = req.body;

        if (!mongoose.isValidObjectId(productId)) {
          return res.status(400).json({ message: "Invalid product ID" });
        }

        // Check if product exists and is not deleted
        const product = await Product.findOne({ _id: productId, isDeleted: false });
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }

        // Check if product is already in wishlist
        const user = await User.findById(userId);
        const isInWishlist = user.wishlist.some(
          (item) => item.product.toString() === productId
        );

        if (isInWishlist) {
          return res.status(400).json({ message: "Product already in wishlist" });
        }

        // Add to wishlist
        user.wishlist.push({ product: productId, style: "" });
        await user.save();

        return res.status(200).json({ message: "Added to wishlist", wishlist: user.wishlist });

      case "GET":
        // Retrieve wishlist with populated product details
        const userWithWishlist = await User.findById(userId)
          .select("wishlist")
          .populate({
            path: "wishlist.product",
            select: "name image price slug",
            match: { isDeleted: false },
          });

        // Filter out any null products (in case referenced products were deleted)
        const wishlist = userWithWishlist.wishlist.filter((item) => item.product);

        return res.status(200).json({ wishlist });

      default:
        return res.status(405).json({ message: "Method not allowed" });
    }
  } catch (error) {
    console.error("Favorites API error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}