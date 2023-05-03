import React, { useState, useEffect } from "react";
import "./about.css";
import * as images from "../../assets/assets";

// icons
import { RiSeedlingFill } from "react-icons/ri";
import { IconContext } from "react-icons";
import { CiBadgeDollar } from "react-icons/ci";
import { BsGlobe } from "react-icons/bs";

export const slides = [
  {
    imgSrc: images.cover1,
    title: "Rekindle your love for your skin with Re-commence",
    desc: "Welcome to Aurora, the ultimate destination for rejuvenating skincare products. Our online store offers a range of specially curated skincare essentials that help you rediscover your natural radiance. With Aurora, you can confidently embrace the journey of re-commencing your skincare routine and start loving your skin again.",
  },
  {
    imgSrc: images.cover2,
    title: "Introducing New Approach",
    desc: "Introducing our latest line of skincare products, made with all-natural ingredients and no harsh chemicals. From cleansers to moisturizers, our products are designed to nourish your skin and enhance your natural beauty. Try them today and see the difference for yourself!",
  },
  {
    imgSrc: images.cover3,
    title: "Another title",
    desc: "Introducing our latest line of skincare products, made with all-natural ingredients and no harsh chemicals. From cleansers to moisturizers, our products are designed to nourish your skin and enhance your natural beauty. Try them today and see the difference for yourself!",
  },
  {
    imgSrc: images.cover4,
    title: "I don't even know at this point",
    desc: "Introducing our latest line of skincare products, made with all-natural ingredients and no harsh chemicals. From cleansers to moisturizers, our products are designed to nourish your skin and enhance your natural beauty. Try them today and see the difference for yourself!",
  },
  {
    imgSrc: images.cover5,
    title: "Hono hank",
    desc: "Introducing our latest line of skincare products, made with all-natural ingredients and no harsh chemicals. From cleansers to moisturizers, our products are designed to nourish your skin and enhance your natural beauty. Try them today and see the difference for yourself!",
  },
  {
    imgSrc: images.cover6,
    title: "Criss cross",
    desc: "Introducing our latest line of skincare products, made with all-natural ingredients and no harsh chemicals. From cleansers to moisturizers, our products are designed to nourish your skin and enhance your natural beauty. Try them today and see the difference for yourself!",
  },
];

export const reasons = [
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
        <div className="wrapper" style={wrapperStyle} index={index} data-testid="slide-container" autoplay-duration="5000">
          {slides.map(({ imgSrc, title, desc }, idx) => (
            <div className="slide" key={`${title}-${imgSrc}`}>
              <div className="img-container">
                <img
                  src={imgSrc}
                  aria-hidden="true"
                  alt="First Cover"
                  data-testid={`slide-img-${idx}`}
                />
              </div>
              <div className="title-container">
                <h2 className="title-carousel">{title}</h2>
                <p className="desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="aurora-header" data-testid="aurora-header">
        Unleash your skin's natural radiance <br />
        with Aurora Premium skincare
        <br />
        solutions that illuminate your beauty from within
      </div>
      <div className="reasons-why">
        <div className="reason-boxes">
          {reasons.map((reason, index) => (
            <div className="reason" key={index} data-testid="reason-item">
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
        <img src={images.products} alt="" />
      </div>
      <div className="how-title">Who Are We?</div>
      <div className="intro-container">
        <img src={images.store} alt="Store Description" className="image" data-testid="store-image"/>
        <div className="content">
          <p>
            At Aurora, we believe that healthy, glowing skin is the key to
            confidence and beauty.
            <br /> Our mission is to provide you with high-quality skincare
            products that nourish and protect your skin, helping you to look and
            feel your best every day. We understand that choosing the right
            skincare products can be overwhelming, which is why we are committed
            to providing you with expert advice and guidance. <br /> At Aurora,
            we are passionate about natural, eco-friendly, and cruelty-free
            skincare. That's why we carefully curate our selection of products
            to ensure that they meet our high standards of quality and
            sustainability.
          </p>
        </div>
      </div>

      <div className="most-popular">
        <div className="star-icon">
          <img src={images.order} alt="" />
        </div>
      </div>
      <div className="category-boxes">
        <div className="row">
          <div className="category" data-testid="category-item">
            <img src={images.cream} alt="" />
            <h1>Face Care</h1>
          </div>
          <div className="category" data-testid="category-item">
            <img src={images.makeup} alt="" />
            <h1>Make Up</h1>
          </div>

          <div className="category" data-testid="category-item">
            <img src={images.lotion} alt="" />
            <h1>Body Care</h1>
          </div>
          <div className="category" data-testid="category-item">
            <img src={images.sun} alt="" />
            <h1>Sun Care</h1>
          </div>
        </div>
        <div className="row">
          <div className="category" data-testid="category-item">
            <img src={images.perfume} alt="" />
            <h1>Perfume</h1>
          </div>

          <div className="category" data-testid="category-item">
            <img src={images.shampoo} alt="" />
            <h1>Hair Care</h1>
          </div>
          <div className="category" data-testid="category-item">
            <img src={images.sun} alt="" />
            <h1>Sun Care</h1>
          </div>
        </div>
      </div>
      <div className="guide">
        <div className="sell-image">
          <img src={images.sell} alt="" />
        </div>
      </div>

      <div className="how-to">
        <div className="how-image">
          <img src={images.skin} alt="How to Sign Up" />
        </div>
        <div className="list-container">
          <h2>Here's a Guide to Create a Shop</h2>
          <ol>
            <li>Sign up</li>
            <p>
              Create an account with an e-commerce platform of your choice by
              providing basic information such as name, email, and password.
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
