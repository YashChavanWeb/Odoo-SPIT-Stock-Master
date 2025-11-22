import { prisma } from '../utils/prisma.js';
import { getCache, setCache } from '../utils/cache.js';

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const cacheKey = `products:page:${page}`;

    // Check cache
    const cachedProducts = await getCache(cacheKey);
    if (cachedProducts) {
      return res.json({
        source: 'cache',
        data: cachedProducts.products,
        pagination: {
          totalProducts: cachedProducts.totalProducts,
          totalPages: cachedProducts.totalPages,
          currentPage: page,
          pageSize: limit,
        },
      });
    }

    // Fetch from DB
    const products = await prisma.products.findMany({
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    });

    const totalProducts = await prisma.products.count();
    const totalPages = Math.ceil(totalProducts / limit);

    const cacheData = { products, totalProducts, totalPages };
    await setCache(cacheKey, cacheData);

    return res.json({
      source: 'database',
      data: products,
      pagination: {
        totalProducts,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.products.findUnique({
      where: { id },
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, sku, category, unit } = req.body;

    if (!name || !sku || !category || !unit) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newProduct = await prisma.products.create({
      data: { name, sku, category, unit },
    });

    return res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);

    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'SKU must be unique' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params;
    const { ...updates } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const updated = await prisma.products.update({
      where: { id },
      data: updates,
    });

    return res.json(updated);
  } catch (error) {
    console.error('Error updating product:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const deleted = await prisma.products.delete({
      where: { id },
    });

    return res.json({
      message: 'Product deleted successfully',
      deleted,
    });
  } catch (error) {
    console.error('Error deleting product:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};
