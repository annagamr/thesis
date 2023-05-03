import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./login.css";
import { Link } from "react-router-dom";
import userService from "../../services/user.service";
import cartService from "../../services/cart.service";

export async function signin(username, password) {
  try {
    const response = await axios.post("http://localhost:3002/api/auth/signin", {
      username,
      password,
    });
    if (response.data && response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return { success: true, data: response.data };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Unsuccessful Login Attempt! Double check your credentials!",
    };
  }
}

function routingProps(Component) {
  function ComponentWithRouterProp(props) {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return <Component {...props} router={{ location, navigate, params }} />;
  }
  return ComponentWithRouterProp;
}

const Login = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  //Functions
  function updateUsername(e) {
    const newUsername = e.target.value;
    setUsername(newUsername);
  }

  function updatePassword(e) {
    const newPassword = e.target.value;
    setPassword(newPassword);
  }

  function handleLogin(e) {
    e.preventDefault();
    setMessage("");

    signin(username, password)
      .then(async (result) => {
        if (result.success) {
          // Get user's cart after logging in
          const user = JSON.parse(localStorage.getItem("user"));
          const response = await cartService.getCart(user.id);

          // Merge guestCart with the user's cart
          const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
          if (guestCart.length > 0) {
            const headers = userService.getAccessTokenHeaderFromLocalStorage();
            console.log(headers);

            // Check if cartItems exists in the response
            const userCartItems = response.cartItems
              ? response.cartItems.map((item) => item.id)
              : [];

            for (const item of guestCart) {
              // Check if the item is not already in the user's cart
              if (!userCartItems.includes(item.product)) {
                try {
                  await axios.post(
                    `http://localhost:3002/api/cart/add/${item.product}`,
                    {},
                    { headers: headers }
                  );
                } catch (error) {
                  console.log("Error adding product to cart:", error);
                }
              }
            }
            // Clear guestCart from localStorage
            localStorage.removeItem("guestCart");
          }

          // Navigate to the profile page and reload the page
          props.router.navigate("/profile");
          window.location.reload();
        } else {
          setMessage(result.error);
        }
      })
      .catch((error) => {
        // Set an error message if the login fails
        setMessage(error.toString());
      });
  }

  //x Functions x\\
  return (
    <div className="sign-in">
      <div className="login-container">
        <div className="title">
          <h2>SIGN IN</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="item-username">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={username}
              onChange={updateUsername}
              required
            />
          </div>

          <div className="item-password">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={updatePassword}
              required
            />
          </div>
          <Link id="forgot-quest" to={"/forgotPassword"}>
            Forgot Password?
          </Link>
          <div className="item-button">
            <button className="login-button">
              <span>Login</span>
            </button>
          </div>

          {message && (
            <div className="error" data-testid="error-message">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default routingProps(Login);
