import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  
  useEffect(() => {
    const fetchFoods = async () => {
      const { data } = await axios.get('http://localhost:5000/api/foods');
      setFoods(data);
    };
    fetchFoods();
  }, []);

  const addToCart = (food) => {
    const item = cart.find(item => item.food.name === food.name);
    if (item) {
      item.quantity++;
      setCart([...cart]);
    } else {
      setCart([...cart, { food, quantity: 1 }]);
    }
  };

  const handleOrder = async () => {
    await axios.post('http://localhost:5000/api/orders', {
      tableNumber: 1,
      items: cart.map(item => ({ food: item.food._id, quantity: item.quantity })),
    });
    alert('Order placed!');
    setCart([]);
  };

  return (
    <div className="container">
      <h1>Menu</h1>
      <ul>
        {foods.map(food => (
          <li key={food._id}>
            <span>{food.name} - ${food.price}</span>
            <button onClick={() => addToCart(food)}>Add to Cart</button>
          </li>
        ))}
      </ul>

      <div className="cart">
        <h2>Cart</h2>
        {cart.length > 0 ? (
          <ul>
            {cart.map(item => (
              <li key={item.food._id} className="cart-item">
                <span>{item.food.name} x {item.quantity}</span>
                <button onClick={() => setCart(cart.filter(i => i.food._id !== item.food._id))}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Your cart is empty.</p>
        )}
        <button onClick={handleOrder} disabled={cart.length === 0}>Place Order</button>
      </div>
    </div>
  );
}

export default App;
