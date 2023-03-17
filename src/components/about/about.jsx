import React, { useState, useEffect } from "react";
import cover1 from "./cover1.jpg";
import cover2 from "./cover2.jpg";
import cover3 from "./cover3.jpg";
import cover4 from "./cover4.jpg";
import cover5 from "./cover5.jpg";
import cover6 from "./cover6.jpg";
import products from "./products.png";
import store from "./store.jpg";
import cream from "./cream.png";
import makeup from "./primer.png";
import lotion from "./lotion.png";
import perfume from "./perfume.png";
import shampoo from "./shampoo.png";
import sun from "./sun-block.png";
import order from "./order.png";
import sell from "./start-selling.png";
import skin from "./skin.jpg";

import "./about.css";
import { RiSeedlingFill } from "react-icons/ri";
import { IconContext } from "react-icons";
import { CiBadgeDollar } from "react-icons/ci";
import { BsGlobe } from "react-icons/bs";

const slides = [
  {
    imgSrc: cover1,
    title: "Rekindle your love for your skin with Re-commence",
    desc: "Welcome to Aurora, the ultimate destination for rejuvenating skincare products. Our online store offers a range of specially curated skincare essentials that help you rediscover your natural radiance. With Aurora, you can confidently embrace the journey of re-commencing your skincare routine and start loving your skin again.",
  },
  {
    imgSrc: cover2,
    title: "Discover our new line of natural skincare products",
    desc: "Introducing our latest line of skincare products, made with all-natural ingredients and no harsh chemicals. From cleansers to moisturizers, our products are designed to nourish your skin and enhance your natural beauty. Try them today and see the difference for yourself!",
  },
  {
    imgSrc: cover3,
    title: "Discover our new line of natural skincare products",
    desc: "Introducing our latest line of skincare products, made with all-natural ingredients and no harsh chemicals. From cleansers to moisturizers, our products are designed to nourish your skin and enhance your natural beauty. Try them today and see the difference for yourself!",
  },
  {
    imgSrc: cover4,
    title: "Discover our new line of natural skincare products",
    desc: "Introducing our latest line of skincare products, made with all-natural ingredients and no harsh chemicals. From cleansers to moisturizers, our products are designed to nourish your skin and enhance your natural beauty. Try them today and see the difference for yourself!",
  },
  {
    imgSrc: cover5,
    title: "Discover our new line of natural skincare products",
    desc: "Introducing our latest line of skincare products, made with all-natural ingredients and no harsh chemicals. From cleansers to moisturizers, our products are designed to nourish your skin and enhance your natural beauty. Try them today and see the difference for yourself!",
  },
  {
    imgSrc: cover6,
    title: "Discover our new line of natural skincare products",
    desc: "Introducing our latest line of skincare products, made with all-natural ingredients and no harsh chemicals. From cleansers to moisturizers, our products are designed to nourish your skin and enhance your natural beauty. Try them today and see the difference for yourself!",
  },
];

const reasons = [
  {
    icon: <RiSeedlingFill />,
    color: "green",
    size: "40px",
    title: "Sustainable",
    description: "Reducing waste in environment through Re-commence",
  },
  {
    icon: <CiBadgeDollar />,
    color: "red",
    size: "45px",
    title: "Affordable",
    description: "Competitive pricing through lower fees and discounts",
  },
  {
    icon: <BsGlobe />,
    color: "blue",
    size: "40px",
    title: "Accessible",
    description:
      "Skincare accessible to people in different parts of the world",
  },
];

const About = () => {
  const [index, setIndex] = useState(0);
  const wrapperStyle = {
    transform: `translateX(${index * -100}vw)`,
  };

  const autoplayDuration = 5000;
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index + 1) % slides.length);
    }, autoplayDuration);
    return () => clearInterval(interval);
  }, [index]);

  return (
    <div className="about-body">
      <div className="slider-body">
        <div className="wrapper" style={wrapperStyle} index={index}>
          {slides.map(({ imgSrc, title, desc }) => (
            <div className="slide">
              <div className="img-container">
                <img src={imgSrc} aria-hidden="true" />
              </div>
              <div className="title-container">
                <h2 className="title">{title}</h2>
                <p className="desc">{desc}</p>
                {/* <button className="btn-discover">DISCOVER</button> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="aurora-header">
        Unleash your skin's natural radiance with Aurora Premium skincare
        solutions that illuminate your beauty from within
      </div>
      <div className="reasons-why">
        <div className="reason-boxes">
          {reasons.map((reason, index) => (
            <div className="reason" key={index}>
              <IconContext.Provider
                value={{
                  color: reason.color,
                  size: reason.size,
                  verticalAlign: "middle",
                }}
              >
                {reason.icon}
              </IconContext.Provider>
              <h1>{reason.title}</h1>
              <p>{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="info-image">
        <img src={products} alt="" />
      </div>
      <div className="how-title">Who Are We?</div>
      <div class="intro-container">
        <img src={store} alt="your-image" class="image" />
        <div class="content">
          <p>
            At [Store Name], we believe that healthy, glowing skin is the key to
            confidence and beauty.
            <br /> Our mission is to provide you with high-quality skincare
            products that nourish and protect your skin, helping you to look and
            feel your best every day. We understand that choosing the right
            skincare products can be overwhelming, which is why we are committed
            to providing you with expert advice and guidance. <br /> At [Store
            Name], we are passionate about natural, eco-friendly, and
            cruelty-free skincare. That's why we carefully curate our selection
            of products to ensure that they meet our high standards of quality
            and sustainability.
          </p>
        </div>
      </div>

      <div className="most-popular">
        <div className="star-icon">
          <img src={order} alt="" />
        </div>
      </div>
      <div className="category-boxes">
        <div className="row">
          <div className="category">
            <img src={cream} alt="" />
            <h1>Face Care</h1>
          </div>
          <div className="category">
            <img src={makeup} alt="" />
            <h1>Make Up</h1>
          </div>

          <div className="category">
            <img src={lotion} alt="" />
            <h1>Body Care</h1>
          </div>
          <div className="category">
            <img src={sun} alt="" />
            <h1>Sun Care</h1>
          </div>
        </div>
        <div className="row">
          <div className="category">
            <img src={perfume} alt="" />
            <h1>Perfume</h1>
          </div>

          <div className="category">
            <img src={shampoo} alt="" />
            <h1>Hair Care</h1>
          </div>
          <div className="category">
            <img src={sun} alt="" />
            <h1>Sun Care</h1>
          </div>
        </div>
      </div>
      <div className="guide">
        <div className="sell-image">
          <img src={sell} alt="" />
        </div>
      </div>

      <div class="how-to">
        <div class="how-image">
          <img src={skin} alt="Your Image" />
        </div>
        <div class="list-container">
          <h2>Here's a Guide to Create a Shop</h2>
          <ol>
            <li>Sign up</li>
            <p>
              Create an account with an e-commerce platform of your choice by
              providing basic information such as name, email, and password.
            </p>
            <li>Customize your shop</li>
            <p>
              Choose a name and theme for your shop, and upload a logo and cover
              photo. Set up payment and shipping options.
            </p>
            <li>Add Products</li>
            <p>
              Add product details such as name, description, price, and images.
              Choose categories and tags to help customers find your products.
            </p>
            <li>Start Selling</li>
            <p>
              Publish your shop and share it on social media. Respond to
              customer inquiries, fulfill orders, and track sales data to
              improve your shop.
            </p>
          </ol>
        </div>
      </div>
    </div>
  );
};
export default About;
