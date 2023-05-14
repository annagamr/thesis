import React from "react";
import { render, screen, act } from "@testing-library/react";
import Header from "../components/header/header";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import { CartContext } from "../components/cart/CartContext";
import  UserContext  from "../components/boards/UserContext";

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
      <UserContext.Provider value={defaultUserContext}>
        <CartContext.Provider
          value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
        >
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </CartContext.Provider>
      </UserContext.Provider>
    );
    const headerElement = screen.getByTestId("header");
    expect(headerElement).toBeInTheDocument();
  });

  test("2. Displays the correct navigation items for a user with no role", () => {
    render(
      <UserContext.Provider value={defaultUserContext}>
        <CartContext.Provider
          value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
        >
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </CartContext.Provider>
      </UserContext.Provider>
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
        <UserContext.Provider value={defaultUserContext}>
          <CartContext.Provider
            value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
          >
            <BrowserRouter>
              <Header />
            </BrowserRouter>
          </CartContext.Provider>
        </UserContext.Provider>
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
        <UserContext.Provider value={defaultUserContext}>
          <CartContext.Provider
            value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
          >
            <BrowserRouter>
              <Header />
            </BrowserRouter>
          </CartContext.Provider>
        </UserContext.Provider>
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
        <UserContext.Provider value={defaultUserContext}>
          <CartContext.Provider
            value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
          >
            <BrowserRouter>
              <Header />
            </BrowserRouter>
          </CartContext.Provider>
        </UserContext.Provider>
      );
    });

    expect(screen.getByText(/about/i)).toBeInTheDocument();
    expect(screen.getByText(/blog/i)).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
  });
  // white box tests
  test(" Renders the logo correctly", () => {
    render(
      <UserContext.Provider value={defaultUserContext}>
        <CartContext.Provider
          value={{ totalItems: 0, setTotalItems: setTotalItemsMock }}
        >
          <BrowserRouter>
            <Header />
          </BrowserRouter>
        </CartContext.Provider>
      </UserContext.Provider>
    );
    const logoElement = screen.getByText(/Aurora\./i);
    expect(logoElement).toBeInTheDocument();
  });
  Storage.prototype.removeItem = jest.fn();
});
