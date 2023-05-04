import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import Header from "../components/header/header";
import cartService from "../services/cart.service";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { CartContext } from "../components/cart/CartContext";

jest.mock("../services/cart.service", () => {
  return {
    getCart: jest.fn(() => {
      return Promise.resolve({ data: {} });
    }),
  };
});
const setTotalItemsMock = jest.fn();

describe("Header component", () => {
  test("1. Renders the Header component without error", () => {
    render(
      <CartContext.Provider
        value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
      >
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </CartContext.Provider>
    );
    const headerElement = screen.getByTestId("header");
    expect(headerElement).toBeInTheDocument();
  });

  test("2. Displays the correct navigation items for a user with no role", () => {
    render(
      <CartContext.Provider
        value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
      >
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </CartContext.Provider>
    );
    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByText(/shop/i)).toBeInTheDocument();
    expect(screen.getByText(/blog/i)).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  test("3. Displays the correct navigation items for a user with the 'ROLE_USER' role", async () => {
    // Mock localStorage.getItem to return a user with the "ROLE_USER" role
    Storage.prototype.getItem = jest.fn(() =>
      JSON.stringify({
        id: 1,
        roles: ["ROLE_USER"],
      })
    );

    await act(async () => {
      render(
        <CartContext.Provider
          value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
        >
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </CartContext.Provider>
      );
    });

    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByText(/shop/i)).toBeInTheDocument();
    expect(screen.getByText(/blog/i)).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  test("4. Displays the correct navigation items for a user with the 'ROLE_SELLER' role", async () => {
    // Mock localStorage.getItem to return a user with the "ROLE_SELLER" role
    Storage.prototype.getItem = jest.fn(() =>
      JSON.stringify({
        id: 2,
        roles: ["ROLE_SELLER"],
      })
    );

    await act(async () => {
      render(
        <CartContext.Provider
          value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
        >
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </CartContext.Provider>
      );
    });

    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByText(/blog/i)).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });

  test("5. Displays the correct navigation items for a user with the 'ROLE_ADMIN' role", async () => {
    // Mock localStorage.getItem to return a user with the "ROLE_SELLER" role
    Storage.prototype.getItem = jest.fn(() =>
      JSON.stringify({
        id: 2,
        roles: ["ROLE_ADMIN"],
      })
    );

    await act(async () => {
      render(
        <CartContext.Provider
          value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
        >
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </CartContext.Provider>
      );
    });

    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByText(/blog/i)).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });
  // white box tests
  test("1. Renders the logo correctly", () => {
    render(
      <CartContext.Provider
        value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
      >
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </CartContext.Provider>
    );
    const logoElement = screen.getByText(/Aurora\./i);
    expect(logoElement).toBeInTheDocument();
  });
  Storage.prototype.removeItem = jest.fn();

  test("2. Calls `logOut` function when the logout icon is clicked", async () => {
    Storage.prototype.getItem = jest.fn(() =>
      JSON.stringify({
        id: 1,
        roles: ["ROLE_USER"],
      })
    );
    Storage.prototype.removeItem = jest.fn(); // Add this line

    const { getByTestId } = render(
      <CartContext.Provider
        value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
      >
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </CartContext.Provider>
    );
    const logoutIcon = getByTestId("logout-icon");

    await act(async () => {
      fireEvent.click(logoutIcon);
    });

    expect(localStorage.removeItem).toHaveBeenCalledWith("user");
  });

  test('4. Does not render the cart icon for a user with the "ROLE_ADMIN" role', () => {
    Storage.prototype.getItem = jest.fn(() =>
      JSON.stringify({
        id: 1,
        roles: ["ROLE_ADMIN"],
      })
    );

    const { queryByTestId } = render(
      <CartContext.Provider
        value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
      >
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </CartContext.Provider>
    );

    expect(queryByTestId("cart-icon")).toBeNull();
  });

  test('5. Does not render the cart icon for a user with the "ROLE_SELLER" role', () => {
    Storage.prototype.getItem = jest.fn(() =>
      JSON.stringify({
        id: 1,
        roles: ["ROLE_SELLER"],
      })
    );

    const { queryByTestId } = render(
      <CartContext.Provider
        value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
      >
        <BrowserRouter>
          <Header />
        </BrowserRouter>
      </CartContext.Provider>
    );

    expect(queryByTestId("cart-icon")).toBeNull();
  });
});
