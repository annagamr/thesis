import React, { useState, useEffect } from "react";
import productService from "../../services/product.service";
import "./sellerProducts.css";

const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      try {
        const response = await productService.getSellerProducts(user.id);
        setProducts(response.data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="products-page">
      <h2 className="seller-h2">My Products:</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="my-products">
        {products.length > 0 ? (
          products.map((product) => (
            <div className="myCard" data-testid="product-card" key={product.id}>
              <div className="card-image">
                <img src={"http://localhost:3002/" + product.image} alt="" />
              </div>
              <p className="card-title">{product.title}</p>
              <p className="card-uploaded">{product.added}</p>

              <p className="card-price">Price: {product.price} HUF</p>
            </div>
          ))
        ) : (
          <h2 id="no-product">No products to display!</h2>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;