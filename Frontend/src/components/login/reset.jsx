import { useState } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import axios from "axios";
import "./login.css";

const Reset = () => {
  const [newPass, setNewPassword] = useState("");
  const [repeatPass, setRepeatPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessful(false);

    if (newPass !== repeatPass) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_ENDPOINT + "/api/reset-password",
        {
          token,
          newPass,
        }
      );

      setMessage(response.data.message);
      setSuccessful(true);
    } catch (error) {
      setMessage(error.response.data.error);
      setSuccessful(false);
    }
  };

  return (
    <div className="sign-in" data-testid="reset-page">
      <div className="login-container">
        {!successful && (
          <>
            <form onSubmit={handleSubmit}>
              <label htmlFor="newPassword">New Password: </label>
              <input
                id="newPassword"
                type="password"
                value={newPass}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label htmlFor="repeatPassword">Repeat Password: </label>
              <input
                id="repeatPassword"
                type="password"
                value={repeatPass}
                onChange={(e) => setRepeatPassword(e.target.value)}
              />
              <button type="submit">Reset Password</button>
            </form>
            {message && (
              <div className="error-message">
                <p style={{ color: "red" }}>{message}</p>
              </div>
            )}
          </>
        )}
        {successful && (
          <div className="if-success">
            <h2 style={{ color: "blue" }}>{message}</h2>{" "}
          </div>
        )}
      </div>{" "}
    </div>
  );
};

export default Reset;
