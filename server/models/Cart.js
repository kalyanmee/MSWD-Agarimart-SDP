const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  userId: {
    type: String, // or mongoose.Schema.Types.ObjectId if you have user collections
    required: true
  },
  productId: {
    type: String,
    required: true
  },
  name: String,
  price: Number,
  image: String,
  quantity: {
    type: Number,
    default: 1
  }
});

module.exports = mongoose.model('Cart', cartItemSchema);
