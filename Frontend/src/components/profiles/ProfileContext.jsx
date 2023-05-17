import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import productService from "../../services/product.service";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";
export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [numberOfProducts, setnumberOfProducts] = useState(0);

  const { logOut } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user.accessToken;
      if (user) {
        try {
          const userId = user.id;
          if (user.roles[0] === "ROLE_USER") {
            const responseOrders = await axios.get(
              process.env.REACT_APP_BACKEND_ENDPOINT +
                `/api/order/get-orders/${userId}`,
              {
                headers: {
                  "x-access-token": token,
                },
              }
            );
            setNumberOfOrders(responseOrders.data.numberOfOrders);
          }

          const responseProducts = await productService.getSellerProducts(
            userId
          );
          setnumberOfProducts(responseProducts.data.numberOfProducts);
        } catch (error) {
          console.error("Error fetching user details:", error);
          if (error.response) {
            if (error.response.status === 401) {
              if (error.response.data.message === "Token expired!") {
                alert("Token expired");
                logOut();
                navigate("/signin");
                window.location.reload();
              } else if (error.response.data.message === "Token is invalid") {
                alert("Token is invalid");
                logOut();
                navigate("/signin");
                window.location.reload();
              }
            }
          }
        }
      }
    };

    fetchDetails();
  }, []);

  return (
    <ProfileContext.Provider
      value={{
        numberOfOrders,
        numberOfProducts,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};
