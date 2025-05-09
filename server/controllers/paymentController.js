const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay instance
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Store key_id in .env
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Store key_secret in .env
});

// Create order for Razorpay
exports.createOrder = (req, res) => {
  const amount = req.body.total;  // Amount in paise (1 INR = 100 paise)
  const options = {
    amount: amount,
    currency: 'INR',
    receipt: 'order_rcptid_11', // You can change this as needed
  };

  razorpayInstance.orders.create(options, function (err, order) {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    res.json({
      success: true,
      order: order,
    });
  });
};

// Verify Razorpay payment
exports.verifyPayment = (req, res) => {
  const { orderId, paymentId, signature } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET) // Use your Razorpay secret
    .update(orderId + '|' + paymentId)
    .digest('hex');

  if (generatedSignature === signature) {
    // Payment is successful
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
};
