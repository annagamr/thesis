import axios from "../__mocks__/axios";
import ProductDetails from "../components/shop/productDetails";
import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve([{ lat: 0, lon: 0, display_name: "Test Location" }]),
  })
);

const renderProductDetails = (id) => {
  return render(
    <BrowserRouter>
      <ProductDetails id={id} />
    </BrowserRouter>
  );
};

describe("ProductDetails component", () => {
  test("renders product details page with correct data", async () => {
    const product = {
      title: "Test Product",
      description: "Test Product Description",
      author: "Test Author",
      image: "test-image.jpg",
      price: 1000,
      street: "Test Street",
      city: "Test City",
      zipCode: "12345",
    };
    axios.get.mockResolvedValue({ data: { product } });

    renderProductDetails("1");

    const titleElement = await screen.findByText(product.title);
    const descriptionElement = screen.getByText(product.description);
    const authorElement = screen.getByText(`Product by: ${product.author}`);
    const priceElement = screen.getByText(`${product.price} HUF`);

    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
    expect(authorElement).toBeInTheDocument();
    expect(priceElement).toBeInTheDocument();
  });

  test("renders image with correct alt text", async () => {
    const product = {
      title: "Test Product",
      image: "test-image.jpg",
    };
    axios.get.mockResolvedValue({ data: { product } });

    render(
      <BrowserRouter>
        <ProductDetails />
      </BrowserRouter>
    );

    const image = await screen.findByRole("img", { name: "Test Product" });
    expect(image).toHaveAttribute(
      "src",
      "http://localhost:3002/test-image.jpg"
    );
  });
});
