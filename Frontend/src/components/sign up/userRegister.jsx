import React, { useState, useRef } from "react";
import { isEmail } from "validator";
import AuthService from "../../services/auth.service";

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
  if (value.length < 4 || value.length > 10 || !hasLetters || (!hasNonDigits && !hasBothLettersAndDigits)) {
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

const UserRegister = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");

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

    AuthService.register(username, email, password)
      .then((response) => {
        // When AuthService.register() successfully returns data from the server
        setMessage(response.data.message);
        setSuccessful(true);
      })
      .catch((error) => {
        // When AuthService.register() returns an error
        setMessage(error.toString());
        setSuccessful(false);
      });
  };

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <form onSubmit={handleRegister}>
          {!successful && (
            <div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={updateUsername}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={updateEmail}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={updatePassword}
                  required
                />
              </div>

              <div className="form-group">
                <button className="btn btn-primary btn-block">Sign Up</button>
              </div>
            </div>
          )}
          {message && (
            <div className="form-group">
              <div
                className={
                  successful ? "alert alert-success" : "alert alert-danger"
                }
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
export default UserRegister;
