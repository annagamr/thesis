import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./shop.css";
import { CartContext } from "../cart/CartContext";
import UserContext from "../boards/UserContext";
import { useNavigate } from "react-router-dom";
import cartService from "../../services/cart.service";

const Shop = (props) => {
  const [products, setProducts] = useState([]);
  const [addedProducts, setAddedProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const { totalItems, setTotalItems } = useContext(CartContext);
  const { logOut } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkLoggedIn = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setIsLoggedIn(!!user);
      setUser(user);
    };

    checkLoggedIn();
  }, []);

  const updateTotalItems = () => {
    if (isLoggedIn) {
      // If user is logged in, update totalItems based on the user's cart
      const fetchCartProducts = async () => {
        try {
          const response = await cartService.getCart(user.id);
          setTotalItems(response.numberOfItems);
        } catch (error) {
          console.log(error);
        }
      };
      fetchCartProducts();
    } else {
      // If user is not logged in, update totalItems based on the guestCart in localStorage
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setTotalItems(guestCart.length);
    }
  };

  const handleAddClick = async (productId) => {
    // If user is logged in
    const accessToken = JSON.parse(localStorage.getItem("user"))?.accessToken;
    if (accessToken) {
      try {
        const response = await axios.post(
          process.env.REACT_APP_BACKEND_ENDPOINT + `/api/cart/add/${productId}`,
          {},
          { headers: { "x-access-token": accessToken } }
        );
        console.log("Added product to cart:", response.data);
      } catch (error) {
        console.log("Error adding product to cart:", error);
        if (error.response) {
          if (error.response.status === 401) {
            if (error.response.data.message === "Token expired!") {
              alert("Token expired");
              logOut();
              navigate("/signin");
              window.location.reload();

            } else if (error.response.data.message === "Token is invalid") {
              alert("Token is invalid");
              logOut();
              navigate("/signin");
              window.location.reload();

            }
          }
        }
      }
    } else {
      // If user is not logged in, store the items in guestCart in localStorage
      let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      const index = guestCart.findIndex((item) => item.product === productId);
      if (index === -1) {
        guestCart.push({ product: productId });
      }
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
    }

    setAddedProducts({
      ...addedProducts,
      [productId]: !addedProducts[productId],
    });

    updateTotalItems();
  };
  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const fetchProducts = async (category) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_BACKEND_ENDPOINT +
          `/api/products${
            category ? `?category=${encodeURIComponent(category)}` : ""
          }`
      );
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="shop-page-container" data-testid="shop-page">
      <div className="category-select">
        <h2>{selectedCategory || "Shop"}</h2>
        <select name="category" onChange={handleChange} data-testid="category">
          <option value="">Shop</option>
          <option value="skin care">Skin Care</option>
          <option value="body care">Body Care</option>
          <option value="sun care">Sun Care</option>
          <option value="hair care">Hair Care</option>
          <option value="make up">Make Up</option>
          <option value="perfume">Perfume</option>
        </select>
      </div>
      <div
        className="ProductGrid grid-cols-12 has-column-gap gap-y-6 sm:gap-y-12"
        data-testid="product-grid"
      >
        {products.length > 0 ? (
          products.map((product) => (
            <Link
              style={{ textDecoration: "none", color: "black" }}
              key={product.id}
              to={`/product/${product.id}`}
            >
              <div className="LayoutCard" key={product.id}>
                <div className="product-image-button-container">
                  <div className="product-image">
                    <img
                      src={
                        process.env.REACT_APP_BACKEND_ENDPOINT +
                        "/" +
                        product.image
                      }
                      alt="Product"
                    />
                  </div>

                  <button
                    className="add-tocart"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddClick(product.id);
                    }}
                  >
                    {addedProducts[product.id] ? "Added" : "Add"}{" "}
                    <span className="add-tocart-symbol">
                      {addedProducts[product.id] ? "✓" : "+"}
                    </span>
                  </button>
                </div>
                <div className="details">
                  <p className="product-title">{product.title}</p>
                  <p className="product-price">{product.price} HUF</p>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <h2 id="no-blogs-shop">
            No Products to Display! <br />
            Check Back Soon!
          </h2>
        )}
      </div>
    </div>
  );
};

export default Shop;
