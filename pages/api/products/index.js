import mongoose from 'mongoose';
import db from '../../../utils/db';
import Product from '../../../models/Product';

export default async (req, res) => {
  try {
    await db.connectDb();
  } catch (error) {
    console.error('Database connection error:', error);
    return res.status(500).json({ status: 'error', err: 'Database connection failed' });
  }

  switch (req.method) {
    case 'GET':
      if (req.query._id) {
        await getProductById(req, res);
      } else {
        await getProducts(req, res);
      }
      break;
    case 'POST':
      if (req.body.action === 'checkSlug') {
        await checkSlug(req, res);
      } else {
        await createProduct(req, res);
      }
      break;
    case 'PUT':
      await updateProduct(req, res);
      break;
    case 'DELETE':
      await deleteProduct(req, res);
      break;
    default:
      res.status(405).json({ status: 'error', err: 'Method not allowed' });
      break;
  }
};

const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category, isDeleted: { $ne: true } } : { isDeleted: { $ne: true } };
    const products = await Product.find(filter);
    res.json({
      status: 'success',
      result: products.length,
      products,
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    return res.status(500).json({ status: 'error', err: 'Error fetching products' });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.query._id);
    if (!product) {
      return res.status(404).json({ status: 'error', err: 'Product not found' });
    }
    res.json({
      status: 'success',
      product,
    });
  } catch (err) {
    console.error('Error fetching product by ID:', err);
    return res.status(500).json({ status: 'error', err: 'Error fetching product' });
  }
};

const checkSlug = async (req, res) => {
  try {
    const { slug, _id } = req.body;
    if (!slug) {
      return res.status(400).json({ status: 'error', err: 'Slug is required' });
    }
    const normalizedSlug = slug.trim().toLowerCase();
    console.log(`Checking slug: ${normalizedSlug}, excluding _id: ${_id || 'none'}`);
    const query = { slug: normalizedSlug, isDeleted: { $ne: true } };
    if (_id) {
      query._id = { $ne: _id };
    }
    const existingProduct = await Product.findOne(query);
    console.log(`Slug check result: ${existingProduct ? 'Found' : 'Not found'}`);
    if (existingProduct) {
      return res.status(400).json({ status: 'error', err: 'Slug đã tồn tại' });
    }
    res.json({ status: 'success' });
  } catch (err) {
    console.error('Error checking slug:', err);
    return res.status(500).json({ status: 'error', err: 'Error checking slug' });
  }
};

const createProduct = async (req, res) => {
  const session = await Product.startSession();
  try {
    session.startTransaction();

    // Normalize slug
    if (req.body.slug) {
      req.body.slug = req.body.slug.trim().toLowerCase();
    }

    // Check if maSanPham already exists
    const { maSanPham } = req.body;
    const existingProductByMaSanPham = await Product.findOne({ maSanPham, isDeleted: { $ne: true } }).session(session);
    if (existingProductByMaSanPham) {
      await session.abortTransaction();
      return res.status(400).json({ status: 'error', err: 'Mã sản phẩm (maSanPham) đã tồn tại' });
    }

    const product = new Product(req.body);
    await product.save({ session });

    await session.commitTransaction();
    res.json({
      status: 'success',
      product,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error('Error creating product:', err);
    if (err.code === 11000) {
      if (err.keyPattern.maSanPham) {
        return res.status(400).json({ status: 'error', err: 'Mã sản phẩm (maSanPham) đã tồn tại' });
      }
      if (err.keyPattern.slug) {
        return res.status(400).json({ status: 'error', err: 'Slug đã tồn tại' });
      }
    }
    return res.status(500).json({ status: 'error', err: err.message || 'Error creating product' });
  } finally {
    session.endSession();
  }
};

const updateProduct = async (req, res) => {
  try {
    // Normalize slug
    if (req.body.slug) {
      req.body.slug = req.body.slug.trim().toLowerCase();
    }

    const { maSanPham } = req.body;

    // Check if maSanPham is being changed to an existing one
    if (maSanPham) {
      const existingProductByMaSanPham = await Product.findOne({
        maSanPham,
        _id: { $ne: req.query._id },
        isDeleted: { $ne: true },
      });
      if (existingProductByMaSanPham) {
        return res.status(400).json({ status: 'error', err: 'Mã sản phẩm (maSanPham) đã tồn tại' });
      }
    }

    const product = await Product.findByIdAndUpdate(req.query._id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ status: 'error', err: 'Product not found' });
    }
    res.json({
      status: 'success',
      product,
    });
  } catch (err) {
    console.error('Error updating product:', err);
    if (err.code === 11000) {
      if (err.keyPattern.maSanPham) {
        return res.status(400).json({ status: 'error', err: 'Mã sản phẩm (maSanPham) đã tồn tại' });
      }
      if (err.keyPattern.slug) {
        return res.status(400).json({ status: 'error', err: 'Slug đã tồn tại' });
      }
    }
    return res.status(500).json({ status: 'error', err: err.message || 'Error updating product' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.query._id,
      { isDeleted: true },
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ status: 'error', err: 'Product not found' });
    }
    res.json({
      status: 'success',
      message: 'Product soft deleted',
    });
  } catch (err) {
    console.error('Error deleting product:', err);
    return res.status(500).json({ status: 'error', err: 'Error deleting product' });
  }
};