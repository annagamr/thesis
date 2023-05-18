import React from "react";
import { render, screen } from "@testing-library/react";
import Success from "../components/cart/success";
import axios from "axios";
import { act } from "react-dom/test-utils";
import { CartContext } from "../components/cart/CartContext";

jest.mock("axios");
const setTotalItemsMock = jest.fn();

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

  test("1. Renders without crashing", async () => {
    await act(async () => {
      render(
        <CartContext.Provider
          value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
        >
          <Success />
        </CartContext.Provider>
      );
    });
  });

  test("2. Renders We received your order! paragraph", async () => {
    await act(async () => {
      render(
        <CartContext.Provider
          value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
        >
          <Success />
        </CartContext.Provider>
      );
    });
    expect(screen.getByText("We received your order!")).toBeInTheDocument();
  });

  test("3. Removes cartItems from localStorage after creating order", async () => {
    axios.post.mockResolvedValueOnce({ status: 200, ok: true });
    axios.post.mockResolvedValueOnce({ status: 200, ok: true });

    await act(async () => {
      render(
        <CartContext.Provider
          value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
        >
          <Success />
        </CartContext.Provider>
      );
    });

    const successMessage = await screen.findByText("Cart cleared successfully!");
    expect(successMessage).toBeInTheDocument();

    expect(localStorage.getItem("cartItems")).toBeNull();
  });

  test("4. createOrder function error handling", async () => {
    axios.post.mockRejectedValueOnce(new Error("HTTP error! Status: 500"));

    await act(async () => {
      render(
        <CartContext.Provider
          value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
        >
          <Success />
        </CartContext.Provider>
      );
    });

    const errorMsg = screen.getByText("HTTP error! Status: 500");
    expect(errorMsg).toBeInTheDocument();
  });

  test("5. createOrder function skips with invalid cartItems", async () => {
    localStorage.setItem("cartItems", JSON.stringify({ items: "invalid" }));

    await act(async () => {
      render(
        <CartContext.Provider
          value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
        >
          <Success />
        </CartContext.Provider>
      );
    });

    const errorMsg = screen.getByText("Error: invalid cartItems");
    expect(errorMsg).toBeInTheDocument();
  });
});
