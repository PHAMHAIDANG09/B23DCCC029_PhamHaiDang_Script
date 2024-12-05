const Order = require('../models/Order');

const createOrder = async (req, res) => {
  const { tableNumber, items } = req.body;
  const order = new Order({ tableNumber, items });
  await order.save();
  res.status(201).json(order);
};

module.exports = { createOrder };
