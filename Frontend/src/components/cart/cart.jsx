import React, { useState, useEffect, useContext } from "react";
import "./cart.css";
import cartService from "../../services/cart.service";
import { loadStripe } from "@stripe/stripe-js";
import productService from "../../services/product.service";
import { CartContext } from "./CartContext";

const Cart = () => {
  const [deliveryMethod, setDeliveryMethod] = useState("shipping");
  const [deliveryFee, setDeliveryFee] = useState(450);
  const [cartItems, setCartItems] = useState([]);
  const [guestCartItems, setGuestCartItems] = useState([]);
  const [pickupLocations, setPickupLocations] = useState([]);
  const [pickupOption, setPickupOption] = useState("single");
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const { totalItems, setTotalItems } = useContext(CartContext);
  const [shippingFormValid, setShippingFormValid] = useState(false);
  const [city, setCity] = useState("");

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    address: "",
    zipCode: "",
    city: "",
  });

  const stripePromise = loadStripe(
    "pk_test_51N09ASL7vL0HlrdBRpe5TyRghU1D53BGQoYr7qnCLLlhtn9iQ9Tn0va2gE0Y5K1YtA6OV5C6TipZhlzN11eVGChz00gbfcz1bj"
  );

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

    fetchProducts().then(() => {
      // Set initial pickup locations
      setPickupLocations(
        itemsToDisplay.map((item) => ({ id: item.id, address: "" }))
      );
    });
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

  const handlePickupOptionChange = (event) => {
    setPickupOption(event.target.value);
  };

  const handlePickupAddressChange = (itemId, address) => {
    setPickupLocations(
      pickupLocations.map((item) => {
        if (item.id === itemId) {
          return { ...item, address };
        }
        return item;
      })
    );
  };

  const getGuestOrderSummaryPrice = () => {
    return guestCartItems.reduce((total, item) => {
      const price = isNaN(parseFloat(item.price)) ? 0 : parseFloat(item.price);
      return total + price;
    }, 0);
  };

  const getOrderSummaryPrice = () => {
    if (JSON.parse(localStorage.getItem("user"))) {
      return cartItems.reduce((total, item) => {
        const price = isNaN(parseFloat(item.price))
          ? 0
          : parseFloat(item.price);
        return total + price;
      }, 0);
    } else {
      return getGuestOrderSummaryPrice();
    }
  };
  // Items to Display
  const itemsToDisplay = (
    JSON.parse(localStorage.getItem("user")) ? cartItems : guestCartItems
  ).filter((item) => item !== null);

  const handleProceedToPayment = async () => {
    setIsPaymentProcessing(true);

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Sign up or Sign in");
    } else {
      try {
        const response = await fetch(
          process.env.REACT_APP_BACKEND_ENDPOINT +
            "/api/create-checkout-session",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              price: (getOrderSummaryPrice() + deliveryFee) * 100,
            }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Create cartItems array
        const items = itemsToDisplay.map((item) => ({
          id: item.id,
          title: item.title,
          author: item.author,
          price: item.price,
        }));
        const cartItems = { userId: user.id, items };
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        // Use Stripe.js to redirect the user to the Checkout page
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.sessionId,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    setIsPaymentProcessing(false);
  };

  // Removing items from cart
  const handleRemoveFromCart = async (itemId) => {
    try {
      if (JSON.parse(localStorage.getItem("user"))) {
        await cartService.removeFromCart(itemId);
        // Update cart items after removal
        const updatedCartItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedCartItems);
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        const updatedGuestCart = guestCart.filter(
          (item) => item.product !== itemId
        );
        localStorage.setItem("guestCart", JSON.stringify(updatedGuestCart));
        setGuestCartItems(guestCartItems.filter((item) => item.id !== itemId));
      }
      // Update the total items count in the context
      setTotalItems(totalItems - 1);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handleShippingInputChange = () => {
    const firstNameInput = document.querySelector(
      "input[placeholder='First Name']"
    );
    const lastNameInput = document.querySelector(
      "input[placeholder='Last Name']"
    );
    const addressInput = document.querySelector("input[placeholder='Address']");
    const zipCodeInput = document.querySelector(
      "input[placeholder='Zip Code']"
    );
    const cityInput = document.querySelector("select[name='city']");

    const firstName = firstNameInput ? firstNameInput.value : "";
    const lastName = lastNameInput ? lastNameInput.value : "";
    const address = addressInput ? addressInput.value : "";
    const zipCode = zipCodeInput ? zipCodeInput.value : "";
    const city = cityInput ? cityInput.value : "";

    const validCities = [
      "Budapest",
      "Pecs",
      "Debrecen",
      "Miskolc",
      "Eger",
      "Szeged",
      "Gyor",
    ];

    const isZipCodeValid = /^\d+$/.test(zipCode);
    const isCityValid = validCities.includes(city);

    setErrors({
      firstName: firstName.length > 0 ? "" : "*",
      lastName: lastName.length > 0 ? "" : "*",
      address: address.length > 0 ? "" : "*",
      zipCode: isZipCodeValid ? "" : "*",
      city: isCityValid ? "" : "*",
    });

    const isFormValid =
      firstName.length > 0 &&
      lastName.length > 0 &&
      address.length > 0 &&
      isZipCodeValid &&
      isCityValid &&

    setShippingFormValid(isFormValid);
  };

  useEffect(() => {
    handleShippingInputChange();
  }, [city]);

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
                <input
                  type="text"
                  placeholder="First Name"
                  onChange={handleShippingInputChange}
                />
                <span className="error">{errors.firstName}</span>

                <input
                  type="text"
                  placeholder="Last Name"
                  onChange={handleShippingInputChange}
                />
                <span className="error">{errors.lastName}</span>
              </div>
              <div className="address">
                <input
                  type="text"
                  placeholder="Address"
                  onChange={handleShippingInputChange}
                />
                <span className="error">{errors.address}</span>

                <input
                  type="text"
                  placeholder="Zip Code"
                  onChange={handleShippingInputChange}
                />
                <span className="error">{errors.zipCode}</span>

                <select
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                  }}
                  name="city"
                  placeholder="City"
                >
                  <option value="">Select city</option>
                  <option value="Budapest">Budapest</option>
                  <option value="Pecs">Pecs</option>
                  <option value="Debrecen">Debrecen</option>
                  <option value="Miskolc">Miskolc</option>
                  <option value="Eger">Eger</option>
                  <option value="Szeged">Szeged</option>
                  <option value="Gyor">Gyor</option>
                </select>
                <span className="error">{errors.city}</span>

              </div>
            </div>
          )}

          {deliveryMethod === "pickup" && (
            <div className="pickup_card">
              <div className="pickup_method">
                <label>
                  <input
                    type="radio"
                    value="single"
                    checked={pickupOption === "single"}
                    onChange={handlePickupOptionChange}
                  />
                  <h2>From one location</h2>
                </label>
                <label>
                  <input
                    type="radio"
                    value="multiple"
                    checked={pickupOption === "multiple"}
                    onChange={handlePickupOptionChange}
                  />
                  <h2>From items' original locations</h2>
                </label>
              </div>
              {pickupOption === "single" && (
                <div className="single_pickup_address">
                  <h2>You can pick up your items here:</h2>
                  <p>114 Aurora Street, Budapest, 1089</p>{" "}
                </div>
              )}

              {pickupOption === "multiple" && (
                <div className="multiple_pickup_addresses">
                  <h2>Location of Each Item in Your Cart:</h2>
                  {itemsToDisplay.map((item) => (
                    <div key={item.id} className="item_pickup_address">
                      <ul key={item.id}>
                        <li>
                          {item.street}, {item.city}, {item.zipCode}
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="proceed">
            <button
              onClick={handleProceedToPayment}
              disabled={
                (deliveryMethod === "shipping" && !shippingFormValid) ||
                isPaymentProcessing
              }
            >
              Proceed to payment
            </button>
          </div>
        </div>
      </div>
      <div className="order_summary">
        <h1>Order Summary</h1>
        <div className="summary_card">
          <div className="summary_items">
            {itemsToDisplay.map((item, index) => (
              <div key={index} className="cart_item">
                <div className="product_img">
                  <img
                    src={
                      process.env.REACT_APP_BACKEND_ENDPOINT + "/" + item.image
                    }
                    alt="Product"
                  />{" "}
                </div>
                <div className="product_info">
                  <h1>{item.title}</h1>
                  <button
                    className="close-btn"
                    onClick={() => handleRemoveFromCart(item.id)}
                  >
                    &times;
                  </button>
                  <div className="product_rate_info">
                    <p>HUF {item.price}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
