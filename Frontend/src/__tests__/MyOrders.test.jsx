import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import MyOrders from "../components/boards/myOrders";
import axios from "axios";

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
    render(<MyOrders />);
    const jumbotron = await screen.findByRole("heading", { level: 3 });
    expect(jumbotron).toBeInTheDocument();
  });

  test("fetches orders using axios.get", async () => {
    render(<MyOrders />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(2));
  });

  test("renders order status and created date", async () => {
    render(<MyOrders />);
    const orderHeaders = await screen.findAllByText(/Order #[0-9]+ - .* - .*/);
    orderHeaders.forEach((header, index) => {
      expect(header).toHaveTextContent(fakeOrders[index].status);
      expect(header).toHaveTextContent(fakeOrders[index].created);
    });
  });

  test("renders correct number of list group items for each order", async () => {
    render(<MyOrders />);

    // Wait for the list groups to appear on the screen
    const listGroups = await screen.findAllByRole("list");

    // Now run the assertions inside the waitFor function
    await waitFor(() => {
      listGroups.forEach((listGroup, index) => {
        const items = listGroup.querySelectorAll("div");
        expect(items.length).toBe(fakeOrders[index].items.length);
      });
    });
  });

  test("renders order item titles and prices", async () => {
    render(<MyOrders />);
    const listItems = await screen.findAllByRole("listitem");
    let itemIndex = 0;
    fakeOrders.forEach((order) => {
      order.items.forEach((item) => {
        expect(listItems[itemIndex]).toHaveTextContent(item.title);
        expect(listItems[itemIndex]).toHaveTextContent(`$${item.price}`);
        itemIndex++;
      });
    });
  });
  test('renders "No orders found" when there are no orders', async () => {
    axios.get.mockResolvedValue({ data: { orders: [] } });
    render(<MyOrders />);
    const noOrdersMessage = await screen.findByText(/No orders found/i);
    expect(noOrdersMessage).toBeInTheDocument();
  });

  test("renders error message when API call fails", async () => {
    axios.get.mockRejectedValue(new Error("Failed to fetch orders"));
    render(<MyOrders />);
    const errorMessage = await screen.findByText(/Failed to fetch orders/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
