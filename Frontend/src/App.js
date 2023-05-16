import './App.css';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Header from './components/header/header'
import Footer from './components/footer/footer'
import About from "./components/about/about";
import Shop from "./components/shop/shop";
import ProductDetails from './components/shop/productDetails';
import Blog from "./components/blog/blog";
import Register from "./components/register/register";
import Cart from "./components/cart/cart";
import ContactPage from "./components/contact/contact";
import UserRegister from "./components/user registration/userRegister";
import Login from "./components/login/login";
import Profile from "./components/profiles/profile";
import Forgot from "./components/login/forgot";
import Reset from "./components/login/reset";
import MyOrders from "./components/boards/myOrders";
import SellerProduct from "./components/boards/AddProduct";
import SellerProducts from './components/boards/sellerProducts';
import BoardAdmin from "./components/boards/adminBoard";
import Success from "./components/cart/success"

import { CartContext } from "./components/cart/CartContext";
import UserContext from "./components/boards/UserContext";
import { ProductsProvider } from './components/boards/ProductContext';
import { ProfileProvider } from './components/profiles/ProfileContext';
import { AddProductProvider } from './components/boards/AddProductContext';


function App() {
  const [totalItems, setTotalItems] = useState(0);
  const [showSellerBoard, setShowSellerBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [showUserBoard, setShowUserBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setCurrentUser(user);
      setShowUserBoard(user.roles.includes("ROLE_USER"));
      setShowSellerBoard(user.roles.includes("ROLE_SELLER"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }
  }, []);

  const logOut = () => {
    localStorage.removeItem("user");
    setShowUserBoard(false);
    setShowSellerBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div className="App" >
      <Router>
        <CartContext.Provider value={{ totalItems, setTotalItems }}>
          <UserContext.Provider
            value={{
              showSellerBoard,
              setShowSellerBoard,
              showAdminBoard,
              setShowAdminBoard,
              showUserBoard,
              setShowUserBoard,
              currentUser,
              setCurrentUser,
              logOut,
            }}
          >
            <Header data-testid="header" />

            <div className="app-content">

              <Routes>

                <Route path="/" element={<About data-testid="about" />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/register" element={<Register />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/usersignup" element={<UserRegister isShop={false} />} />
                <Route path="/shopRegister" element={<UserRegister isShop={true} />} />
                <Route path="/signin" element={<Login />} />
                <Route path="/forgotPassword" element={<Forgot />} />
                <Route path="/resetPassword/:token" element={<Reset />} />
                <Route path="/profile" element={<ProfileProvider><Profile /></ProfileProvider>} />
                <Route path="/sellerProducts" element={<ProductsProvider><SellerProducts /></ProductsProvider>} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/success" element={<Success />} />

                {/* orders page for users only */}
                <Route path="/myOrders" element={<MyOrders />} />
                {/* board page for admins only */}
                <Route path="/adminBoard" element={<BoardAdmin />} />
                {/* add product page for sellers only */}
                <Route path="/addProduct" element={<AddProductProvider><SellerProduct /></AddProductProvider>} />


              </Routes>

            </div>

            <Footer data-testid="footer" />
          </UserContext.Provider>
        </CartContext.Provider>

      </Router>
    </div>
  );
}

export default App;
