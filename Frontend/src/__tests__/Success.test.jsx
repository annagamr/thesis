import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Success from "../components/cart/success";
import axios from "axios";
import { act } from "react-dom/test-utils";

jest.mock("axios");

const localStorageMock = (function () {
  let store = {};

  return {
    getItem: function (key) {
      return store[key] || null;
    },
    setItem: function (key, value) {
      store[key] = value.toString();
    },
    removeItem: function (key) {
      delete store[key];
    },
    clear: function () {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Success Component", () => {
  beforeEach(() => {
    const user = { id: 1 };
    const cartItems = { items: [{ id: 1 }, { id: 2 }] };
    window.localStorage.setItem("user", JSON.stringify(user));
    window.localStorage.setItem("cartItems", JSON.stringify(cartItems));
  });

  test("renders without crashing", async () => {
    await act(async () => {
      render(<Success />);
    });
  });

  test("renders We received your order! paragraph", async () => {
    await act(async () => {
      render(<Success />);
    });
    expect(screen.getByText("We received your order!")).toBeInTheDocument();
  });

  test("removes cartItems from localStorage after creating order", async () => {
    axios.post.mockResolvedValueOnce({ ok: true });
    axios.post.mockResolvedValueOnce({ ok: true });

    await act(async () => {
      render(<Success />);
    });

    await waitFor(() => {
      expect(screen.getByText("Cart cleared successfully")).toBeInTheDocument();
    });

    expect(localStorage.getItem("cartItems")).toBeNull();
  });

  test("createOrder function error handling", async () => {
    axios.post.mockRejectedValueOnce(new Error("HTTP error! Status: 500"));

    await act(async () => {
      render(<Success />);
    });

    const errorMsg = screen.getByText("HTTP error! Status: 500");
    expect(errorMsg).toBeInTheDocument();
  });

  test("createOrder function skips with invalid cartItems", async () => {
    localStorage.setItem("cartItems", JSON.stringify({ items: "invalid" }));

    await act(async () => {
      render(<Success />);
    });

    const errorMsg = screen.getByText("Error: invalid cartItems");
    expect(errorMsg).toBeInTheDocument();
  });
});
