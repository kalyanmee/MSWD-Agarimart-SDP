const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Order = require('../models/Order');

// COD order endpoint
router.post('/cod', async (req, res) => {
  try {
    const { email, address, paymentMethod, items, total } = req.body;

    if (!email || !address || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Save order to DB
    const newOrder = new Order({ email, address, paymentMethod, items, total });
    await newOrder.save();

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Order Confirmation - Cash on Delivery',
      html: `
        <h2>Thank you for your order!</h2>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p><strong>Total:</strong> ₹${total}</p>
        <p><strong>Delivery Address:</strong><br/>${address}</p>
        <p>We’ve received your order and will process it shortly.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Order placed successfully.' });
  } catch (error) {
    console.error('COD order error:', error);
    return res.status(500).json({ message: 'Failed to process COD order' });
  }
});

module.exports = router;
