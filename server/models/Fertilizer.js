const mongoose = require('mongoose');

const fertilizerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: String,
  quantity: Number,
  price: Number,
  description: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Fertilizer', fertilizerSchema);
