import { prisma } from '../utils/prisma.js';

export const updateStock = async (req, res) => {
  try {
    const updates = req.body; // array of stock updates

    if (!Array.isArray(updates) || updates.length === 0) {
      return res
        .status(400)
        .json({ message: 'Provide an array of stock updates' });
    }

    const updatedStocks = [];

    for (const item of updates) {
      const { productId, quantity, freeToUse, onHand, perUnitCost } = item;

      if (!productId) {
        continue; // skip invalid item
      }

      const existingStock = await prisma.stock.findUnique({
        where: { productId },
      });

      if (existingStock) {
        // Update existing stock
        const updatedStock = await prisma.stock.update({
          where: { id: existingStock.id },
          data: {
            quantity:
              quantity !== undefined ? quantity : existingStock.quantity,
            freeToUse:
              freeToUse !== undefined ? freeToUse : existingStock.freeToUse,
            onHand: onHand !== undefined ? onHand : existingStock.onHand,
            perUnitCost:
              perUnitCost !== undefined
                ? perUnitCost
                : existingStock.perUnitCost,
          },
        });
        updatedStocks.push(updatedStock);
      } else {
        // Create new stock record if it doesn't exist
        const newStock = await prisma.stock.create({
          data: {
            productId,
            quantity: quantity || 0,
            freeToUse: freeToUse || 0,
            onHand: onHand || 0,
            perUnitCost: perUnitCost || 0,
          },
        });
        updatedStocks.push(newStock);
      }
    }

    return res
      .status(200)
      .json({ message: 'Stock updated successfully', updatedStocks });
  } catch (error) {
    console.error('Error updating stock:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
