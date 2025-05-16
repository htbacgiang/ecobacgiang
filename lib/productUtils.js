import Product from "../models/Product";

export async function getProductsByCategory(category, limit, page = 1) {
  const skip = (page - 1) * limit;
  const products = await Product.find({ category }).limit(limit).skip(skip);
  return products;
}
