import React, { useState, useEffect } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import UserService from "../../services/user.service";
import axios from "axios";
import { Card, ListGroup } from "react-bootstrap";

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
    <div className="mainContainer">
      <div className="container">
        <header className="jumbotron">
          <h3 aria-level="3">{content}</h3>
        </header>
        <div>
          {errorMessage && <p>{errorMessage}</p>}

          {orders.length > 0 ? (
            orders.map((order, index) => (
              <Card key={index} className="mb-3">
                <Card.Header>
                  Order #{index + 1} - {order.status} - {order.created}
                </Card.Header>
                <ListGroup variant="flush" role="list">
                  {order.items.map((item) => (
                    <ListGroup.Item role="listitem" key={item.id}>
                      {item.title} - ${item.price}
                    </ListGroup.Item>
                  ))}
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
