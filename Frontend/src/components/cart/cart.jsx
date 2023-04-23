import React, { useState, useEffect } from "react";
import "./cart.css";
import cartService from "../../services/cart.service";
import productService from "../../services/product.service";

const Cart = () => {
  const [deliveryMethod, setDeliveryMethod] = useState("shipping");
  const [deliveryFee, setDeliveryFee] = useState(450);
  const [cartItems, setCartItems] = useState([]);
  const [guestCartItems, setGuestCartItems] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        try {
          const response = await cartService.getCart(user.id);
          setCartItems(response.cartItems);
        } catch (error) {
          console.log(error);
        }
      } else {
        // If user is not logged in, fetch guest cart items from localStorage
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const guestCartProductIds = guestCart.map((item) => item.product);

        // Fetch product details for guest cart items
        Promise.all(
          guestCartProductIds.map(async (productId) => {
            const response = await productService.getProductById(productId);
            return response.product;
          })
        )
          .then((products) => {
            setGuestCartItems(products);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    };
    fetchProducts();
  }, []);

  const handleDeliveryMethodChange = (event) => {
    const selectedMethod = event.target.value;
    setDeliveryMethod(selectedMethod);
    if (selectedMethod === "shipping") {
      setDeliveryFee(450);
    } else if (selectedMethod === "pickup") {
      setDeliveryFee(0);
    }
  };
  const getOrderSummaryPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = isNaN(parseFloat(item.price)) ? 0 : parseFloat(item.price);
      return total + price;
    }, 0);
  };

  const handleProceedToPayment = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Sign up or Sign in");
    } else {
      // Proceed with the payment process for logged-in users
    }
  };

  const itemsToDisplay = JSON.parse(localStorage.getItem("user"))
    ? cartItems
    : guestCartItems;

  return (
    <div className="cart-container">
      <div className="payment_details">
        <div className="details_card">
          <h1 id="details-h1">I would like to</h1>

          <div className="delivery_method">
            <label>
              <input
                type="radio"
                value="shipping"
                checked={deliveryMethod === "shipping"}
                onChange={handleDeliveryMethodChange}
              />
              <h1>Deliver my Order</h1>
            </label>
            <label>
              <input
                type="radio"
                value="pickup"
                checked={deliveryMethod === "pickup"}
                onChange={handleDeliveryMethodChange}
              />
              <h1>Pick up my Order</h1>
            </label>
          </div>

          {deliveryMethod === "shipping" && (
            <div className="name_address">
              <div className="first_lastName">
                <input type="text" placeholder="First Name" />
                <input type="text" placeholder="Last Name" />
              </div>
              <div className="address">
                <input type="text" placeholder="Address" />
                <input type="text" placeholder="Zip Code" />
                <input type="text" placeholder="City" />
                <input type="text" placeholder="Country" />
              </div>
            </div>
          )}

          {deliveryMethod === "pickup" && (
            <div className="pickup_card">
              <div className="pickup_details">
                <h4>You can pick the order up at the address:</h4>
                <p>Bharat House Bombay Samachar Road</p>
                <p>Zip Code:</p>
                <p>City:</p>
              </div>
            </div>
          )}

          <div className="proceed">
            <button onClick={handleProceedToPayment}>Proceed to payment</button>
          </div>
        </div>
      </div>
      <div className="order_summary">
        <h1>Order Summary</h1>
        <div className="summary_card">
          {itemsToDisplay.map((item, index) => (
            <div key={index} className="cart_item">
              <div className="product_img">
                <img
                  src={"http://localhost:3002/" + item.image}
                  alt="Product Image"
                />{" "}
              </div>
              <div className="product_info">
                <h1>{item.title}</h1>
                <div className="close-btn">
                  <i className="fa fa-close">x</i>
                </div>
                <div className="product_rate_info">
                  <p>HUF {item.price}</p>
                </div>
              </div>
            </div>
          ))}
          <hr />
          <div className="order_price">
            <p>Order summary</p>
            <h4>HUF {getOrderSummaryPrice().toFixed(2)}</h4>
          </div>
          <div className="order_service">
            <p>Delivery Fee</p>
            <h4>HUF {deliveryFee}</h4>
          </div>
          <div className="order_total">
            <p>Total Amount</p>
            <h4>HUF {(getOrderSummaryPrice() + deliveryFee).toFixed(2)}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
