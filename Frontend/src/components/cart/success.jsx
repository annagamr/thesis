import React, { useEffect, useCallback, useRef } from "react";
import "./cart.css"
const Success = () => {
    const createOrderCalled = useRef(false);


  const createOrder = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.id : null;
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));

    if (user && cartItems && Array.isArray(cartItems.items)) {
      // Check if cartItems is an array
      try {
        const itemIds = cartItems.items.map((item) => item.id);

        const response = await fetch(
          "http://localhost:3002/api/order/create-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "successful",
              userId: userId,
              items: itemIds,
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // const orderData = await response.json();
        localStorage.removeItem("cartItems");

        const clearCartResponse = await fetch(
          "http://localhost:3002/api/cart/clear-cart",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: userId }),
          }
        );

        if (!clearCartResponse.ok) {
          throw new Error(`HTTP error! Status: ${clearCartResponse.status}`);
        }

        console.log("Cart cleared successfully");
      } catch (error) {
        console.error("Error creating order:", error);
      }
    } else {
      console.error("Error: invalid cartItems");
    }
  }, []);

  useEffect(() => {
    if (!createOrderCalled.current) {
      createOrder();
      createOrderCalled.current = true;
    }
  }, [createOrder]);

  return (
    <div className="success_page" >
 <div className="success_card">
      <div className="check_div">
        <i className="checkmark">✓</i>
      </div>
        <h1>Successful Payment!</h1> 
        <p>We received your order!</p>
      </div>    </div>
  );
};

export default Success;