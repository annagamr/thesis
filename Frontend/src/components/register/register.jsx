import React from "react";
import "./register.css";
import { Link } from "react-router-dom";
import shop from "./shop1.png";
import user from "./user.png";

const Register = () => {
  return (
    <div className="register-page">
      <div className="register-header">
        I would like to...
      </div>
    <div className="choices-container">
      <div className="create-shop">
        <div className="top-image">
          <img src={shop} alt="" />
        </div>
        <div className="btn">
          <Link to="/shop-registration" className="btn1">
            Create Shop
          </Link>
        </div>
      </div>
      <div className="become-user">
        <div className="top-image">
          <img src={user} alt="" />
        </div>
        <div className="btn">
          <Link to="/user-registration" className="btn2">
            Become User
          </Link>
        </div>
      </div>
    </div>
    </div>

  );
};
export default Register;