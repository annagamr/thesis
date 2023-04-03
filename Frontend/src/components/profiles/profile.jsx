import React, { useState, useEffect } from "react";
import AuthService from "../../services/auth.service";
import "./profile.css";
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
      {sellerProf && <div className="profile-card">
      <h1 className="profile-title">My Account</h1>
      <div className="profile-picture">
        <img src="" alt="" />
      </div>
      <div className="info">
      <div className="name">Shop Name: {currentUser.username}</div>
      <div className="email">Email: {currentUser.email}</div>
      <div className="num">Listed Products: 0</div>
      </div>
      <button className="edit">Edit Profile</button>
      </div>}
    </div>
  );
};

export default Profile;
