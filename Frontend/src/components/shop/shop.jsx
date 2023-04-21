import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./shop.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [addedProducts, setAddedProducts] = useState({});

  const handleAddClick = (productId) => {
    setAddedProducts({
      ...addedProducts,
      [productId]: !addedProducts[productId],
    });
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
