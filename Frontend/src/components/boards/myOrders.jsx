import React, { useState, useEffect } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import UserService from "../../services/user.service";
import axios from "axios";
import { Card, ListGroup } from "react-bootstrap";
import "./sellerProducts.css";

const MyOrders = () => {
  const [content, setContent] = useState("");
  const [orders, setOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    UserService.userAccess().then(
      (response) => {
        setContent(response.data);
      },
      (error) => {
        setContent(
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
            error.message ||
            error.toString()
        );
      }
    );
  }, []);

  useDeepCompareEffect(() => {
    const fetchUserOrders = async () => {
      if (currentUser) {
        try {
          const userId = currentUser.id;
          const response = await axios.get(
            `http://localhost:3002/api/order/get-orders/${userId}`
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
  }, [currentUser]);

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
                    <span style={{ color: "green"}}>{order.status}</span> <br />{" "}
                    <span>{order.created}</span>
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
