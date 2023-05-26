import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
    desc: "Welcome to Aurora, the ultimate destination for rejuvenating skincare products. Our online store offers a range of specially curated skincare essentials that help you rediscover your natural radiance. With Aurora, you can confidently embrace the journey of re-commencing your skincare routine and start loving your skin again. Experience our extensive collection of inspected, sanitized, and gently used products, all while promoting eco-consciousness and sustainability in the beauty industry.",
  },
  {
    imgSrc: images.cover2,
    title: "Sustainable Skincare Resale",
    desc: "Embark on a journey towards sustainable beauty with Aurora. Our online marketplace specializes in offering carefully inspected, sanitized, and gently used skincare products from top brands. We are committed to reducing waste and promoting eco-consciousness in the beauty industry. By choosing Aurora, you not only save on premium skincare essentials but also contribute to a greener planet. Explore our extensive collection and become a part of the movement to make beauty routines more environmentally responsible, without sacrificing quality or performance. Discover a new approach to beauty that benefits both you and the environment.",
  },
  {
    imgSrc: images.cover3,
    title: "Second Chance for Skin: Affordable, Responsible Skincare",
    desc: "Here, at Aurora, we offer an affordable, environmentally responsible way to enjoy your favorite skincare brands. Browse our selection of pre-owned, safely sanitized products, and join the green beauty revolution. Our user-friendly platform allows for seamless browsing and purchasing, while our transparent practices ensure that you know exactly what you're getting. Experience the benefits of luxury skincare products at a fraction of the cost, all while making a positive impact on the environment.",
  },
  {
    imgSrc: images.cover4,
    title: "Reuse, Replenish, Rejuvenate",
    desc: "Shop with us and enjoy high-quality, sanitized items while supporting sustainable beauty practices and reducing waste. Explore our delivery and pick-up options, designed to suit your preferences and lifestyle. Experience the convenience of online shopping, along with the satisfaction of knowing that you're making a difference by choosing Aurora. Our commitment to sustainable practices extends beyond our products, as we continuously strive to improve our operations and minimize our ecological footprint.",
  },
  {
    imgSrc: images.cover5,
    title: "Conscious Skincare Solutions",
    desc: "Aurora is dedicated to providing a curated selection of pre-owned, safely sanitized skincare essentials. Join our mission to make beauty routines more sustainable and cost-effective without compromising on quality. With our extensive range of skincare products, you're sure to find the perfect solution for your unique skin type and concerns. Discover the power of conscious beauty and experience the difference it makes, not only for your skin but also for the environment. Let Aurora be your guide to a more sustainable skincare journey.",
  },
  {
    imgSrc: images.cover6,
    title: "A Greener Path to Radiant Skin",
    desc: "Introducing our latest line of skincare products, made with all-natural ingredients and no harsh chemicals. From cleansers to moisturizers, our products are designed to nourish your skin and enhance your natural beauty. Try them today and see the difference for yourself! At Aurora, we believe that beauty and sustainability can coexist, and we're committed to providing you with skincare solutions that not only deliver results but also promote eco-friendly practices. Embrace a greener path to radiant skin and discover the true potential of sustainable beauty.",
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
        <div
          className="wrapper"
          style={wrapperStyle}
          index={index}
          data-testid="slide-container"
          autoplay-duration="5000"
        >
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
        <div className="row1">
          <div className="col-sm-4">
            <div className="card text-center">
              <div className="title">
                <IconContext.Provider
                  value={{
                    color: "white",
                    verticalAlign: "middle",
                    size: "50px",
                  }}
                >
                  <RiSeedlingFill />
                </IconContext.Provider>
                <h2>Sustainable</h2>
              </div>

              <div className="option">
                <ul>
                  <li></li>

                  <li>Reducing Waste</li>
                  <li>in Environment</li>
                  <li>Through</li>
                  <li>Re-commence</li>
                  <li></li>

                  <li>Sustainable Practice!</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card text-center">
              <div className="title">
                <IconContext.Provider
                  value={{
                    color: "white",
                    verticalAlign: "middle",
                    size: "55px",
                  }}
                >
                  <CiBadgeDollar />
                </IconContext.Provider>
                <h2>Affordable</h2>
              </div>

              <div className="option">
                <ul>
                  <li></li>
                  <li>Lower Overhead Costs</li>
                  <li>Online Discounts</li>
                  <li>Automated Processes</li>
                  <li></li>
                  <li>Efficient Logistics!</li>
                </ul>
              </div>
              <Link to="/shop">Shop Now!</Link>
            </div>
          </div>
          <div className="col-sm-4">
            <div className="card text-center">
              <div className="title">
                <IconContext.Provider
                  value={{
                    color: "white",
                    verticalAlign: "middle",
                    size: "45px",
                  }}
                >
                  <BsGlobe />
                </IconContext.Provider>
                <h2>Accessible</h2>
              </div>

              <div className="option">
                <ul>
                  <li></li>
                  <li>Smart Filtering</li>
                  <li>Recommendations</li>
                  <li>Adaptive</li>
                  <li>Online Support</li>
                  <li></li>
                  <li>Efficient Shipping!</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="how-title">Why Aurora?</div>
      <div className="intro-container">
        <img
          src={images.store}
          alt="Store Description"
          className="image"
          data-testid="store-image"
        />
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
