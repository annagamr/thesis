import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Shop = () => {
  const [products, setProducts] = useState([]);

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
      {products.map((product) => (
        <Link key={product.id} to={`/product/${product.id}`}>
          <div className="myCard" key={product.id}>
            <div className="card-image">
              <img src={"http://localhost:3002/" + product.image} alt="" />
            </div>
            <p className="card-title">{product.title}</p>
            <p className="card-price">Price: {product.price} HUF</p>
          </div>
        </Link>
      ))}
    </div>
  );
};
export default Shop;
