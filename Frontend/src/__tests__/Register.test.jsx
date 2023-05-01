import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../components/register/register";
import { BrowserRouter } from "react-router-dom";

describe("Register component white-box tests", () => {
  test("1. Component renders without crashing", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
  });

  test("2. 'Create Shop' button links to '/shopRegister'", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    const createShopButton = screen.getByText("Create Shop");
    expect(createShopButton).toHaveAttribute("href", "/shopRegister");
  });

  test("3. 'Become User' button links to '/usersignup'", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );
    const becomeUserButton = screen.getByText("Become User");
    expect(becomeUserButton).toHaveAttribute("href", "/usersignup");
  });

  test("4. Text 'I would like to...' is displayed", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    expect(screen.getByText("I would like to...")).toBeInTheDocument();
  });

  test("5. Images for 'Create Shop' and 'Become User' options are displayed", () => {
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    );
    const createShopImage = screen.getByAltText("Create Shop");
    expect(createShopImage).toBeInTheDocument();
    const becomeUserImage = screen.getByAltText("Become User");
    expect(becomeUserImage).toBeInTheDocument();
  });
});
