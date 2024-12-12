const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    console.log(req.body); // Kiểm tra dữ liệu nhận được

    const { tableNumber, items, note } = req.body;

    const newOrder = new Order({
      tableNumber,
      items,
      note: note || 'Không có ghi chú', // Gán giá trị mặc định nếu không có note
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order created successfully!', order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order', error });
  }
};


module.exports = { createOrder };
