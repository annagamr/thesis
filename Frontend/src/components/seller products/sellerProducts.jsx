import React, { useState, useEffect } from "react";
import UserService from "../../services/user.service";
import productService from "../../services/product.service";
import axios from "axios";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [author, setAuthor] = useState(undefined);

  useEffect(() => {
    const fetchProducts = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
    console.log(user.id)
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
    <div>
    <div>My Products:</div>
     <div>
          {products.map((product) => (
            <div key={product.id}>
              <h2>{product.title}</h2>
              <p>{product.description}</p>
              <p>{product.tags}</p>
              <p>{product.added}</p>
              <p>{product.price}</p>
              <p>{product.author}</p>
            </div>
          ))}
        </div> 
        </div>

  );
};

export default SellerProducts;
