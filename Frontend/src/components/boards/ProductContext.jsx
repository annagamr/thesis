import React, { createContext, useState, useEffect } from 'react';
import productService from "../../services/product.service";

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    productService
      .getSellerProducts(user.id)
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};