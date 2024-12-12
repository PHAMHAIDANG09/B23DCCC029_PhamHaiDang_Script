const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
  },
  items: [
    {
      foodName: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  note: { type: String, default: '' }, // Thêm trường ghi chú
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
