import React, { useState, useEffect } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import UserService from "../../services/user.service";
import axios from "axios";
import { Card, ListGroup } from "react-bootstrap";

const MyOrders = () => {
  const [content, setContent] = useState("");
  const [orders, setOrders] = useState([]);

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
          console.error("Error fetching user orders:", error.message);
        }
      }
    };

    fetchUserOrders();
  }, [currentUser]);

  return (
    <div className="mainContainer">
      <div className="container">
        <header className="jumbotron">
          <h3>{content}</h3>
        </header>
        <div>
          {orders.map((order, index) => (
            <Card key={index} className="mb-3">
              <Card.Header>
                Order #{index + 1} - {order.status} - {order.created}
              </Card.Header>
              <ListGroup variant="flush">
                {order.items.map((item) => (
                  <ListGroup.Item key={item.id}>
                    {item.title} - ${item.price}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;