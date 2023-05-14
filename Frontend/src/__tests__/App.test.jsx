import { render, screen } from "@testing-library/react";
import App from "../App";
import React from "react";

describe("App", () => {
  test("Renders App with no issue", () => {
    render(<App />);
    const headerElement = screen.getByTestId("header");
    const footerElement = screen.getByTestId("footer");
    expect(headerElement).toBeInTheDocument();
    expect(footerElement).toBeInTheDocument();
  });
});
