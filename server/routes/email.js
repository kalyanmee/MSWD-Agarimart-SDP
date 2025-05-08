const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/mailer'); // Adjust path if needed

// POST route to send confirmation
router.post('/send-confirmation', async (req, res) => {
  const { email, address, cart, total } = req.body;

  console.log('📩 Email request received with:', req.body);

  if (!email || !address || !cart || !total) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const subject = 'Order Confirmation';
  const text = `
Thank you for your purchase!

📦 Items:
${cart.map(item => `- ${item.name} x${item.quantity} @ ₹${item.price}`).join('\n')}

📍 Delivery Address:
${address}

💰 Total: ₹${total}

We appreciate your business! 🌱
`;

  try {
    await sendEmail(email, subject, text);
    res.status(200).json({ message: 'Confirmation email sent' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

module.exports = router;
