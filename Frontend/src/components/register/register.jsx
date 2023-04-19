import React from "react";
import "./register.css";
import { Link } from "react-router-dom";
import * as images from "../../assets/assets"

const Register = () => {
  return (
    <div className="register-page">
      <div className="register-header">
        I would like to...
      </div>
    <div className="choices-container">
      <div className="create-shop">
        <div className="top-image">
          <img src={images.registerShop} alt="" />
        </div>
        <div className="btn">
          <Link to="/shopRegister" className="btn1">
            Create Shop
          </Link>
        </div>
      </div>
      <div className="become-user">
        <div className="top-image">
          <img src={images.registerUser} alt="" />
        </div>
        <div className="btn">
          <Link to="/usersignup" className="btn2">
            Become User
          </Link>
        </div>
      </div>
    </div>
    </div>

  );
};
export default Register;
