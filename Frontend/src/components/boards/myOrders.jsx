import React, { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import { useLocation } from "react-router-dom";

const MyOrders = () => {
  const [content, setContent] = useState("");
  const location = useLocation();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    UserService.userAccess().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        setContent(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            error.message ||
            error.toString()
        );
      }
    );
  }, []);

  const fetchOrders = async () => {
    // Fetch the user's orders from your API
    // ...
  };

  const clearCart = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      try {
        const response = await fetch('http://localhost:3002/api/cart/clear-cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.id }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  useEffect(() => {
    fetchOrders();

    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('paymentSuccessful') === 'true') {
      clearCart();
    }
  }, [location.search]);

  return (
    <div className="container">
      <header className="jumbotron">
        <h3>{content}</h3>
      </header>
      <div>
        <h1>My Orders</h1>
        {/* <ul>
          {orders.map((order) => (
            <li key={order.id}>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};

export default MyOrders;
