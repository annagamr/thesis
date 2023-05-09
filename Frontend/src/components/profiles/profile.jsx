import React, { useState, useEffect } from "react";
import "./profile.css";
import * as images from "../../assets/assets";
import { Link } from "react-router-dom";
import axios from "axios";
import productService from "../../services/product.service";

const Profile = () => {
  const [sellerProf, setShowSellerProfile] = useState(false);
  const [adminProf, setShowAdminProfile] = useState(false);
  const [userProf, setShowUserProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [numberOfProducts, setnumberOfProducts] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setCurrentUser(user);
      setShowUserProfile(user.roles.includes("ROLE_USER"));
      setShowSellerProfile(user.roles.includes("ROLE_SELLER"));
      setShowAdminProfile(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (currentUser) {
        try {
          const userId = currentUser.id;
          const response = await axios.get(
            `http://localhost:3002/api/order/get-orders/${userId}`
          );
          setNumberOfOrders(response.data.numberOfOrders);
        } catch (error) {
          console.error("Error fetching user orders:", error.message);
        }
      }
    };

    fetchUserOrders();
  }, [currentUser]);

  useEffect(() => {
    const fetchProducts = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const response = await productService.getSellerProducts(user.id);
        setnumberOfProducts(response.data.numberOfProducts);
      } catch (error) {
        console.error("Error fetching user products:", error.message);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="profile-page" data-testid="profile-page">
      {sellerProf && (
        <div>
          <div className="profile-illustration"></div>
          <div className="profile-card">
            <h1 className="profile-title">SHOP DETAILS</h1>
            <div className="profile-picture">
              <img src={images.profStore} alt="" />
            </div>
            <div className="info">
              <div className="name">
                <b>Shop Name:</b>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                {currentUser.username}
              </div>
              <div className="email">
                <b>Email:</b>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                {currentUser.email}
              </div>
              <div className="num">
                <b>Listed Products:</b>{" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {numberOfProducts}
              </div>
            </div>
            <button className="see-list">
              {" "}
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/sellerProducts"
              >
                Listed Products   
                
              </Link>
            </button>
          </div>

          <div className="faq-container">
            <div className="faq">
              <h3>How to Add Items for Selling?</h3>
              <p>
                Lorem ipsum dolor sit, amet consectetueaque libero eveniet
                asperiores impedit vitae consequuntur ducimus sunt ab illo?
              </p>
            </div>
            <div className="faq">
              <h3>How to Edit my Profile?</h3>
              <p>
                Lorem ipsum dolor sit, amet consectetueaque libero eveniet
                asperiores impedit vitae consequuntur ducimus sunt ab illo?
              </p>
            </div>
            <div className="faq">
              <h3>Where can I see Listed Products?</h3>
              <p>
                Lorem ipsum dolor sit, amet consectetueaque libero eveniet
                asperiores impedit vitae consequuntur ducimus sunt ab illo?
              </p>
            </div>
            <div className="faq">
              <h3>I have other questions</h3>
              <p>
                Lorem ipsum dolor sit, amet consectetueaque libero eveniet
                asperiores impedit vitae consequuntur ducimus sunt ab illo?
              </p>
            </div>
          </div>
          <div className="faq-title">FAQ</div>
        </div>
      )}

      {userProf && (
        <div>
          <div className="profile-illustration"></div>
          <div className="profile-card">
            <h1 className="profile-title">USER DETAILS</h1>
            <div className="profile-picture-user">
              <img src={images.profile} alt="" />
            </div>
            <div className="info">
              <div className="name">
                <b>Username:</b>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                {currentUser.username}
              </div>
              <div className="email">
                <b>Email:</b>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                {currentUser.email}
              </div>
              <div className="num">
                <b>Number of Orders:</b>{" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                {numberOfOrders}
              </div>
            </div>
            <button className="see-list">
              {" "}
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/myOrders"
              >
                Previous Orders
              </Link>
            </button>
          </div>

          <div className="faq-container">
            <div className="faq">
              <h3>How to Add Items for Buying?</h3>
              <p>
                Lorem ipsum dolor sit, amet consectetueaque libero eveniet
                asperiores impedit vitae consequuntur ducimus sunt ab illo?
              </p>
            </div>
            <div className="faq">
              <h3>How to Edit my Profile?</h3>
              <p>
                Lorem ipsum dolor sit, amet consectetueaque libero eveniet
                asperiores impedit vitae consequuntur ducimus sunt ab illo?
              </p>
            </div>
            <div className="faq">
              <h3>Where can I see Previous Orders?</h3>
              <p>
                Lorem ipsum dolor sit, amet consectetueaque libero eveniet
                asperiores impedit vitae consequuntur ducimus sunt ab illo?
              </p>
            </div>
            <div className="faq">
              <h3>I have other questions</h3>
              <p>
                Lorem ipsum dolor sit, amet consectetueaque libero eveniet
                asperiores impedit vitae consequuntur ducimus sunt ab illo?
              </p>
            </div>
          </div>
          <div className="faq-title">FAQ</div>
        </div>
      )}
      {adminProf && (
        <div>
          <div className="profile-illustration"></div>
          <div className="profile-card">
            <h1 className="profile-title">ADMIN DETAILS</h1>
            <div className="profile-picture-user">
              <img src={images.profile} alt="" />
            </div>
            <div className="info">
              <div className="name">
                <b>Username:</b>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                {currentUser.username}
              </div>
              <div className="email">
                <b>Email:</b>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                {currentUser.email}
              </div>
              <div className="role">
                <b>Role:</b>{" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ADMIN
              </div>
            </div>
            <button className="see-list">
              {" "}
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to="/adminBoard"
              >
                My Board
              </Link>
            </button>
          </div>

          <div className="faq-container">
            <div className="faq">
              <h3>How to Add New Blog Post?</h3>
              <p>
                Lorem ipsum dolor sit, amet consectetueaque libero eveniet
                asperiores impedit vitae consequuntur ducimus sunt ab illo?
              </p>
            </div>
            <div className="faq">
              <h3>Where can I see Registered Users?</h3>
              <p>
                Lorem ipsum dolor sit, amet consectetueaque libero eveniet
                asperiores impedit vitae consequuntur ducimus sunt ab illo?
              </p>
            </div>
            <div className="faq">
              <h3>How to Remove Users?</h3>
              <p>
                Lorem ipsum dolor sit, amet consectetueaque libero eveniet
                asperiores impedit vitae consequuntur ducimus sunt ab illo?
              </p>
            </div>
            <div className="faq">
              <h3>I have other questions</h3>
              <p>
                Lorem ipsum dolor sit, amet consectetueaque libero eveniet
                asperiores impedit vitae consequuntur ducimus sunt ab illo?
              </p>
            </div>
          </div>
          <div className="faq-title">FAQ</div>
        </div>
      )}
    </div>
  );
};

export default Profile;
