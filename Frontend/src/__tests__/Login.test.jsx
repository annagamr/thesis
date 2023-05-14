import React from "react";
import {
  render,
  fireEvent,
  screen,
  waitFor,
} from "@testing-library/react";
import Login from "../components/login/login";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { act } from "react-dom/test-utils";

jest.mock("axios");
jest.mock("../services/user.service");
jest.mock("../services/cart.service", () => {
  return {
    getCart: jest.fn(),
  };
});

describe("Login component tests", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test("1. Test if the component renders without crashing", () => {
    render(
      <Router>
        <Login />
      </Router>
    );
  });

  test("2. Test if the login form has a username and password input fields", () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
  });

  test("3. Test if the login form has a 'Forgot Password?' link", () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    expect(screen.getByText("Forgot Password?")).toBeInTheDocument();
  });

  test("4. Test if the login form has a 'Login' button", () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  test("5. Test if the updateUsername function updates the state of the username variable correctly", () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    const usernameInput = screen.getByLabelText("Username");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });

    expect(usernameInput.value).toBe("testuser");
  });

  test("6. Test if the updatePassword function updates the state of the password variable correctly", () => {
    render(
      <Router>
        <Login />
      </Router>
    );
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    expect(passwordInput.value).toBe("testpassword");
  });

  test("7. Test if the handleLogin function makes an HTTP POST request to the backend with the username and password", async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByText("Login");

    fireEvent.change(usernameInput, { target: { value: "testuser" } });
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    axios.post.mockResolvedValueOnce({ data: { accessToken: "testtoken" } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
      expect(axios.post).toHaveBeenCalledWith(
        process.env.REACT_APP_BACKEND_ENDPOINT + "/api/auth/signin",
        { username: "testuser", password: "testpassword" }
      );
    });
  });

  test("8. Test if the handleLogin function updates localStorage with the accessToken received from the backend", async () => {
    render(
      <Router>
        <Login />
      </Router>
    );

    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");
    const loginButton = screen.getByText("Login");
    await act(async () => {
      fireEvent.change(usernameInput, { target: { value: "testuser" } });
      fireEvent.change(passwordInput, { target: { value: "testpassword" } });
    });
    axios.post.mockResolvedValueOnce({ data: { accessToken: "testtoken" } });

    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(localStorage.getItem("user")).toBe(
        JSON.stringify({ accessToken: "testtoken" })
      );
    });
  });

});
