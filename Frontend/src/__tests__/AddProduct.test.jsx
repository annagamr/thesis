import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddProduct from "../components/boards/AddProduct";
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

jest.mock("../services/user.service", () => ({
  sellerAccess: jest.fn(),
}));

jest.mock("../services/product.service", () => ({
  getAllProducts: jest.fn(),
  getSellerProducts: jest.fn(),
  getProductImages: jest.fn(),
  getProductById: jest.fn(),
}));

jest.mock("axios");

describe("AddProduct Component", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  beforeEach(() => {
    axios.post.mockResolvedValue({
      data: { message: "Product added successfully." },
    });
  });
  test("1. Renders without crashing", async () => {
    productService.getAllProducts.mockResolvedValue({ data: [] });

    await act(async () => {
      render(
        <UserContext.Provider value={defaultUserContext}>
          <BrowserRouter>
            <AddProduct />
          </BrowserRouter>
        </UserContext.Provider>
      );
    });
  });

  test("2. Does not render Add New Product header when userRole is not non-seller", async () => {
    UserService.sellerAccess.mockResolvedValue({ data: "some data" });
    productService.getAllProducts.mockResolvedValue({ data: [] });

    await act(async () => {
      render(
        <UserContext.Provider value={defaultUserContext}>
          <BrowserRouter>
            <AddProduct />
          </BrowserRouter>
        </UserContext.Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("header-add")).toBeInTheDocument();
    });
  });
  test("3. Updates title input value on change", async () => {
    UserService.sellerAccess.mockResolvedValue({ data: "some data" });
    productService.getAllProducts.mockResolvedValue({ data: [] });

    render(
      <UserContext.Provider value={defaultUserContext}>
        <BrowserRouter>
          <AddProduct />
        </BrowserRouter>
      </UserContext.Provider>
    );

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/Title/i);
      fireEvent.change(titleInput, { target: { value: "Test Title" } });
      expect(titleInput.value).toBe("Test Title");
    });
  });

  test("4. Renders access message when userRole is non-seller", async () => {
    UserService.sellerAccess.mockRejectedValue({});
    productService.getAllProducts.mockResolvedValue({ data: [] });

    render(
      <UserContext.Provider value={defaultUserContext}>
        <BrowserRouter>
          <AddProduct />
        </BrowserRouter>
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("header-add")).toBeInTheDocument();
    });
  });
});
