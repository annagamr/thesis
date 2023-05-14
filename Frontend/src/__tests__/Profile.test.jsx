import React from "react";
import { render, screen, act } from "@testing-library/react";
import Profile from "../components/profiles/profile";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";

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

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Profile component", () => {
  // Black-box tests
  test("1. Renders the Profile component without error", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      );
    });
    const profilePage = screen.getByTestId("profile-page");
    expect(profilePage).toBeInTheDocument();
  });

  // Add async and await act to the rest of the tests
  test("2. Displays the seller profile if user has the ROLE_SELLER", async () => {
    const user = {
      username: "seller",
      email: "seller@example.com",
      roles: ["ROLE_SELLER"],
    };
    localStorage.setItem("user", JSON.stringify(user));
    await act(async () => {
      render(
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      );
    });
    expect(screen.getByText("SHOP DETAILS")).toBeInTheDocument();
  });

  test("3. Displays the user profile if user has the ROLE_USER", async () => {
    const user = {
      username: "user",
      email: "user@example.com",
      roles: ["ROLE_USER"],
    };
    localStorage.setItem("user", JSON.stringify(user));
    await act(async () => {
      render(
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      );
    });
    expect(screen.getByText("USER DETAILS")).toBeInTheDocument();
  });

  test("4. Displays the admin profile if user has the ROLE_ADMIN", async () => {
    const user = {
      username: "admin",
      email: "admin@example.com",
      roles: ["ROLE_ADMIN"],
    };
    localStorage.setItem("user", JSON.stringify(user));
    await act(async () => {
      render(
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      );
    });
    expect(screen.getByText("ADMIN DETAILS")).toBeInTheDocument();
  });

  test("5. Does not display any profiles if the user has no roles", async () => {
    const user = {
      username: "noRole",
      email: "noRole@example.com",
      roles: [],
    };
    localStorage.setItem("user", JSON.stringify(user));
    await act(async () => {
      render(
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      );
    });
    expect(screen.queryByText("USER DETAILS")).not.toBeInTheDocument();
    expect(screen.queryByText("SHOP DETAILS")).not.toBeInTheDocument();
    expect(screen.queryByText("ADMIN DETAILS")).not.toBeInTheDocument();
  });
});
