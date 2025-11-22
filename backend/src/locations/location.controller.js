import { prisma } from '../utils/prisma.js';

// Create Location
export const createLocation = async (req, res) => {
  const { name, shortCode, warehouseId } = req.body;

  try {
    if (!name || !shortCode || !warehouseId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check duplicate shortcode
    const exists = await prisma.locations.findUnique({
      where: { shortCode },
    });

    if (exists) {
      return res.status(400).json({ message: 'Shortcode already taken' });
    }

    // Check warehouse exists
    const warehouse = await prisma.warehouses.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      return res.status(404).json({ message: 'Warehouse not found' });
    }

    const location = await prisma.locations.create({
      data: {
        name,
        shortCode,
        warehouseId,
      },
    });

    res.status(201).json({ message: 'Location created', location });
  } catch (error) {
    console.error('Create location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all locations
export const getLocations = async (req, res) => {
  try {
    const locations = await prisma.locations.findMany({
      include: { warehouse: true },
    });

    res.status(200).json({ locations });
  } catch (error) {
    console.error('Get locations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update location
export const updateLocation = async (req, res) => {
  const { id } = req.params;
  const { name, shortCode, warehouseId } = req.body;

  try {
    const location = await prisma.locations.findUnique({ where: { id } });

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Check duplicate shortcode if changed
    if (shortCode && shortCode !== location.shortCode) {
      const exists = await prisma.locations.findUnique({
        where: { shortCode },
      });

      if (exists) {
        return res.status(400).json({ message: 'Shortcode already exists' });
      }
    }

    const updated = await prisma.locations.update({
      where: { id },
      data: {
        name: name ?? location.name,
        shortCode: shortCode ?? location.shortCode,
        warehouseId: warehouseId ?? location.warehouseId,
      },
    });

    res.status(200).json({ message: 'Location updated', updated });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete location
export const deleteLocation = async (req, res) => {
  const { id } = req.params;

  try {
    const location = await prisma.locations.findUnique({ where: { id } });

    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    await prisma.locations.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Location deleted' });
  } catch (error) {
    console.error('Delete location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
