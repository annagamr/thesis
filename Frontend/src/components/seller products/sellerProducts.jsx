import React, { useState, useEffect } from "react";
import productService from "../../services/product.service";
import "./sellerProducts.css";
import image from "../../uploads/1681605663489.png"
const SellerProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const response = await productService.getSellerProducts(user.id);
        setProducts(response.data);
        console.log(response.data)
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h2 className="seller-h2">My Products:</h2>
      <div className="my-products">
        {products.map((product) => (

          <div className="myCard" key={product.id}>
         <p>{product.image.replace("Frontend/src/", "../")}</p>
            <div className="card-image">
              <img src={product.image.replace("Frontend/src/", "../../")} alt="" />
            </div>
            <p className="card-title">{product.title}</p>
            <p className="card-price">Price: {product.price} HUF</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerProducts;