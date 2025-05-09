// routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const sendEmail = require('../utils/mailer');
const { v4: uuidv4 } = require('uuid');

// Helper to generate estimated delivery date (e.g., 3 days from now)
function getEstimatedDeliveryDate() {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  return deliveryDate.toDateString(); // e.g., "Mon May 13 2025"
}

router.post('/send-confirmation', async (req, res) => {
  const { email, address, cart, total } = req.body;

  if (!email || !address || !cart || !total) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const orderId = uuidv4().slice(0, 8).toUpperCase();
  const estimatedDelivery = getEstimatedDeliveryDate();
  const subject = 'Order Confirmation';

  const html = `
    <h2>Thank you for your purchase! 🎉</h2>
    <p><strong>Order ID:</strong> ${orderId}</p>
    <h3>🛒 Order Details:</h3>
    <ul>
      ${cart.map(item => `<li>${item.name} - Qty: ${item.quantity}, Price: ₹${item.price}</li>`).join('')}
    </ul>
    <p><strong>📍 Delivery Address:</strong><br>${address}</p>
    <p><strong>💰 Total Amount:</strong> ₹${total}</p>
    <p><strong>📅 Estimated Delivery:</strong> ${estimatedDelivery}</p>
    <hr>
    <p>We appreciate your business and hope to serve you again soon! 🌱</p>
    <p>— [Your Company Name]</p>
  `;

  try {
    await sendEmail(email, subject, '', html);
    res.status(200).json({
      message: 'Confirmation email sent',
      orderId,
      estimatedDelivery
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Email send failed', error: error.toString() });
  }
});

module.exports = router;
