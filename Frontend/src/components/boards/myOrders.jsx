import React, { useState, useEffect, useContext } from "react";
import { BiLoader } from "react-icons/bi";
import UserService from "../../services/user.service";
import axios from "axios";
import "./sellerProducts.css";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [userRole, setUserRole] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const { logOut } = useContext(UserContext);
  const navigate = useNavigate();

  //Accessing page with different roles
  useEffect(() => {
    // console.log("here");
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (currentUser) {
      const userId = currentUser.id;
      // console.log(userId);
      UserService.userAccess(userId)
        .then((response) => {
          // console.log(response);
          setUserRole("customer");
        })
        .catch((err) => {
          if (err.response) {
            if (err.response.status === 401) {
              logOut();
              navigate("/signin");
              window.location.reload();
            } else if (err.response.status === 403) {
              setUserRole("non-customer");
              // console.log("Not a customer");
            }
          }
        });
    }
    setUserRole("non-customer");
  }, []);

  useEffect(() => {
    const fetchUserOrders = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        const token = user.accessToken;
        try {
          const userId = user.id;
          const response = await axios.get(
            process.env.REACT_APP_BACKEND_ENDPOINT +
              `/api/order/get-orders/${userId}`,
            {
              headers: {
                "x-access-token": token,
              },
            }
          );
          setOrders(response.data.orders);
        } catch (error) {
          console.error("Error fetching user orders: ", error);
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
          } else {
            setErrorMessage("There was an error fetching user orders");
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserOrders();
  }, []);

  return (
    <>
      {userRole === "non-customer" && (
        <header className="jumbotron">
          <h3 aria-level="3">No Access!</h3>
        </header>
      )}
      {userRole === "customer" && (
        <div className="products-page">
          <div className="my-products">
            {isLoading ? (
              <>
                <p>Loading...</p>
                <BiLoader />
              </>
            ) : errorMessage ? (
              <p>{errorMessage}</p>
            ) : orders.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td
                        style={{ color: "green", textTransform: "uppercase" }}
                      >
                        {order.status}
                      </td>
                      <td>{order.created}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <h2>No orders found!</h2>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default MyOrders;
