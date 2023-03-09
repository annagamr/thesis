import React, { useState, useEffect } from 'react';
import cover1 from "./cover1.jpg";
import cover2 from "./cover2.jpg";
import cover3 from "./cover3.jpg";
import cover4 from "./cover4.jpg";
import cover5 from "./cover5.jpg";
import cover6 from "./cover6.jpg";

import "./about.css";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

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

const About = () => {
  const [index, setIndex] = useState(0);
  const wrapperStyle = {
    transform: `translateX(${index * -100}vw)`,
  };

  // define autoplay duration in milliseconds
  const autoplayDuration = 4000;

  // set an interval to update the index every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index + 1) % slides.length);
    }, autoplayDuration);
    return () => clearInterval(interval);
  }, [index]);

  const handleClick = (direction) => {
    if (direction == "left") {
      setIndex(index > 0 ? index - 1 : 5);
    } else {
      setIndex(index < 5 ? index + 1 : 0);
    }
  };
  return (
    <div className="slider-body">
      <div className="slider-arrows">
        <MdKeyboardDoubleArrowLeft
          className="slider-arrow left-arrow"
          onClick={() => handleClick("left")}
        />
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
        <MdKeyboardDoubleArrowRight
          className="slider-arrow right-arrow"
          onClick={() => handleClick("right")}
        />
      </div>
    </div>
  );
};
export default About;
