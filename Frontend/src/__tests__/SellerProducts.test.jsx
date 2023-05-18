import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import SellerProducts from "../components/boards/sellerProducts";
import * as UserService from "../services/user.service";
import productService from "../services/product.service";
import axios from "axios";
import { act } from "react-dom/test-utils";
import UserContext from "../components/boards/UserContext";
import {
  ProductsContext,
  ProductsProvider,
} from "../components/boards/ProductContext";
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

const mockProducts = [
  {
    id: 1,
    title: "Test Product",
    category: "Test Category",
    price: 100,
    added: "2023-04-18",
  },
];

jest.mock("axios");

jest.mock("../services/product.service", () => ({
  getSellerProducts: jest.fn(),
}));

jest.mock("../services/user.service", () => ({
  sellerAccess: jest.fn(),
}));

describe("SellerProducts Component", () => {
  beforeEach(() => {
    const user = {
      id: "1",
      username: "test-user",
      email: "test@example.com",
      roles: ["ROLE_USER"],
    };

    localStorage.setItem("user", JSON.stringify(user));
    productService.getSellerProducts.mockResolvedValue({
      data: { products: mockProducts },
    });
  });

  test("1. Renders without crashing", async () => {
    UserService.sellerAccess.mockRejectedValue({
      response: { status: 403 },
    });
  
    await act(async () => {
      render(
        <UserContext.Provider value={defaultUserContext}>
          <BrowserRouter>
            <ProductsProvider>
              <SellerProducts />
            </ProductsProvider>
          </BrowserRouter>
        </UserContext.Provider>
      );
    });
  
    await waitFor(() =>
      expect(screen.getByText("No Access for Non-Seller Users!")).toBeInTheDocument()
    );
  });

  test("2. Renders products when user is a seller", async () => {
    // Mock the UserService.sellerAccess function to resolve successfully
    UserService.sellerAccess.mockResolvedValue({ data: "Access granted" });
  
    // Mock the productService.getSellerProducts function to return a product
    productService.getSellerProducts.mockResolvedValue({
      data: { products: mockProducts },

    });
  
    await act(async () => {
      render(
        <UserContext.Provider value={defaultUserContext}>
          <BrowserRouter>
            <ProductsProvider>
              <SellerProducts />
            </ProductsProvider>
          </BrowserRouter>
        </UserContext.Provider>
      );
    });
  
    await waitFor(() => {
      // Verify that the product name is present in the document
      expect(screen.getByText("Test Product")).toBeInTheDocument();
    });
  });

});
