const Food = require('../models/Food');

const getFoods = async (req, res) => {
  const foods = await Food.find({});
  res.json(foods);
};

module.exports = { getFoods };
