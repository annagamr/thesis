import About, { slides, reasons } from "../components/about/about";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { BrowserRouter } from "react-router-dom";
import { render } from "@testing-library/react";

describe("About component", () => {
  test("Renders slider with slides", () => {
    const { queryAllByTestId } = render(<BrowserRouter><About /></BrowserRouter>);
    const slides = queryAllByTestId(/^slide-img-/);
    expect(slides.length).toBe(6);
  });

  test("Renders aurora-header", () => {
    const { getByTestId } = render(<BrowserRouter><About /></BrowserRouter>);
    const auroraHeader = getByTestId("aurora-header");
    expect(auroraHeader).toBeInTheDocument();
  });

  test("Renders intro-container with store image", () => {
    const { getByTestId } = render(<BrowserRouter><About /></BrowserRouter>);
    const storeImage = getByTestId("store-image");
    expect(storeImage).toBeInTheDocument();
  });

  test("renders categories with images", () => {
    const { queryAllByTestId } = render(<BrowserRouter><About /></BrowserRouter>);
    const categories = queryAllByTestId("category-item");
    expect(categories.length).toBe(6);
  });

  test("Renders correct number of slides", () => {
    const { queryAllByTestId } = render(<BrowserRouter><About /></BrowserRouter>);
    const slideItems = queryAllByTestId(/slide-img-/);
    expect(slideItems.length).toBe(slides.length);
  });
  jest.setTimeout(10000);

  test("Renders two rows of categories", () => {
    const { container } = render(<BrowserRouter><About /></BrowserRouter>);
    const rows = container.querySelectorAll(".category-boxes .row");
    expect(rows.length).toBe(2);
  });

  test("renders correct number of steps in how-to section", () => {
    const { container } = render(<BrowserRouter><About /></BrowserRouter>);
    const steps = container.querySelectorAll(".how-to ol li");
    expect(steps.length).toBe(3);
  });

  test("Initial slide index is set to 0", () => {
    const { getByTestId } = render(<BrowserRouter><About /></BrowserRouter>);
    const slides = getByTestId("slide-container");
    expect(slides).toHaveAttribute("index", "0");
  });

  test("Autoplay interval is set to 5000ms", () => {
    const { getByTestId } = render(<BrowserRouter><About /></BrowserRouter>);
    const slides = getByTestId("slide-container");
    expect(slides).toHaveAttribute("autoplay-duration", "5000");
  });
});
