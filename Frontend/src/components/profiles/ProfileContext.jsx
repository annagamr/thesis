import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import productService from "../../services/product.service";

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [numberOfOrders, setNumberOfOrders] = useState(0);
  const [numberOfProducts, setnumberOfProducts] = useState(0);

  useEffect(() => {
    const fetchDetails = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        try {
          const userId = user.id;
          // console.log(user.roles[0])
          if (user.roles[0] === "ROLE_USER") {
            const responseOrders = await axios.get(
              `http://localhost:3002/api/order/get-orders/${userId}`
            );
            // console.log(responseOrders.data)
            setNumberOfOrders(responseOrders.data.numberOfOrders);
          }

          const responseProducts = await productService.getSellerProducts(
            userId
          );
          setnumberOfProducts(responseProducts.data.numberOfProducts);
        } catch (error) {
          console.error("Error fetching user details:", error.message);
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
