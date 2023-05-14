import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SellerProducts from "../components/boards/sellerProducts";
import * as UserService from "../services/user.service";
import productService from "../services/product.service";
import axios from "axios";
import { act } from "react-dom/test-utils";
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

jest.mock("../services/product.service", () => ({
  getSellerProducts: jest.fn(),
}));

jest.mock("../services/user.service", () => ({
    sellerAccess: jest.fn(),
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

  test("1. Renders without crashing", async () => {
    // Mock the sellerAccess call to return a successful response
    UserService.sellerAccess = jest
      .fn()
      .mockResolvedValue({ data: "No Access for Non-Seller Users!" });

    productService.getSellerProducts.mockResolvedValue({
      data: [],
    });

    await act(async () => {
      render(
        <UserContext.Provider value={defaultUserContext}>
          <BrowserRouter>
            <SellerProducts />
          </BrowserRouter>
        </UserContext.Provider>
      );
    });
    await waitFor(() => {});
  });

  test("2. Renders No products to display message when there are no products", async () => {
    // Mock the sellerAccess call to return a successful response
    UserService.sellerAccess = jest
      .fn()
      .mockResolvedValue({ data: "Access granted" });

    productService.getSellerProducts.mockResolvedValue({ data: [] });

    render(
      <UserContext.Provider value={defaultUserContext}>
        <BrowserRouter>
          <SellerProducts />
        </BrowserRouter>
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText("No products to display!")).toBeInTheDocument();
    });
  });
});
