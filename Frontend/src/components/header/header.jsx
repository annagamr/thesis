import React, { useState, useEffect } from "react";
import { BsCart4 } from "react-icons/bs";
import { RxPerson } from "react-icons/rx";
import { MdQuestionAnswer } from "react-icons/md";
import { AiOutlineLogin, AiOutlineLogout, AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";
import { IconContext } from "react-icons";
import Badge from "@mui/material/Badge";
import "./header.css";
import cartService from "../../services/cart.service";

const Header = () => {
  const [showSellerBoard, setShowSellerBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [showUserBoard, setShowUserBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setCurrentUser(user);
      setShowUserBoard(user.roles.includes("ROLE_USER"));
      setShowSellerBoard(user.roles.includes("ROLE_SELLER"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));

      if (!showSellerBoard && !!showAdminBoard) {
        const fetchCartProducts = async () => {
          try {
            const response = await cartService.getCart(user.id);
            setTotalItems(response.numberOfItems);
          } catch (error) {
            console.log(error);
          }
        };
        fetchCartProducts();
      }
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
    <header className="top_header">
      <ul className="header_items_left">
        <li>
          <Link to="/">ABOUT</Link>
        </li>
        <li>
          {!showSellerBoard && !showAdminBoard && <Link to="/shop">SHOP</Link>}
        </li>
        <li>
          <Link to="/blog">BLOG</Link>
        </li>
      </ul>
      <div className="logo_aurora">Aurora.</div>
      <ul className="header_items_right">
        {currentUser ? (
          <div></div>
        ) : (
          <li>
            <Link to="/register" className="icon">
              <IconContext.Provider
                value={{
                  color: "white",
                  size: "20px",
                  verticalAlign: "middle",
                }}
              >
                <RxPerson />
              </IconContext.Provider>
            </Link>
          </li>
        )}

        {showSellerBoard ? (
          <li>
            <Link to="/addProduct" className="icon">
              <IconContext.Provider
                value={{
                  color: "white",
                  size: "20px",
                  verticalAlign: "middle",
                }}
              >
                <AiOutlinePlus />
              </IconContext.Provider>
            </Link>
          </li>
        ) : !showAdminBoard ? (
          <li>
            <Link to="/cart" className="icon">
              <Badge badgeContent={totalItems} color="success">
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
        ) : null}
        <li>
          <Link to="/contact" className="icon">
            <IconContext.Provider
              value={{ color: "white", size: "20px", verticalAlign: "middle" }}
            >
              <MdQuestionAnswer />
            </IconContext.Provider>
          </Link>
        </li>

        {currentUser ? (
          <div>
            <li>
              <Link to="/profile">Prof</Link>
            </li>{" "}
            <li>
              <a href="/signin" onClick={logOut} className="icon">
                <IconContext.Provider
                  value={{
                    color: "white",
                    size: "20px",
                    verticalAlign: "middle",
                  }}
                >
                  <AiOutlineLogout />
                </IconContext.Provider>
              </a>
            </li>
          </div>
        ) : (
          <li>
            <Link to="/signin" className="icon">
              <IconContext.Provider
                value={{
                  color: "white",
                  size: "20px",
                  verticalAlign: "middle",
                }}
              >
                <AiOutlineLogin />
              </IconContext.Provider>
            </Link>
          </li>
        )}
      </ul>
    </header>
  );
};
export default Header;
