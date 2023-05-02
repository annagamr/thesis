import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import axios from "axios";
import Reset from "../components/login/reset";
import { act } from "react-dom/test-utils";
import { MemoryRouter, BrowserRouter} from "react-router-dom";

jest.mock("axios");

describe("Reset Component - White Box Tests", () => {
  test("1. Test if the component renders without crashing", () => {
    render(<Reset />, { wrapper: MemoryRouter });
    const resetComponent = screen.getByTestId("reset-page");
    expect(resetComponent).toBeInTheDocument();
  });

  test("2. Test if the input field for new password is rendered", () => {
    render(<Reset />, { wrapper: MemoryRouter });
    const newPasswordInput = screen.getByLabelText("New Password:");
    expect(newPasswordInput).toBeInTheDocument();
  });

  test("3. Test if the input field for repeat password is rendered", () => {
    render(<Reset />, { wrapper: MemoryRouter });
    const repeatPasswordInput = screen.getByLabelText("Repeat Password:");
    expect(repeatPasswordInput).toBeInTheDocument();
  });

  test("4. Test if the button for resetting the password is rendered", () => {
    render(<Reset />, { wrapper: MemoryRouter });
    const resetButton = screen.getByRole("button", { name: /reset password/i });
    expect(resetButton).toBeInTheDocument();
  });

  test("5. Test if the function handleSubmit is called when the form is submitted", async () => {
    const mockedPost = jest.spyOn(axios, "post").mockResolvedValueOnce({
      data: { message: "Password reset successful" },
    });

    render(<BrowserRouter><Reset /></BrowserRouter>);

    const newPasswordInput = screen.getByLabelText("New Password:");
    const repeatPasswordInput = screen.getByLabelText("Repeat Password:");
    const resetButton = screen.getByRole("button", { name: /reset password/i });
    await act(async () => {

    fireEvent.change(newPasswordInput, { target: { value: "testPassword" } });
    fireEvent.change(repeatPasswordInput, { target: { value: "testPassword" } });
    fireEvent.click(resetButton);
});

    expect(mockedPost).toHaveBeenCalledTimes(1);
  });
});
