import React from "react";
import { render, screen, act } from "@testing-library/react";
import Profile from "../components/profiles/profile";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import UserContext from "../components/boards/UserContext";
import { ProfileContext } from "../components/profiles/ProfileContext";

// Mock localStorage
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

Object.defineProperty(window, "localStorage", { value: localStorageMock });

const defaultProfileContext = {
  numberOfOrders: 0,
  numberOfProducts: 0,
};

describe("Profile component", () => {
  test("1. Renders the Profile component without error", async () => {
    await act(async () => {
      render(
        <UserContext.Provider value={defaultUserContext}>
          <ProfileContext.Provider value={defaultProfileContext}>
            <BrowserRouter>
              <Profile />
            </BrowserRouter>
          </ProfileContext.Provider>
        </UserContext.Provider>
      );
    });
    const profilePage = screen.getByTestId("profile-page");
    expect(profilePage).toBeInTheDocument();
  });

  test("2. Displays the seller profile if user has the ROLE_SELLER", async () => {
    const user = {
      id: 1, 
      username: "seller",
      email: "seller@example.com",
      roles: ["ROLE_SELLER"],
    };

    const sellerUserContext = {
      ...defaultUserContext,
      currentUser: user,
      showSellerBoard: true,
    };

    await act(async () => {
      render(
        <UserContext.Provider value={sellerUserContext}>
          <ProfileContext.Provider value={defaultProfileContext}>
            <BrowserRouter>
              <Profile />
            </BrowserRouter>
          </ProfileContext.Provider>
        </UserContext.Provider>
      );
    });
    expect(screen.getByText("SHOP DETAILS")).toBeInTheDocument();
  });

  test("3. Displays the user profile if user has the ROLE_USER", async () => {
    const user = {
      id: 1,
      username: "user",
      email: "user@example.com",
      roles: ["ROLE_USER"],
    };

    const userContext = {
      ...defaultUserContext,
      currentUser: user,
      showUserBoard: true,
    };

    await act(async () => {
      render(
        <UserContext.Provider value={userContext}>
          <ProfileContext.Provider value={defaultProfileContext}>
            <BrowserRouter>
              <Profile />
            </BrowserRouter>
          </ProfileContext.Provider>
        </UserContext.Provider>
      );
    });
    expect(screen.getByText("USER DETAILS")).toBeInTheDocument();
  });

  test("4. Displays the admin profile if user has the ROLE_ADMIN", async () => {
    const user = {
      id: 1, 
      username: "admin",
      email: "admin@example.com",
      roles: ["ROLE_ADMIN"],
    };

    const userContext = {
      ...defaultUserContext,
      currentUser: user,
      showAdminBoard: true,
    };

    await act(async () => {
      render(
        <UserContext.Provider value={userContext}>
          <ProfileContext.Provider value={defaultProfileContext}>
            <BrowserRouter>
              <Profile />
            </BrowserRouter>
          </ProfileContext.Provider>
        </UserContext.Provider>
      );
    });
    expect(screen.getByText("ADMIN DETAILS")).toBeInTheDocument();
  });

  test("5. Does not display any profiles if the user has no roles", async () => {
    const user = {
      id: 1, 
      username: "noRole",
      email: "noRole@example.com",
      roles: [],
    };

    const userContext = {
      ...defaultUserContext,
      currentUser: user,
      showUserBoard: false,
      showSellerBoard: false,
      showAdminBoard: false,
    };

    await act(async () => {
      render(
        <UserContext.Provider value={userContext}>
          <ProfileContext.Provider value={defaultProfileContext}>
            <BrowserRouter>
              <Profile />
            </BrowserRouter>
          </ProfileContext.Provider>
        </UserContext.Provider>
      );
    });

    expect(screen.queryByText("USER DETAILS")).not.toBeInTheDocument();
    expect(screen.queryByText("SHOP DETAILS")).not.toBeInTheDocument();
    expect(screen.queryByText("ADMIN DETAILS")).not.toBeInTheDocument();
  });
});
