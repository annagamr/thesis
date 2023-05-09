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
        setProducts(response.data.products);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="products-page">
      {error && <p className="error-message">{error}</p>}
      <div className="my-products">
        {products.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Added</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr data-testid="product-row" key={product.id}>
                  <td>{product.title}</td>
                  <td>{product.category}</td>
                  <td>{product.price} HUF</td>
                  <td>{product.added}</td>
                  <td>
                    <button
                      className="delete-product"
                      data-item-id={product.id}
                    >
                          &times;
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <h2 id="no-product">No products to display!</h2>
        )}
      </div>
    </div>
  );
};

export default SellerProducts;
