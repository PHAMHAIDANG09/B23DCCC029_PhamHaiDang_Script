const mongoose = require('mongoose');
const Food = require('./models/Food');
require('dotenv').config();

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Dữ liệu món ăn
const foodData = [
  { name: 'Cá nướng', price: 150000 },
  { name: 'Cơm rang', price: 50000 },
  { name: 'Bò lúc lắc', price: 180000 },
  { name: 'Gỏi cuốn', price: 60000 },
  { name: 'Mì xào hải sản', price: 120000 },
  { name: 'Lẩu thái', price: 250000 },
];

// Hàm thêm dữ liệu
const seedFoods = async () => {
  try {
    await Food.deleteMany(); // Xóa dữ liệu cũ nếu có
    await Food.insertMany(foodData); // Chèn dữ liệu mới
    console.log('Dữ liệu món ăn đã được thêm thành công!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Lỗi khi thêm dữ liệu:', error);
    mongoose.connection.close();
  }
};

seedFoods();
