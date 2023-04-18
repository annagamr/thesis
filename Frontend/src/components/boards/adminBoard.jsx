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
  const [productCount, setproductCount] = useState(null);
  const [productss, setProductss] = useState([]);

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

    const fetchProductCount = async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/products");
        setproductCount(response.data.count);
        setProductss(response.data.products);
        console.log(response.data.products);
      } catch (error) {
        console.error(
          "An error occurred while fetching the products count:",
          error
        );
      }
    };
    fetchProductCount();
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
        <h3>
          Number of Users: {userCount}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          Number of Shops: {shopCount}
        </h3>
        <div className="lists">
          <div>
            <h3>Users:</h3>
            <ol className="users-list">
              {users.map((user) => (
                <li key={user._id}>
                  {user.username} <span>&times;</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3>Shops:</h3>
            <ol className="shops-list">
              {shops.map((shop) => (
                <li key={shop._id}>
                  {shop.username} <span>&times;</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <div className="right-container">
        <div className="products">
          <h2>PRODUCTS</h2>
          <h3>Number of Products: {productCount}</h3>
          <div className="products-listed">
          <ol className="products-list">
              {productss.map((product) => (
                <li key={product._id}>
                  {product.title} <span>&times;</span> <br/>
                  {product.author}
                </li>
              ))}
            </ol>
            </div>
        </div>
        <div className="blogs">
          <h2>BLOGS</h2>
        </div>
      </div>
    </div>
  );
};

export default BoardAdmin;
