import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [addedProducts, setAddedProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleAddClick = (productId) => {
    setAddedProducts({
      ...addedProducts,
      [productId]: !addedProducts[productId],
    });
  };

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const fetchProducts = async (category) => {
    try {
      const response = await axios.get(
        `http://localhost:3002/api/products${
          category ? `?category=${encodeURIComponent(category)}` : ""
        }`
      );
      setProducts(response.data.products);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="shop-page-container">
      <div className="category-select">
        <h2>{selectedCategory || "Shop"}</h2>
        <select name="category" onChange={handleChange}>
          <option value="">Shop</option>
          <option value="skin care">Skin Care</option>
          <option value="body care">Body Care</option>
          <option value="sun care">Sun Care</option>
          <option value="hair care">Hair Care</option>
          <option value="make up">Make Up</option>
          <option value="perfume">Perfume</option>
        </select>
      </div>
      <div className="ProductGrid grid-cols-12 has-column-gap gap-y-6 sm:gap-y-12">
        {products.map((product) => (
          <Link
            style={{ textDecoration: "none", color: "black" }}
            key={product.id}
            to={`/product/${product.id}`}
          >
            <div className="LayoutCard" key={product.id}>
              <div className="product-image-button-container">
                <div className="product-image">
                  <img
                    src={"http://localhost:3002/" + product.image}
                    alt="Product Image"
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
        ))}
      </div>
    </div>
  );
};

export default Shop;
