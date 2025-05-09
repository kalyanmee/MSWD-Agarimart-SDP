const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');

// Route for creating Razorpay order
router.post('/create-order', createOrder);

// Route for verifying Razorpay payment
router.post('/verify', verifyPayment);

module.exports = router;
