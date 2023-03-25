import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./login.css";

async function signin(username, password) {
  try {
    const response = await axios.post("http://localhost:3002/api/auth/signin", {
      username,
      password
    });
    if (response.data && response.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to login.");
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
      .then(() => {
        // Navigate to the profile page and reload the page
        props.router.navigate("/profile");
        window.location.reload();
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
          <h2>Sign In</h2>
        </div>
        <form onSubmit={handleLogin}>
          <div className="item-username">
            <label htmlFor="username">Username</label>
            <input
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
              type="password"
              name="password"
              value={password}
              onChange={updatePassword}
              required
            />
          </div>

          <div className="item-button">
            <button className="login-button">
              <span>Login</span>
            </button>
          </div>

          {message && (
            <div className="error">        
                {message}
      
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default routingProps(Login);
