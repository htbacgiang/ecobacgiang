import db from "../../../../utils/db";
import Cart from "../../../../models/Cart";
import Product from "../../../../models/Product";
import Coupon from "../../../../models/Coupon"; // Giả sử bạn có model Coupon

export default async function handler(req, res) {
  const { method } = req;
  const userId = req.query.userId;

  await db.connectDb();

  if (method === "POST") {
    try {
      const { cartItems, coupon, discount, totalAfterDiscount } = req.body;

      // Tìm hoặc tạo giỏ hàng cho người dùng
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({
          user: userId,
          products: [],
          cartTotal: 0,
          coupon: "",
          discount: 0,
          totalAfterDiscount: 0,
        });
      }

      // Đồng bộ sản phẩm từ localStorage
      for (const item of cartItems) {
        const product = await Product.findById(item.product);
        if (product) {
          const existingItem = cart.products.find(
            (p) => p.product.toString() === item.product
          );
          if (existingItem) {
            existingItem.quantity = item.quantity; // Cập nhật số lượng
          } else {
            cart.products.push({
              product: item.product,
              title: item.title,
              price: item.price,
              image: item.image,
              quantity: item.quantity,
            });
          }
        }
      }

      // Cập nhật tổng tiền
      cart.cartTotal = cart.products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Kiểm tra và áp dụng mã giảm giá
      if (coupon) {
        const couponData = await Coupon.findOne({ code: coupon.toUpperCase() });
        if (couponData) {
          const currentDate = new Date();
          const start = new Date(couponData.startDate);
          const end = new Date(couponData.endDate);
          if (currentDate >= start && currentDate <= end) {
            cart.coupon = coupon;
            cart.discount = couponData.discount;
            cart.totalAfterDiscount =
              cart.cartTotal * (1 - couponData.discount / 100);
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
        cart.coupon = "";
        cart.discount = 0;
        cart.totalAfterDiscount = cart.cartTotal;
      }

      await cart.save();

      // Trả về dữ liệu giỏ hàng đã đồng bộ
      res.status(200).json({
        products: cart.products,
        cartTotal: cart.cartTotal,
        coupon: cart.coupon,
        discount: cart.discount,
        totalAfterDiscount: cart.totalAfterDiscount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error syncing cart" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}