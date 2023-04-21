import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [addedProducts, setAddedProducts] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("Shop");

  const handleAddClick = (productId) => {
    setAddedProducts({
      ...addedProducts,
      [productId]: !addedProducts[productId],
    });
  };

  const handleChange = (event) => {
    setSelectedCategory(event.target.value || "Shop");
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3002/api/products");
        setProducts(response.data.products);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="shop-page-container">
      <div className="category-select">
        <h2>{selectedCategory}</h2>
        <select name="category" onChange={handleChange}>
          <option value="">Shop</option>
          <option value="Skin Care">Skin Care</option>
          <option value="Body Care">Body Care</option>
          <option value="Sun Care">Sun Care</option>
          <option value="Hair Care">Hair Care</option>
          <option value="Make Up">Make Up</option>
          <option value="Perfume">Perfume</option>
        </select>
      </div>
      <div className="LayoutGrid grid-cols-12 has-column-gap gap-y-6 sm:gap-y-12">
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
