import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import axios from "../__mocks__/axios";
import Shop from "../components/shop/shop";
import { BrowserRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";

jest.mock("axios");

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
        <BrowserRouter>
          <Shop />
        </BrowserRouter>
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