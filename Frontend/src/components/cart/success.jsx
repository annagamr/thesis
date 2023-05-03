import React, { useEffect, useCallback, useRef, useState } from "react";
import "./cart.css";
import axios from "axios";

const Success = () => {
  const createOrderCalled = useRef(false);
  const [error, setError] = useState(null);

  const createOrder = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.id : null;
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));

    if (user && cartItems && Array.isArray(cartItems.items)) {
      try {
        const itemIds = cartItems.items.map((item) => item.id);

        const response = await axios.post(
          "http://localhost:3002/api/order/create-order",
          {
            status: "successful",
            userId: userId,
            items: itemIds,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        localStorage.removeItem("cartItems");

        const clearCartResponse = await axios.post(
          "http://localhost:3002/api/cart/clear-cart",
          {
            userId: userId,
          }
        );

        if (!clearCartResponse.ok) {
          throw new Error(`HTTP error! Status: ${clearCartResponse.status}`);
        }
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError("Error: invalid cartItems");
    }
  }, []);

  useEffect(() => {
    if (!createOrderCalled.current) {
      createOrder();
      createOrderCalled.current = true;
    }
  }, [createOrder]);

  return (
    <div className="success_page">
      <div className="success_card">
        <div className="check_div">
          <i className="checkmark">✓</i>
        </div>
        <h1>Successful Payment!</h1>
        <p>We received your order!</p>
        {!error && (
          <p className="cart_cleared_message">Cart cleared successfully</p>
        )}

        {error && <p className="error_message">{error}</p>}
      </div>
    </div>
  );
};

export default Success;
