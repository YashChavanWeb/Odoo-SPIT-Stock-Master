import { prisma } from '../utils/prisma.js';

// Create a new receipt
export const createReceipt = async (req, res) => {
  try {
    const {
      operationType,
      reference,
      from,
      to,
      contact,
      schedule,
      products,
      status,
    } = req.body;

    if (
      !operationType ||
      !reference ||
      !from ||
      !to ||
      !contact ||
      !schedule ||
      !products
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newReceipt = await prisma.receipts.create({
      data: {
        operationType,
        reference,
        from,
        to,
        contact,
        schedule,
        status: status || 'draft', // Default status is 'draft'
        products: {
          connect: products.map((productId) => ({ id: productId })), // Assuming `products` is an array of product IDs
        },
      },
    });

    return res.status(201).json(newReceipt);
  } catch (error) {
    console.error('Error creating receipt:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update products in a receipt
export const updateReceiptProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { products } = req.body;

    if (!id || !products) {
      return res
        .status(400)
        .json({ message: 'Receipt ID and products are required' });
    }

    const updatedReceipt = await prisma.receipts.update({
      where: { id },
      data: {
        products: {
          set: products.map((productId) => ({ id: productId })), // Replace with new product IDs
        },
      },
    });

    return res.json(updatedReceipt);
  } catch (error) {
    console.error('Error updating products in receipt:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update receipt details (from, to, contact, schedule)
export const updateReceiptDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { from, to, contact, schedule } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Receipt ID is required' });
    }

    const updatedReceipt = await prisma.receipts.update({
      where: { id },
      data: {
        from,
        to,
        contact,
        schedule,
      },
    });

    return res.json(updatedReceipt);
  } catch (error) {
    console.error('Error updating receipt details:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Update the status of a receipt
export const updateReceiptStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !status) {
      return res
        .status(400)
        .json({ message: 'Receipt ID and status are required' });
    }

    if (!['draft', 'ready', 'done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updatedReceipt = await prisma.receipts.update({
      where: { id },
      data: { status },
    });

    return res.json(updatedReceipt);
  } catch (error) {
    console.error('Error updating receipt status:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Receipt not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getReceipts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const cacheKey = `receipts:page:${page}`;

    const cachedReceipts = await getCache(cacheKey);
    if (cachedReceipts) {
      return res.json({
        source: 'cache',
        data: cachedReceipts.receipts,
        pagination: {
          totalReceipts: cachedReceipts.totalReceipts,
          totalPages: cachedReceipts.totalPages,
          currentPage: page,
          pageSize: limit,
        },
      });
    }

    const receipts = await prisma.receipts.findMany({
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        products: true,
      },
    });

    const totalReceipts = await prisma.receipts.count();
    const totalPages = Math.ceil(totalReceipts / limit);

    const cacheData = { receipts, totalReceipts, totalPages };
    await setCache(cacheKey, cacheData);

    return res.json({
      source: 'database',
      data: receipts,
      pagination: {
        totalReceipts,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSingleReceipt = async (req, res) => {
  try {
    const { id } = req.params;

    const receipt = await prisma.receipts.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    return res.json(receipt);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
