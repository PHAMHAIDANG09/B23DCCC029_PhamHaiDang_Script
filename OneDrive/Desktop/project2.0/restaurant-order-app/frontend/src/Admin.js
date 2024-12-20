import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Admin.css';

function Admin() {
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState({}); // State lưu trạng thái checkbox cho từng order

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/orders');
        setOrders(data);

        // Khởi tạo trạng thái checkbox mặc định là false
        const initialStatus = {};
        data.forEach(order => {
          initialStatus[order._id] = { sent: false, paid: false };
        });
        setOrderStatus(initialStatus);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const handleCheckboxChange = (orderId, field) => {
    setOrderStatus({
      ...orderStatus,
      [orderId]: {
        ...orderStatus[orderId],
        [field]: !orderStatus[orderId][field], // Đảo ngược trạng thái checkbox
      },
    });
  };

  return (
    <div className="admin-container">
      <h1>Khách gọi món</h1>
      {orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Số bàn</th>
              <th>Các món</th>
              <th>Ghi chú</th>
              <th>Thời gian đặt món</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.tableNumber}</td>
                <td>
                  {order.items.map((item, index) => (
                    <div key={index}>
                      {item.foodName} x {item.quantity}
                    </div>
                  ))}
                </td>
                <td>{order.note || 'Không có ghi chú'}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={orderStatus[order._id]?.sent || false}
                        onChange={() => handleCheckboxChange(order._id, 'sent')}
                      />
                      Đã gửi khách
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        checked={orderStatus[order._id]?.paid || false}
                        onChange={() => handleCheckboxChange(order._id, 'paid')}
                      />
                      Khách đã thanh toán
                    </label>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default Admin; 