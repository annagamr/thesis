import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MyOrders from "../components/boards/myOrders";
import axios from "axios";
import UserContext from "../components/boards/UserContext";
import { BrowserRouter } from "react-router-dom";

const defaultUserContext = {
  showSellerBoard: false,
  setShowSellerBoard: jest.fn(),
  showAdminBoard: false,
  setShowAdminBoard: jest.fn(),
  showUserBoard: false,
  setShowUserBoard: jest.fn(),
  currentUser: null,
  setCurrentUser: jest.fn(),
  logOut: jest.fn(),
};

jest.mock("axios");

describe("MyOrders", () => {
  const fakeOrders = [
    {
      id: "order1",
      status: "Pending",
      created: "2023-05-01",
      items: [
        { id: "item1", title: "Item 1", price: 10 },
        { id: "item2", title: "Item 2", price: 20 },
      ],
    },
    {
      id: "order2",
      status: "Completed",
      created: "2023-05-02",
      items: [
        { id: "item3", title: "Item 3", price: 30 },
        { id: "item4", title: "Item 4", price: 40 },
      ],
    },
  ];

  beforeEach(() => {
    const currentUser = { id: "user1" };
    localStorage.setItem("user", JSON.stringify(currentUser));
    axios.get.mockResolvedValue({ data: { orders: fakeOrders } });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.removeItem("user");
  });

  test("renders jumbotron with content", async () => {
    render(
      <UserContext.Provider value={defaultUserContext}>
        <BrowserRouter>
          <MyOrders />
        </BrowserRouter>
      </UserContext.Provider>
    );
    const jumbotron = await screen.findByRole("heading", { level: 3 });
    expect(jumbotron).toBeInTheDocument();
  });

  test("fetches orders using axios.get", async () => {
    render(
      <UserContext.Provider value={defaultUserContext}>
        <BrowserRouter>
          <MyOrders />
        </BrowserRouter>
      </UserContext.Provider>
    );
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
  });

  test("renders order status and created date", async () => {
    render(
      <UserContext.Provider value={defaultUserContext}>
        <BrowserRouter>
          <MyOrders />
        </BrowserRouter>
      </UserContext.Provider>
    );

    const listItems = await screen.findAllByRole("listitem");

    fakeOrders.forEach((order, index) => {
      expect(listItems[index]).toHaveTextContent(order.status);
      expect(listItems[index]).toHaveTextContent(order.created);
    });
  });

  test("renders correct number of list group items for each order", async () => {
    render(
      <UserContext.Provider value={defaultUserContext}>
        <BrowserRouter>
          <MyOrders />
        </BrowserRouter>
      </UserContext.Provider>
    );

    // Wait for the list groups to appear on the screen
    const listGroups = await screen.findAllByRole("list");

    // Now run the assertions inside the waitFor function
    await waitFor(() => {
      listGroups.forEach((listGroup, index) => {
        const items = listGroup.querySelectorAll('[role="listitem"]');
        expect(items.length).toBe(1); // Expect each order to have one list item
      });
    });
  });

  test("renders order status and created date", async () => {
    render(
      <UserContext.Provider value={defaultUserContext}>
        <BrowserRouter>
          <MyOrders />
        </BrowserRouter>
      </UserContext.Provider>
    );

    const listItems = await screen.findAllByRole("listitem");

    fakeOrders.forEach((order, index) => {
      expect(listItems[index]).toHaveTextContent(order.status);
      expect(listItems[index]).toHaveTextContent(order.created);
    });
  });

  test('renders "No orders found" when there are no orders', async () => {
    axios.get.mockResolvedValue({ data: { orders: [] } });
    render(
      <UserContext.Provider value={defaultUserContext}>
        <BrowserRouter>
          <MyOrders />
        </BrowserRouter>
      </UserContext.Provider>
    );
    const noOrdersMessage = await screen.findByText(/No orders found/i);
    expect(noOrdersMessage).toBeInTheDocument();
  });

});
