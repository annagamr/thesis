import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AddProduct from "../components/boards/AddProduct";
import * as UserService from "../services/user.service";
import productService from "../services/product.service";
import axios from "axios";
import { act } from "react-dom/test-utils";
import UserContext from "../components/boards/UserContext";
import { AddProductContext } from "../components/boards/AddProductContext";
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

const defaultAddProductContext = {
  handleProduct: jest.fn(),
  resetForm: jest.fn(),
  updateContact: jest.fn(),
  updateZip: jest.fn(),
  updateStreet: jest.fn(),
  updatePrice: jest.fn(),
  updateCategory: jest.fn(),
  updateDescription: jest.fn(),
  updateImage: jest.fn(),
  updateTitle: jest.fn(),
  successful: false,
  message: "",
  price: "",
  prodImageFile: "",
  contactNumber: "",
  zipCode: "",
  street: "",
  category: "",
  description: "",
  title: "",
  error: {},
  userRole: "seller",
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
          <AddProductContext.Provider value={defaultAddProductContext}>
            <BrowserRouter>
              <AddProduct />
            </BrowserRouter>
          </AddProductContext.Provider>
        </UserContext.Provider>
      );
    });

    expect(screen.getByTestId("header-add")).toBeInTheDocument();
  });

  test("2. Does not render Add New Product header when userRole is not 'seller'", async () => {
    UserService.sellerAccess.mockResolvedValue({ data: "some data" });
    productService.getAllProducts.mockResolvedValue({ data: [] });

    const nonSellerContext = {
      ...defaultUserContext,
      userRole: "non-seller",
    };

    await act(async () => {
      render(
        <UserContext.Provider value={nonSellerContext}>
          <BrowserRouter>
            <AddProductContext.Provider value={nonSellerContext}>
              <AddProduct />
            </AddProductContext.Provider>
          </BrowserRouter>
        </UserContext.Provider>
      );
    });

    expect(screen.queryByTestId("header-add")).not.toBeInTheDocument();
  });

  test("3. Renders access message when userRole is non-seller", async () => {
    UserService.sellerAccess.mockRejectedValue({});
    productService.getAllProducts.mockResolvedValue({ data: [] });
    const nonSellerContext = {
      ...defaultUserContext,
      userRole: "non-seller",
    };
    render(
      <UserContext.Provider value={defaultUserContext}>
        <BrowserRouter>
        <AddProductContext.Provider value={nonSellerContext}>
            <AddProduct />
          </AddProductContext.Provider>
        </BrowserRouter>
      </UserContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("header-access")).toBeInTheDocument();
    });
  });
});
