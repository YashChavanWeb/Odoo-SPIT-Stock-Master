import { prisma } from '../utils/prisma.js';

export const createWarehouse = async (req, res) => {
  try {
    const { name, shortCode, address } = req.body;

    if (!name || !shortCode || !address) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newWarehouse = await prisma.warehouses.create({
      data: {
        name,
        shortCode,
        address,
      },
    });

    return res.status(201).json(newWarehouse);
  } catch (error) {
    console.error('Error creating warehouse:', error);

    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Short code must be unique' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

export const updateWarehouse = async (req, res) => {
  try {
    const { id } = req.params;
    const { ...updates } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Warehouse ID is required' });
    }

    const updatedWarehouse = await prisma.warehouses.update({
      where: { id },
      data: updates,
    });

    return res.json(updatedWarehouse);
  } catch (error) {
    console.error('Error updating warehouse:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Warehouse not found' });
    }

    if (error.code === 'P2002') {
      return res.status(400).json({ message: 'Short code must be unique' });
    }

    res.status(500).json({ message: 'Server error' });
  }
};

export const getShortCodes = async (req, res) => {
  try {
    const shortCodes = await prisma.warehouses.findMany({
      select: { id: true, shortCode: true },
      orderBy: { shortCode: 'asc' },
    });

    return res.json(shortCodes);
  } catch (error) {
    console.error('Error fetching warehouse short codes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
