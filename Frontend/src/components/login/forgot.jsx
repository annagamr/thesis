import React, { useState } from "react";
import "./login.css";
import axios from "axios";

const Forgot = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3002/api/forgot-password",
        { email }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response.data.error);
    }
  };

  return (
    <div className="sign-in" data-testid="forgot-page">
      <div className="login-container">
        {" "}
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Enter Email: </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">Reset Password</button>
        </form>
        {message && (
          <div className="if-success">
            <h2 style={{ color: "blue", marginTop: "25px" }}>{message}</h2>{" "}
          </div>
        )}
      </div>{" "}
    </div>
  );
};
export default Forgot;
