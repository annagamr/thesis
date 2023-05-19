import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import BoardAdmin from "../components/boards/adminBoard";
import UserService from "../services/user.service";
import { cleanup } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UserContext from "../components/boards/UserContext";

jest.mock("../services/user.service");

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

describe("BoardAdmin Component ", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    UserService.adminAccess.mockResolvedValue({ data: "admin" });

    // Mocking axios calls
    axios.get.mockResolvedValue({
      data: { count: 0, users: [], shops: [], products: [], allPosts: [] },
    });

    // Mocking a current user in localStorage
    const user = { id: "123", role: "admin" };
    localStorage.setItem("user", JSON.stringify(user));
  });

  afterEach(() => {
    cleanup();
  });

  test("1. Renders BoardAdmin component without crashing", async () => {
    await act(async () => {
      render(
        <UserContext.Provider value={defaultUserContext}>
          <BrowserRouter>
            <BoardAdmin />
          </BrowserRouter>
        </UserContext.Provider>
      );
    });
  });

  it("2. Renders the admin header on successful admin access", async () => {
    await act(async () => {
      render(
        <UserContext.Provider value={defaultUserContext}>
          <BrowserRouter>
            <BoardAdmin />
          </BrowserRouter>
        </UserContext.Provider>
      );
    });

    // Wait for the promise to resolve and the component state to update
    await waitFor(() => {
      expect(screen.getByText("USERS and SHOPS")).toBeInTheDocument();
    });
  });

  it("3. Renders products and blogs headers", async () => {
    render(
      <UserContext.Provider value={defaultUserContext}>
        <BrowserRouter>
          <BoardAdmin />
        </BrowserRouter>
      </UserContext.Provider>
    );

    // Wait for the promises to resolve and the component state to update
    await waitFor(() => {
      expect(screen.getByText("PRODUCTS")).toBeInTheDocument();
      expect(screen.getByText("BLOGS")).toBeInTheDocument();
    });
  });
});
