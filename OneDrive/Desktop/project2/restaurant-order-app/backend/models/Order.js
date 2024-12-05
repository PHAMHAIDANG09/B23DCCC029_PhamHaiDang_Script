const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  items: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model('Order', orderSchema);
