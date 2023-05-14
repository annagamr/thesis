import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import Forgot from "../components/login/forgot";
import { act } from "react-dom/test-utils";

jest.mock("axios");

describe("Forgot Component", () => {
  test("1. Test if the component renders without crashing", () => {
    render(<Forgot />);
    const forgotComponent = screen.getByTestId("forgot-page");
    expect(forgotComponent).toBeInTheDocument();
  });

  test("2. Test if the input field for email is rendered", () => {
    render(<Forgot />);
    const emailInput = screen.getByLabelText("Enter Email:");
    expect(emailInput).toBeInTheDocument();
  });

  test("3. Test if the button for resetting the password is rendered", () => {
    render(<Forgot />);
    const resetButton = screen.getByRole("button", { name: /reset password/i });
    expect(resetButton).toBeInTheDocument();
  });

  test("4. Test if the function handleSubmit is called when the form is submitted", async () => {
    const mockedPost = jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: { message: "Password reset link sent successfully" },
    });
  
    render(<Forgot />);
    const emailInput = screen.getByLabelText("Enter Email:");
    const resetButton = screen.getByRole("button", { name: /reset password/i });
  
    await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(resetButton);
    });
  
    expect(mockedPost).toHaveBeenCalledTimes(1);
  });

    test("5. Test if the message is displayed when the form is submitted successfully", async () => {
      jest.spyOn(axios, "post").mockResolvedValueOnce({
        data: { message: "Password reset link sent successfully" },
      });

      render(<Forgot />);
      const emailInput = screen.getByLabelText("Enter Email:");
      const resetButton = screen.getByRole("button", { name: /reset password/i });
      
      await act(async () => {
      fireEvent.change(emailInput, { target: { value: "test@example.com" } });
      fireEvent.click(resetButton);
    });

      const successMessage = await screen.findByText(
        "Password reset link sent successfully"
      );
      expect(successMessage).toBeInTheDocument();
    });
});
