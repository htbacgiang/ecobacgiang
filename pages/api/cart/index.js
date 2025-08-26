import db from "../../../utils/db";
import Cart from "../../../models/Cart";

export default async function handler(req, res) {
  await db.connectDb();
  const { method } = req;

  switch (method) {
    case 'GET': {
      const { userId } = req.query;
      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }
      try {
        const cart = await Cart.findOne({ user: userId });
        if (!cart) {
          return res.status(200).json({ products: [], cartTotal: 0 });
        }
        return res.status(200).json(cart);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
    case 'POST': {
      // Thêm sản phẩm vào giỏ hàng
      const { user, product, quantity, price, title, image } = req.body;
      if (!user || !product) return res.status(400).json({ message: 'User and product are required' });
      try {
        let cart = await Cart.findOne({ user });
        if (!cart) {
          cart = new Cart({ user, products: [] });
        }
        const index = cart.products.findIndex(p => p.product.toString() === product);
        if (index >= 0) {
          cart.products[index].quantity += quantity;
        } else {
          cart.products.push({ product, title, image, quantity, price });
        }
        await cart.save();
        return res.status(200).json(cart);
      } catch (error) {
        return res.status(500).json({ message: error.message });
      }
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
