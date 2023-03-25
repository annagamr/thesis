import React from "react";
import "./header.css";
import { BsCart4 } from "react-icons/bs";
import { RxPerson } from "react-icons/rx";
import { MdQuestionAnswer,MdLogin } from "react-icons/md";
import {AiOutlineLogin} from "react-icons/ai";
import { IconContext } from "react-icons";
import Badge from "@mui/material/Badge";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="top_header">
      <ul className="header_items_left">
        <li>
          <Link to="/">ABOUT</Link>
        </li>
        <li>
          <Link to="/shop">SHOP</Link>
        </li>
        <li>
          <Link to="/blog">BLOG</Link>
        </li>
      </ul>
      <div className="logo_aurora">Aurora.</div>
      <ul className="header_items_right">
        <li>
          <Link to="/register" className="icon">
            <IconContext.Provider
              value={{ color: "white", size: "20px", verticalAlign: "middle" }}
            >
              <RxPerson />
            </IconContext.Provider>
          </Link>
        </li>
        <li>
          <Link to="/cart" className="icon">
            <Badge badgeContent={1} color="success">
              <IconContext.Provider
                value={{
                  color: "white",
                  size: "20px",
                  verticalAlign: "middle",
                }}
              >
                <BsCart4 />
              </IconContext.Provider>
            </Badge>
          </Link>
        </li>
        <li>
          <Link to="/contact" className="icon">
            <IconContext.Provider
              value={{ color: "white", size: "20px", verticalAlign: "middle" }}
            >
              <MdQuestionAnswer />
            </IconContext.Provider>
          </Link>
        </li>
        <li>
          <Link to="/signin" className="icon">
            <IconContext.Provider
              value={{ color: "white", size: "20px", verticalAlign: "middle" }}
            >
              <AiOutlineLogin />
            </IconContext.Provider>
          </Link>
        </li>
      </ul>
    </header>
  );
};
export default Header;
