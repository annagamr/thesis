import React, { useState, useEffect, useContext } from "react";
import { BsCart4 } from "react-icons/bs";
import { RxPerson } from "react-icons/rx";
import { MdQuestionAnswer } from "react-icons/md";
import { AiOutlineLogin, AiOutlineLogout, AiOutlinePlus } from "react-icons/ai";
import { Link } from "react-router-dom";
import { IconContext } from "react-icons";
import Badge from "@mui/material/Badge";
import "./header.css";
import cartService from "../../services/cart.service";
import { CartContext } from "../cart/CartContext";
import UserContext from "../boards/UserContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { totalItems, setTotalItems } = useContext(CartContext);
  const {
    showSellerBoard,
    setShowSellerBoard,
    showAdminBoard,
    setShowAdminBoard,
    showUserBoard,
    setShowUserBoard,
    currentUser,
    setCurrentUser,
    logOut,
  } = useContext(UserContext);
  const navigate = useNavigate();


  useEffect(() => {
    if (currentUser && currentUser.roles.includes("ROLE_USER")) {
      const fetchCartProducts = async () => {
        try {
          const response = await cartService.getCart(currentUser.id);
          setTotalItems(response.numberOfItems);
        } catch (error) {
          // Check if the error status is 401
        if (error.response && error.response.status === 401) {
          // Log out the user and navigate to /signin
          logOut();
          navigate("/signin");
          window.location.reload()
        } else {
          console.log(error);
        }
        }
      };
      fetchCartProducts();
    }
  }, [currentUser, setTotalItems, totalItems]);

  return (
    <header className="top_header" data-testid="header">
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
            <Link to="/cart" className="icon" data-testid="cart-icon">
              <Badge
                data-testid="cart-badge"
                badgeContent={totalItems}
                color="success"
              >
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
              <Link to="/profile">My Profile</Link>
            </li>{" "}
            <li>
              <a
                href="/signin"
                onClick={logOut}
                className="icon"
                data-testid="logout-icon"
              >
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
