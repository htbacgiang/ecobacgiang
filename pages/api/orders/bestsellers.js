import db from "../../../utils/db";
import Order from "../../../models/Order";
import Product from "../../../models/Product";
import mongoose from "mongoose";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await db.connectDb();

    // Lấy danh sách đơn hàng không bị hủy
    const orders = await Order.find({ status: { $ne: "cancelled" } }).lean();

    // Tính tổng số lượng sản phẩm
    const productQuantities = {};
    orders.forEach((order) => {
      order.orderItems.forEach((item) => {
        productQuantities[item.title] = (productQuantities[item.title] || 0) + item.quantity;
      });
    });

    // Lấy thông tin chi tiết sản phẩm từ collection Product
    const productTitles = Object.keys(productQuantities);
    const products = await Product.find({ 
      name: { $in: productTitles },
      isDeleted: { $ne: true }
    }).lean();

    // Kết hợp thông tin sản phẩm với số lượng
    const sortedProducts = products
      .map((product) => ({
        _id: product._id,
        name: product.name,
        image: product.image || ['/images/placeholder.jpg'],
        rating: product.rating || 0,
        reviewCount: product.reviewCount || 0,
        price: product.price || 0,
        promotionalPrice: product.promotionalPrice || 0,
        stockStatus: product.stockStatus || 'Còn hàng',
        slug: product.slug,
        unit: product.unit || 'unit',
        description: product.description || '',
        category: product.category || '',
        categoryNameVN: product.categoryNameVN || product.category || 'Unknown',
        quantity: productQuantities[product.name] || 0
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    return res.status(200).json(sortedProducts);
  } catch (error) {
    console.error("Error fetching bestsellers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}