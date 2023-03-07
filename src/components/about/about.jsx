import React from "react";
import Cover from "./2.jpg";
import "./about.css";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

const About = () => {
  return (
    <div className="slider-body">
      <div className="slider-arrows">
        <MdKeyboardDoubleArrowLeft className="left-arrow" />
        <div className="wrapper">
          <div className="slide">
            <div className="imgcontainer">
              <img src={Cover} alt="" />
            </div>
            <div className="titlecontainer">
              <div className="title">
                Rekindle your love for your skin with Re-commence
              </div>
              <div className="desc">
                Welcome to Aurora, the ultimate destination for rejuvenating
                skincare products. Our online store offers a range of specially
                curated skincare essentials that help you rediscover your
                natural radiance. With Aurora, you can confidently embrace the
                journey of re-commencing your skincare routine and start loving
                your skin again.
              </div>
              <button className="btn-discover">DISCOVER</button>
            </div>
          </div>
          <div className="slide">
            <div className="imgcontainer">
              <img src={Cover} alt="" />
            </div>
            <div className="titlecontainer">
              <div className="title">
                Rekindle your love for your skin with Re-commence
              </div>
              <div className="desc">
                Welcome to Aurora, the ultimate destination for rejuvenating
                skincare products. Our online store offers a range of specially
                curated skincare essentials that help you rediscover your
                natural radiance. With Aurora, you can confidently embrace the
                journey of re-commencing your skincare routine and start loving
                your skin again.
              </div>
              <button className="btn-discover">DISCOVER</button>
            </div>
          </div>
        </div>
        <MdKeyboardDoubleArrowRight className="right-arrow" />
      </div>
    </div>
  );
};
export default About;
