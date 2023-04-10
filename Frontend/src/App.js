import './App.css';
import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";

import Header from './components/header/header'
import Footer from './components/footer/footer'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import About from "./components/about/about";
import Shop from "./components/shop/shop";
import Blog from "./components/blog/blog";
import Register from "./components/register/register";
import Cart from "./components/cart/cart";
import ContactPage from "./components/contact/contact";
import UserRegister from "./components/user registration/userRegister";
import Login from "./components/login/login";
import Profile from "./components/profiles/profile";


import BoardUser from "./components/access/board-user.component";
import BoardSeller from "./components/access/board-seller.component";
// import BoardAdmin from "./components/access/board-admin.component";

function App() {
  
  return (
    <div className="App" >
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<About />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/usersignup" element={<UserRegister isShop={false} />} />
          <Route path="/shopRegister" element={<UserRegister isShop={true}/>} />
          <Route path="/signin" element={<Login />} />

          {/* orders page for users only */}
          <Route path="/myOrders" element={<BoardUser />} /> 
          {/* add product page for sellers only */}
          <Route path="/addProduct" element={<BoardSeller />} />
          {/* <Route path="/adminProf" element={<BoardAdmin />} /> */}

          <Route path="/profile" element={<Profile/>} />



        </Routes>
        <Footer />

      </Router>
    </div>
  );
}

export default App;
