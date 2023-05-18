import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import axios from "axios";
import Shop from "../components/shop/shop";
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";
import { CartContext } from "../components/cart/CartContext";
import UserContext from "../components/boards/UserContext";

jest.mock("axios");

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

describe("Shop component", () => {
  beforeEach(async () => {
    axios.get.mockResolvedValue({
      data: {
        products: [
          {
            id: 1,
            title: "Product 1",
            description: "This is product 1",
            price: 9.99,
            image: "https://example.com/product1.jpg",
          },
          {
            id: 2,
            title: "Product 2",
            description: "This is product 2",
            price: 19.99,
            image: "https://example.com/product2.jpg",
          },
          {
            id: 3,
            title: "Product 3",
            description: "This is product 3",
            price: 29.99,
            image: "https://example.com/product3.jpg",
          },
        ],
      },
    });

    await act(async () => {
      render(
        <UserContext.Provider value={defaultUserContext}>
          <CartContext.Provider
            value={{ totalItems: 0, setTotalItems: () => {} }}
          >
            <BrowserRouter>
              <Shop />
            </BrowserRouter>
          </CartContext.Provider>
        </UserContext.Provider>
      );
    });
  });

  test("1. Shop component renders without crashing", async () => {
    const profilePage = screen.getByTestId("shop-page");
    expect(profilePage).toBeInTheDocument();
  });

  test("2. Category dropdown is rendered and can be changed", async () => {
    const category = screen.getByTestId("category");

    await act(async () => {
      fireEvent.change(category, { target: { value: "skin care" } });
    });

    expect(screen.getByText("Skin Care")).toBeInTheDocument();
  });

  test("3. Product grid is rendered", () => {
    expect(screen.getByTestId("product-grid")).toBeInTheDocument();
  });

  test("4. Add to cart button changes to Added after clicking it", async () => {
    const addToCartButtons = screen.getAllByRole("button");

    fireEvent.click(addToCartButtons[0]);
    await waitFor(() => expect(screen.getByText(/Added/i)).toBeInTheDocument());
  });
});
