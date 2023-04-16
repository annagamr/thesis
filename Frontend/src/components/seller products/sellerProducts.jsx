import React, { useState, useEffect } from "react";
import productService from "../../services/product.service";
import "./sellerProducts.css";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const response = await productService.getSellerProducts(user.id);
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);



  return (
    <div className="products-page">
      <h2 className="seller-h2">My Products:</h2>
      <div className="my-products">
        {products.map((product) => (

          <div className="myCard" key={product.id}>
            <div className="card-image">
            <img src={"http://localhost:3002/" + product.image} alt="" />
            </div>
            <p className="card-title">{product.title}</p>
            <p className="card-uploaded">{product.added}</p>

            <p className="card-price">Price: {product.price} HUF</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerProducts;