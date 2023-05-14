import React, { useState, useEffect, useContext } from "react";
import UserService from "../../services/user.service";
import axios from "axios";
import { Card, ListGroup } from "react-bootstrap";
import "./sellerProducts.css";
import { useNavigate } from "react-router-dom";
import UserContext from "./UserContext";

const MyOrders = () => {
  const [content, setContent] = useState("");
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const { logOut } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    UserService.userAccess().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        const errorMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setContent(errorMessage);

        // Check if the error status is 401
        if (error.response && error.response.status === 401) {
          // Log out the user and navigate to /signin
          logOut();
          navigate("/signin");
          window.location.reload()
        }
      }
    );
  }, [logOut, navigate]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (user) {
        try {
          const userId = user.id;
          const response = await axios.get(
            process.env.REACT_APP_BACKEND_ENDPOINT + `/api/order/get-orders/${userId}`
          );
          //   console.log(response.data);
          setOrders(response.data.orders);
        } catch (error) {
          // console.error("Error fetching user orders:", error.message);
          setErrorMessage("There was an error fetching user orders");
        }
      }
    };

    fetchUserOrders();
  }, [user]);

  return (
    <div className="mainContainerOrders">
      <div className="containerJ">
        <header className="jumbotron">
          <h3 aria-level="3">{content}</h3>
        </header>
        <div className="my-products">
          {errorMessage && <p>{errorMessage}</p>}

          {orders.length > 0 ? (
            orders.map((order, index) => (
              <Card key={index} className="mb-3">
                <Card.Header style={{ color: "white", background: "#393b81" }}>
                  Order #{index + 1}
                </Card.Header>
                <ListGroup variant="flush" role="list">
                  <ListGroup.Item
                    role="listitem"
                    key={order.id}
                    style={{ textTransform: "uppercase" }}
                  >
                    <span style={{ color: "green" }}>{order.status}</span>{" "}
                    <br /> <span>{order.created}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            ))
          ) : (
            <p>No orders found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
