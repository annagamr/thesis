import React, { useState } from "react";
import AuthService from "../../services/auth.service";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
  
    AuthService.login(username, password)
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
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <form className="needs-validation" onSubmit={handleLogin}>
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
            <button className="btn btn-primary btn-block">
              <span>Login</span>
            </button>
          </div>

          {message && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {message}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default routingProps(Login);
