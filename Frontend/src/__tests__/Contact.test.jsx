import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import ContactPage from "../components/contact/contact";
import { send } from "emailjs-com";

jest.mock("emailjs-com", () => ({
  send: jest.fn(() => Promise.resolve()),
}));

describe("ContactPage component - Black-box tests", () => {
  test("1. Component renders without crashing", () => {
    const { container } = render(<ContactPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  test("2. Input fields exist and their initial values are empty", () => {
    const { getByPlaceholderText } = render(<ContactPage />);
    const nameInput = getByPlaceholderText("John Doe");
    const emailInput = getByPlaceholderText("john.doe@gmail.com");
    const messageInput = getByPlaceholderText("Describe your issue/Question");

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(messageInput).toBeInTheDocument();

    expect(nameInput.value).toBe("");
    expect(emailInput.value).toBe("");
    expect(messageInput.value).toBe("");
  });
  test("3. Submit button exists and is initially enabled", () => {
    const { getByText } = render(<ContactPage />);
    const submitButton = getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeEnabled();
  });
  test("4. Success message is not shown initially", () => {
    const { queryByText } = render(<ContactPage />);
    const successMessage = queryByText(
      /Submitted successfully! We will get back to you soon./i
    );
    expect(successMessage).not.toBeInTheDocument();
  });
  test("5. Success message appears after the form is submitted", async () => {
    const { getByText, getByPlaceholderText, findByText } = render(
      <ContactPage />
    );
    const nameInput = getByPlaceholderText("John Doe");
    const emailInput = getByPlaceholderText("john.doe@gmail.com");
    const messageInput = getByPlaceholderText("Describe your issue/Question");
    const submitButton = getByText("Submit");

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john.doe@gmail.com" } });
    fireEvent.change(messageInput, { target: { value: "Test message" } });
    fireEvent.click(submitButton);

    const successMessage = await findByText(
      "Submitted successfully! We will get back to you soon."
    );
    expect(successMessage).toBeInTheDocument();
    expect(send).toHaveBeenCalled();
  });
});
