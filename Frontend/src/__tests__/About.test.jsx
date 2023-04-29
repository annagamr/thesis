import About, { slides, reasons } from "../components/about/about";
import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";

describe("About component", () => {
  test("Renders slider with slides", () => {
    const { queryAllByTestId } = render(<About />);
    const slides = queryAllByTestId(/^slide-img-/);
    expect(slides.length).toBe(6);
  });

  test("Renders reasons with icons", () => {
    const { queryAllByTestId } = render(<About />);
    const reasons = queryAllByTestId("reason-item");
    expect(reasons).toHaveLength(3);
  });

  test("Renders aurora-header", () => {
    const { getByTestId } = render(<About />);
    const auroraHeader = getByTestId("aurora-header");
    expect(auroraHeader).toBeInTheDocument();
  });

  test("Renders intro-container with store image", () => {
    const { getByTestId } = render(<About />);
    const storeImage = getByTestId("store-image");
    expect(storeImage).toBeInTheDocument();
  });

  test("renders categories with images", () => {
    const { queryAllByTestId } = render(<About />);
    const categories = queryAllByTestId("category-item");
    expect(categories.length).toBe(7);
  });

  test("Renders correct number of slides", () => {
    const { queryAllByTestId } = render(<About />);
    const slideItems = queryAllByTestId(/slide-img-/);
    expect(slideItems.length).toBe(6);
  });
  jest.setTimeout(6000);

  test("Slider changes index state after specified duration", async () => {
    const { queryAllByTestId } = render(<About />);
    const initialSlideItems = queryAllByTestId(/slide-img-/);
    const initialVisibleSlide = initialSlideItems.find((slide) =>
      slide.src.includes(slides[0].imgSrc)
    );
    expect(initialVisibleSlide).toBeTruthy();

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
    });

    const updatedSlideItems = queryAllByTestId(/slide-img-/);
    const updatedVisibleSlide = updatedSlideItems.find((slide) =>
      slide.src.includes(slides[1].imgSrc)
    );
    expect(updatedVisibleSlide).toBeTruthy();
  });

  test("Renders correct number of reason items", () => {
    const { queryAllByTestId } = render(<About />);
    const reasonItems = queryAllByTestId("reason-item");
    expect(reasonItems.length).toBe(reasons.length);
  });

  test("Renders two rows of categories", () => {
    const { container } = render(<About />);
    const rows = container.querySelectorAll(".category-boxes .row");
    expect(rows.length).toBe(2);
  });

  test("renders correct number of steps in how-to section", () => {
    const { container } = render(<About />);
    const steps = container.querySelectorAll(".how-to ol li");
    expect(steps.length).toBe(4);
  });

  test("Initial slide index is set to 0", () => {
    const { getByTestId } = render(<About />);
    const slides = getByTestId("slide-container");
    expect(slides).toHaveAttribute("index", "0");
  });

  test("Autoplay interval is set to 5000ms", () => {
    const { getByTestId } = render(<About />);
    const slides = getByTestId("slide-container");
    expect(slides).toHaveAttribute("autoplay-duration", "5000");
  });
  test("Number of category items is equal to the length of the slides plus one", () => {
    const { queryAllByTestId } = render(<About />);
    const categoryItems = queryAllByTestId("category-item");
    expect(categoryItems.length).toBe(Math.ceil(slides.length + 1));
  });
});
