import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MapComponent from "./mapComponent";
import "./shop.css";

const ProductDetails = (props) => {
  const [product, setProduct] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_BACKEND_ENDPOINT+`/api/products/${id}`
        );
        // console.log(response.data.product);
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
        {product.image && (
          <img
            src={process.env.REACT_APP_BACKEND_ENDPOINT + "/" + product.image}
            alt={product.title}
          />
        )}
      </div>
      <div className="product-description">
        <h2 id="product-title">{product.title}</h2>
        <p id="product-desc"> {product.description}</p>
        <span>Product by: {product.author}</span>
        <div className="product-price">
          <span>{product.price} HUF</span>
        </div>
        <MapComponent
          data-testid="map-component"
          street={product.street}
          city={product.city}
          zipCode={product.zipCode}
          isDataAvailable={
            !!(product.street && product.city && product.zipCode)
          }
        />
      </div>
    </div>
  );
};

export default ProductDetails;
