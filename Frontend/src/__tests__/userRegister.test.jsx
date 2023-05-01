import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UserRegister from "../components/user registration/userRegister";
import "@testing-library/jest-dom/extend-expect";
import axios from "../__mocks__/axios";
import { valid_name, valid_em, valid_password } from "../components/user registration/userRegister";

jest.mock("axios");

describe("UserRegister component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // Black-box tests
  test("1. Renders the UserRegister component without error", () => {
    render(<UserRegister />);
    const registrationPage = screen.getByTestId("registration-page");
    expect(registrationPage).toBeInTheDocument();
  });

  test("2. Displays the correct form inputs and button", () => {
    render(<UserRegister />);
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  test("3. Successful registration displays a success message", async () => {
    axios.post.mockResolvedValue({ data: { message: "Registration successful" } });

    render(<UserRegister />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "TestUser1" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "Password123" } });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => expect(screen.getByText(/registration successful/i)).toBeInTheDocument());
  });
  test("4. Invalid input displays an error message", async () => {
    render(<UserRegister />);

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: "123" } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "invalid.email.com" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "short" } });
    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => expect(screen.getByText(/invalid username/i)).toBeInTheDocument());
  });
  test("5. Displays error messages for invalid inputs", () => {
    render(<UserRegister />);
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });
  
    // Test invalid username
    fireEvent.change(usernameInput, { target: { value: "joh" } }); // Too short
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    expect(screen.getByText("Invalid username")).toBeInTheDocument();
  
    // Test invalid email
    fireEvent.change(usernameInput, { target: { value: "john123" } });
    fireEvent.change(emailInput, { target: { value: "johnexample.com" } }); // Missing @
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  
    // Test invalid password
    fireEvent.change(usernameInput, { target: { value: "john123" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "pass" } }); // Too short
    fireEvent.click(submitButton);
    expect(screen.getByText("Invalid password")).toBeInTheDocument();
  });

  //white box tests
  test("1. Username validation works correctly", () => {
    expect(valid_name("john")).toBe(false);
    expect(valid_name("j")).toBe(true);
    expect(valid_name("john123")).toBe(false);
    expect(valid_name("123john")).toBe(false);
    expect(valid_name("john_123")).toBe(false);
  });
  
  test("2. Email validation works correctly", () => {
    expect(valid_em("john@example.com")).toBe(false);
    expect(valid_em("john@example")).toBe(true);
    expect(valid_em("john@.com")).toBe(true);
  });
  
  test("3. Password validation works correctly", () => {
    expect(valid_password("password123")).toBe(false);
    expect(valid_password("password")).toBe(true);
    expect(valid_password("12345678")).toBe(true);
    expect(valid_password("pass123")).toBe(true);
    expect(valid_password("verylongpasswordwith123")).toBe(true);
  });

  test("4. State updates when input values change", () => {
    render(<UserRegister />);
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
  
    fireEvent.change(usernameInput, { target: { value: "john123" } });
    expect(usernameInput.value).toBe("john123");
  
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    expect(emailInput.value).toBe("john@example.com");
  
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput.value).toBe("password123");
  });


  test("5. Form submission and error handling", async () => {
    render(<UserRegister />);
    axios.post.mockResolvedValue({ data: { message: "User registered successfully" } });
  
    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });
  
    fireEvent.change(usernameInput, { target: { value: "john123" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
  
    fireEvent.click(submitButton);
  
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith("http://localhost:3002/api/auth/signup", {
      username: "john123",
      email: "john@example.com",
      password: "password123",
      roles: ["user"],
    });
  
    await waitFor(() => screen.getByText("User registered successfully"));
  });
});
