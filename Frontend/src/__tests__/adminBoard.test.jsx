import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import axios from "axios";
import BoardAdmin from "../components/boards/adminBoard";
import UserService from "../services/user.service";
import { cleanup } from "@testing-library/react";


jest.mock("axios");
jest.mock("../services/user.service");

// Black-box tests
describe("BoardAdmin Component - Black-box tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    UserService.adminAccess.mockResolvedValueOnce({ data: "Admin Board" });
    axios.get.mockResolvedValueOnce({ data: { count: 0, users: [] } });
    axios.get.mockResolvedValueOnce({ data: { count: 0, shops: [] } });
    axios.get.mockResolvedValueOnce({ data: { count: 0, products: [] } });
    axios.get.mockResolvedValueOnce({ data: { count: 0, allPosts: [] } });
  });
  afterEach(() => {
    cleanup();
  });
  test("renders BoardAdmin component without crashing", async () => {
    await act(async () => {
      render(<BoardAdmin />);
    });
  });

  test("renders the admin header on successful admin access", async () => {
    render(<BoardAdmin />);

    await waitFor(() => {
      expect(screen.getByText("USERS and SHOPS")).toBeInTheDocument();
    });
  });

  test("renders products and blogs headers", async () => {
    render(<BoardAdmin />);
    await waitFor(() => {
      expect(screen.getByText("PRODUCTS")).toBeInTheDocument();
      expect(screen.getByText("BLOGS")).toBeInTheDocument();
    });
  });
  
  
});
