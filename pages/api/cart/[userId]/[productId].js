import db from "../../../../utils/db";
import Cart from "../../../../models/Cart";
import Coupon from "../../../../models/Coupon";

export default async function handler(req, res) {
  await db.connectDb();
  const { method } = req;
  const { userId, productId } = req.query;

  if (!userId) return res.status(400).json({ message: "Missing userId" });
  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found." });
  }

  try {
    switch (method) {
      case "PUT": {
        const { type } = req.body; // "increase" | "decrease"
        const index = cart.products.findIndex((p) => p.product.toString() === productId);
        if (index === -1) {
          return res.status(404).json({ message: "Product not in cart." });
        }
        if (type === "increase") {
          cart.products[index].quantity += 1;
        } else if (type === "decrease") {
          if (cart.products[index].quantity > 1) {
            cart.products[index].quantity -= 1;
          } else {
            cart.products.splice(index, 1);
          }
        }
        // Tính lại cartTotal từ products
        cart.cartTotal = cart.products.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Nếu cart rỗng => reset coupon và discount
        if (cart.products.length === 0) {
          cart.coupon = "";
          cart.discount = 0;
          cart.totalAfterDiscount = 0;
        } else if (cart.coupon) {
          // Nếu có coupon, reapply discount
          const couponData = await Coupon.findOne({ coupon: cart.coupon.toUpperCase() });
          if (couponData) {
            const now = new Date();
            const start = new Date(couponData.startDate);
            const end = new Date(couponData.endDate);
            if (now >= start && now <= end) {
              cart.discount = couponData.discount;
              cart.totalAfterDiscount = cart.cartTotal - (cart.cartTotal * couponData.discount) / 100;
            } else {
              // Coupon hết hạn => reset
              cart.coupon = "";
              cart.discount = 0;
              cart.totalAfterDiscount = cart.cartTotal;
            }
          } else {
            // Coupon không tồn tại => reset
            cart.coupon = "";
            cart.discount = 0;
            cart.totalAfterDiscount = cart.cartTotal;
          }
        } else {
          // Nếu không có coupon, totalAfterDiscount = cartTotal
          cart.totalAfterDiscount = cart.cartTotal;
        }

        await cart.save();
        return res.json(cart);
      }
      case "DELETE": {
        // Xóa product khỏi cart
        cart.products = cart.products.filter((p) => p.product.toString() !== productId);
        cart.cartTotal = cart.products.reduce((sum, item) => sum + item.price * item.quantity, 0);
        if (cart.products.length === 0) {
          cart.coupon = "";
          cart.discount = 0;
          cart.totalAfterDiscount = 0;
        } else if (cart.coupon) {
          const couponData = await Coupon.findOne({ coupon: cart.coupon.toUpperCase() });
          if (couponData) {
            const now = new Date();
            const start = new Date(couponData.startDate);
            const end = new Date(couponData.endDate);
            if (now >= start && now <= end) {
              cart.discount = couponData.discount;
              cart.totalAfterDiscount = cart.cartTotal - (cart.cartTotal * couponData.discount) / 100;
            } else {
              cart.coupon = "";
              cart.discount = 0;
              cart.totalAfterDiscount = cart.cartTotal;
            }
          } else {
            cart.coupon = "";
            cart.discount = 0;
            cart.totalAfterDiscount = cart.cartTotal;
          }
        } else {
          cart.totalAfterDiscount = cart.cartTotal;
        }
        await cart.save();
        return res.json(cart);
      }
      default:
        return res.status(405).json({ message: `Method ${method} not allowed.` });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
