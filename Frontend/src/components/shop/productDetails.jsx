import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./shop.css";

const ProductDetails = (props) => {
  const [product, setProduct] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3002/api/products/${id}`
        );
        console.log(response.data.product);
        setProduct(response.data.product);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <div className="product-details-container">
      <div className="product-image-details">
        <img
          src={"http://localhost:3002/" + product.image}
          alt={product.title}
        />
      </div>
      <div className="product-description">
        <h2>{product.title}</h2>
        <p>{product.description}</p>
        <span>Product by: {product.author}</span>
        <div className="product-price">
          <span>{product.price} HUF</span>
          <a href="#" className="cart-btn">
            Add to cart
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
