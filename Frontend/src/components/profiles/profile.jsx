import React, { useState, useEffect } from "react";
import AuthService from "../../services/auth.service";
import "./profile.css";
import pic from "./store.png";
import pic1 from "./profile.png";

const Profile = () => {
  const [sellerProf, setShowSellerProfile] = useState(false);
  const [adminProf, setShowAdminProfile] = useState(false);
  const [userProf, setShowUserProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      setShowUserProfile(user.roles.includes("ROLE_USER"));
      setShowSellerProfile(user.roles.includes("ROLE_SELLER"));
      setShowAdminProfile(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);
  return (
    <div className="profile-page">
      {sellerProf && (
        <div>
          <div className="profile-illustration"></div>
          <div className="profile-card">
            <h1 className="profile-title">SHOP DETAILS</h1>
            <div className="profile-picture">
              <img src={pic} alt="" />
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
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 0
              </div>
            </div>
            <button className="edit">Edit Profile</button>
            <button className="see-list">Listed Products</button>
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
              <img src={pic1} alt="" />
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
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 0
              </div>
            </div>
            <button className="edit">Edit Profile</button>
            <button className="see-list">Previous Orders</button>
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
    </div>
  );
};

export default Profile;
