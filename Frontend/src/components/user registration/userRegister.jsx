import React, { useState } from "react";
import { isEmail } from "validator";
import axios from "axios";
import "./userRegister.css";

function register(username, email, password, roles) {
  return axios.post("http://localhost:3002/api/auth/signup", {
    username,
    email,
    password,
    roles,
  });
}
//if it's true we send error message
const valid_em = (value) => {
  if (!isEmail(value)) {
    return true;
  } else {
    return false;
  }
};

//username can be only letters or letters and digits together
const valid_name = (value) => {
  const hasLetters = /[a-zA-Z]/.test(value);
  const hasNonDigits = /\D/.test(value);
  const hasBothLettersAndDigits = /[a-zA-Z]+\d+|\d+[a-zA-Z]+/.test(value);
  if (
    value.length < 4 ||
    value.length > 10 ||
    !hasLetters ||
    (!hasNonDigits && !hasBothLettersAndDigits)
  ) {
    return true;
  } else {
    return false;
  }
};

function valid_password(value) {
  const hasLetters = /[a-zA-Z]/.test(value);
  const hasNumbers = /[0-9]/.test(value);
  if (value.length < 8 || value.length > 15 || !hasLetters || !hasNumbers) {
    return true;
  } else {
    return false;
  }
}

const UserRegister = ({ isShop }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [roles] = useState(isShop ? ["seller"] : ["user"]);

  function updateEmail(e) {
    const newEmail = e.target.value;
    setEmail(newEmail);
  }

  function updateUsername(e) {
    const newUsername = e.target.value;
    setUsername(newUsername);
  }

  function updatePassword(e) {
    const newPassword = e.target.value;
    setPassword(newPassword);
  }

  const handleRegister = (e) => {
    e.preventDefault();
    setMessage("");
    setSuccessful(false);

    //guard clauses
    if (valid_name(username)) {
      setMessage("Invalid username");
      setSuccessful(false);
      return;
    } else if (valid_em(email)) {
      setMessage("Invalid email");
      setSuccessful(false);
      return;
    } else if (valid_password(password)) {
      setMessage("Invalid password");
      setSuccessful(false);
      return;
    }
    //x guard clauses x\\

    register(username, email, password, roles)
      .then((response) => {
        // When register() successfully returns data from the server
        setMessage(response.data.message);
        setSuccessful(true);
      })
      .catch((error) => {
        // When register() returns an error
        if (error.response) {
          setMessage(error.response.data.message);
        } else {
          setMessage(error.toString());
        }
        setSuccessful(false);
      });
  };

  return (
    <div className="registration-page">
      <div className="registration-form">
        <div className="title">
          <h2>Welcome!</h2> <br /> <h3>Fill the Form to Register!</h3>
        </div>
        <form onSubmit={handleRegister}>
          {!successful && (
            <div>
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

              <div className="item-email">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  value={email}
                  onChange={updateEmail}
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

              <div className="signup-button">
                <button>Sign Up</button>
              </div>
            </div>
          )}
          {message && <div className="error">{message}</div>}
        </form>
      </div>
    </div>
  );
};
export default UserRegister;
