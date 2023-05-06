import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SellerProducts from "../components/boards/sellerProducts";
import * as UserService from "../services/user.service";
import productService from "../services/product.service";
import axios from "axios";
import { act } from "react-dom/test-utils";

jest.mock("axios");
jest.mock("../services/product.service", () => ({
  getSellerProducts: jest.fn(),
}));
const localStorageMock = (function () {
  let store = {};

  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("SellerProducts Component", () => {
  beforeEach(() => {
    const user = {
      id: "1",
      username: "test-user",
      email: "test@example.com",
      roles: ["ROLE_USER"],
    };

    localStorage.setItem("user", JSON.stringify(user));
  });

  test("renders without crashing", async () => {
    productService.getSellerProducts.mockResolvedValue({
      data: [],
    });

    await act(async () => {
      render(<SellerProducts />);
    });
    await waitFor(() => {});
  });

  test("renders My Products header", async () => {
    productService.getSellerProducts.mockResolvedValue({
      data: [],
    });

    await act(async () => {
      render(<SellerProducts />);
    });
    expect(screen.getByText("My Products:")).toBeInTheDocument();
  });

  test("renders No products to display message when there are no products", async () => {
    productService.getSellerProducts.mockResolvedValue({ data: [] });

    render(<SellerProducts />);

    await waitFor(() => {
      expect(screen.getByText("No products to display!")).toBeInTheDocument();
    });
  });

  test("fetches and renders products correctly", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Product 1",
        image: "image1.jpg",
        added: "2023-05-03",
        price: 1000,
      },
      {
        id: 2,
        title: "Product 2",
        image: "image2.jpg",
        added: "2023-05-03",
        price: 2000,
      },
    ];

    productService.getSellerProducts.mockResolvedValue({ data: mockProducts });

    render(<SellerProducts />);

    await waitFor(() => {
      mockProducts.forEach((product) => {
        expect(screen.getByText(product.title)).toBeInTheDocument();
        expect(
          screen.getByText(`Price: ${product.price} HUF`)
        ).toBeInTheDocument();
      });
    });
  });

  test("renders product images with correct src attribute", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Product 1",
        image: "image1.jpg",
        added: "2023-05-03",
        price: 1000,
      },
    ];

    productService.getSellerProducts.mockResolvedValue({ data: mockProducts });

    render(<SellerProducts />);

    await waitFor(() => {
      const imgElement = screen.getByRole("img");
      expect(imgElement).toHaveAttribute(
        "src",
        process.env.REACT_APP_BACKEND_ENDPOINT + "/image1.jpg"
      );
    });
  });

  test("renders the correct number of product cards", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Product 1",
        image: "image1.jpg",
        added: "2023-05-03",
        price: 1000,
      },
      {
        id: 2,
        title: "Product 2",
        image: "image2.jpg",
        added: "2023-05-03",
        price: 2000,
      },
    ];

    productService.getSellerProducts.mockResolvedValue({ data: mockProducts });

    render(<SellerProducts />);

    await waitFor(() => {
      const productCards = screen.getAllByTestId("product-card");
      expect(productCards.length).toBe(mockProducts.length);
    });
  });
  
  test("displays error message when fetching products fails", async () => {
    // Mock the error
    productService.getSellerProducts.mockImplementation(() => {
      throw new Error("An error occurred while fetching products");
    });

    await act(async () => {
      render(<SellerProducts />);
    });

    expect(
      screen.getByText("An error occurred while fetching products")
    ).toBeInTheDocument();
  });
});
