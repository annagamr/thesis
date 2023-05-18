import React, { createContext, useState, useEffect, useContext } from "react";
import productService from "../../services/product.service";
import UserService from "../../services/user.service";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";

export const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);

  const { logOut } = useContext(UserContext);
  const navigate = useNavigate();

  //Accessing page with different roles
  useEffect(() => {
    // console.log("here");
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      const userId = currentUser.id;
      // console.log(userId);
      UserService.sellerAccess(userId)
        .then((response) => {
          // console.log(response);
          setUserRole("seller");
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              logOut();
              navigate("/signin");
              window.location.reload();
            } else if (err.response.status === 403) {
              setUserRole("non-seller");
              // console.log("Not a seller");
            }
          }
        });
    }
    setUserRole("non-seller");
    // eslint-disable-next-line
  }, []);


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(user) {
      productService
      .getSellerProducts(user.id)
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((error) => {
        console.error(error.message);
      });
    }
    
  }, []);

  return (
    <ProductsContext.Provider value={{ products, setProducts, userRole }}>
      {children}
    </ProductsContext.Provider>
  );
};
