import React, { useState, useEffect, useContext } from "react";
import productService from "../../services/product.service";
import "./sellerProducts.css";
import UserService from "../../services/user.service";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";
import axios from "axios";

const SellerProducts = () => {
  const [access, setAccess] = useState("");
  const [userRole, setUserRole] = useState(null);

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const { logOut } = useContext(UserContext);
  const navigate = useNavigate();
  //Only for sellers
  useEffect(() => {
    const fetchSellerAccess = async () => {
      try {
        const response = await UserService.sellerAccess();
        setAccess(response.data);
      } catch (error) {
        const errorMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setAccess("No Access for Non-Seller Users!");

        // Check if the error status is 401
        if (error.response && error.response.status === 401) {
          // Log out the user and navigate to /signin
          logOut();
          navigate("/signin");
          window.location.reload();
        }

      }
      setUserRole("non-seller");
    };
    fetchSellerAccess();
  }, []);
  //x Only for sellers x\\

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

  const onDeleteProduct = async (productId) => {
    try {
      await axios.delete(process.env.REACT_APP_BACKEND_ENDPOINT+`/api/product-delete/${productId}`);
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      setError(`Error deleting product with ID: ${productId}`);
    }
  };

  return (
    <>
      {userRole === "non-seller" && (
        <div className="container">
          <header className="jumbotron" data-testid="header-add">
            <h3>{access}</h3>
          </header>
        </div>
      )}
      {userRole !== "non-seller" && (
        <div className="products-page">

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
                          onClick={() => onDeleteProduct(product.id)}
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
      )}
    </>
  );
};

export default SellerProducts;
