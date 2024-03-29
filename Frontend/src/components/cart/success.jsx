import React, { useEffect, useCallback, useRef, useState, useContext} from "react";
import "./cart.css";
import axios from "axios";
import { CartContext } from "../cart/CartContext";

const Success = () => {
  const createOrderCalled = useRef(false);
  const [error, setError] = useState(null);
  const { setTotalItems } = useContext(CartContext);

  const createOrder = useCallback(async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.id : null;
    const cartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (user && cartItems && Array.isArray(cartItems.items)) {
      try {
        const token = user.accessToken;
        const itemIds = cartItems.items.map((item) => item.id);

        const response = await axios.post(
          process.env.REACT_APP_BACKEND_ENDPOINT + "/api/order/create-order",
          {
            status: "successful",
            userId: userId,
            items: itemIds,
          },
          {
            headers: {
              "x-access-token": token,
            },
          }
        );

        if (response.status !== 200) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        localStorage.removeItem("cartItems");

        const clearCartResponse = await axios.post(
          process.env.REACT_APP_BACKEND_ENDPOINT + "/api/cart/clear-cart",
          {
            userId: userId,
          }
        );
        if (clearCartResponse.status !== 200) {
          throw new Error(`HTTP error! Status: ${clearCartResponse.status}`);
        } else {
          setTotalItems(0);
        }
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError("Error: invalid cartItems");
    }
      // eslint-disable-next-line
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
          <p className="cart_cleared_message">Cart cleared successfully!</p>
        )}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Success;
