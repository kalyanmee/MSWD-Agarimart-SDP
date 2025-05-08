const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// Add item to cart
router.post('/add', async (req, res) => {
  const { userId, productId, name, price, image } = req.body;

  try {
    // Check if item already exists in user's cart
    let item = await Cart.findOne({ userId, productId });

    if (item) {
      // If it exists, increase quantity
      item.quantity += 1;
      await item.save();
    } else {
      // If not, create new cart item
      const newItem = new Cart({ userId, productId, name, price, image });
      await newItem.save();
    }

    res.json({ message: 'Item added to cart' });

  } catch (error) {
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
});

// Get cart items by userId
router.get('/:userId', async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.params.userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// Remove item from cart
router.delete('/:userId/:productId', async (req, res) => {
  try {
    await Cart.findOneAndDelete({
      userId: req.params.userId,
      productId: req.params.productId
    });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove item from cart' });
  }
});

// Clear cart for user
router.delete('/clear/:userId', async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.params.userId });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear cart' });
  }
});

module.exports = router;
