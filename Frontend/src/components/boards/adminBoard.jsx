import React, { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import "./allStyles.css";
import axios from "axios";

const BoardAdmin = () => {
  const [content, setContent] = useState("");
  const [userCount, setUserCount] = useState(null);
  const [users, setUsers] = useState([]);

  const [shopCount, setshopCount] = useState(null);
  const [shops, setShops] = useState([]);

  useEffect(() => {
    UserService.adminAccess().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        setContent(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            error.message ||
            error.toString()
        );
      }
    );
  }, []);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/api/user-count"
        );
        setUserCount(response.data.count);
        setUsers(response.data.users);
      } catch (error) {
        console.error(
          "An error occurred while fetching the user count:",
          error
        );
      }
    };
    const fetchShopCount = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3002/api/shops-count"
        );
        setshopCount(response.data.count);
        setShops(response.data.shops);
      } catch (error) {
        console.error(
          "An error occurred while fetching the seller count:",
          error
        );
      }
    };

    fetchShopCount();
    fetchUserCount();
  }, []);

  return (
    <div className="mainContainer">
      <div className="container">
        <header className="jumbotron">
          <h3>{content}</h3>
        </header>
      </div>
      <div className="users">
        <h2>USERS and SHOPS</h2>
        <h3>Number of Users: {userCount}</h3>
        <h3>Number of Shops: {shopCount}</h3>
        <div className="lists">
          <div>
            <h3>Users List:</h3>
            <ul className="users-list">
              {users.map((user) => (
                <li key={user._id}>{user.username}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Shops List:</h3>
            <ul className="shops-list">
              {shops.map((shop) => (
                <li key={shop._id}>{shop.username}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="right-container">
        <div className="products">
          <h2>PRODUCTS</h2>
        </div>
        <div className="blogs">
          <h2>BLOGS</h2>
        </div>
      </div>
    </div>
  );
};

export default BoardAdmin;
