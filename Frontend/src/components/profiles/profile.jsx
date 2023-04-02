import React, {useState, useEffect} from "react";
import AuthService from "../../services/auth.service";
import "./profile.css"
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
currentUser.username
  )}
  </div>)
};

export default Profile;
