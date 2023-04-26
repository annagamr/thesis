import React, { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import { useLocation } from "react-router-dom";

const MyOrders = () => {
  const [content, setContent] = useState("");
  const location = useLocation();
  const [orderCreated, setOrderCreated] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);

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

  const createOrder = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));

    if (user && cartItems) {
      try {
        const response = await fetch(
          "http://localhost:3002/api/order/create-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "successful",
              userId: user.id,
              items: cartItems.map((item) => item.id),
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const orderData = await response.json();
        console.log("Order created:", orderData);
        localStorage.removeItem("cartItems"); // Clear the cart items from localStorage
        setOrderCreated(true); // Set orderCreated to true
      } catch (error) {
        console.error("Error creating order:", error);
      }
    }
  };

  // Check for payment success when the component is initially rendered
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setPaymentSuccessful(searchParams.get("paymentSuccessful") === "true");
  }, [location.search]);

  // Create the order only when the payment is successful and the order has not been created yet
  useEffect(() => {
    if (paymentSuccessful && !orderCreated) {
      createOrder();
    }
  }, [paymentSuccessful, orderCreated]);

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
