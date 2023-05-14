// import React from "react";
// import {
//   render,
//   screen,
//   fireEvent,
//   waitFor,
// } from "@testing-library/react";import AddProduct from "../components/boards/AddProduct";
// import * as UserService from "../services/user.service";
// import productService from "../services/product.service";
// import axios from "axios";
// import { act } from "react-dom/test-utils";

// jest.mock("../services/user.service", () => ({
//   sellerAccess: jest.fn(),
// }));
// jest.mock("../services/product.service", () => ({
//   getAllProducts: jest.fn(),
//   getSellerProducts: jest.fn(),
//   getProductImages: jest.fn(),
//   getProductById: jest.fn(),
// }));
// jest.mock("axios");

// const mockProductData = {
//   prodImageFile: new Blob(),
//   prodImageName: "test-image.jpg",
//   title: "Test Product",
//   description: "This is a test product.",
//   category: "Skin Care",
//   author: "test-user",
//   price: 10,
//   street: "123 Test Street",
//   city: "Budapest",
//   zipCode: "1024",
//   contactNumber: "+36123456789",
// };

// describe("AddProduct Component", () => {
//   afterEach(() => {
//     jest.resetAllMocks();
//   });
  // beforeEach(() => {
  //   axios.post.mockResolvedValue({
  //     data: { message: "Product added successfully." },
  //   });
  // });
//   test("renders without crashing", async () => {
//     productService.getAllProducts.mockResolvedValue({ data: [] });

//     await act(async () => {
//       render(<AddProduct />);
//     });
//   });

//   test("renders Add New Product header when userRole is not non-seller", async () => {
//     UserService.sellerAccess.mockResolvedValue({ data: "some data" });
//     productService.getAllProducts.mockResolvedValue({ data: [] });

//     await act(async () => {
//       render(<AddProduct />);
//     });
//     await waitFor(() => {
//       expect(screen.getByTestId("header-add")).toBeInTheDocument();
//     });
//   });

//   test("updates title input value on change", async () => {
//     UserService.sellerAccess.mockResolvedValue({ data: "some data" });
//     productService.getAllProducts.mockResolvedValue({ data: [] });

//     render(<AddProduct />);

//     await waitFor(() => {
//       const titleInput = screen.getByLabelText(/Title/i);
//       fireEvent.change(titleInput, { target: { value: "Test Title" } });
//       expect(titleInput.value).toBe("Test Title");
//     });
//   });

//   test("renders access message when userRole is non-seller", async () => {
//     UserService.sellerAccess.mockRejectedValue({});
//     productService.getAllProducts.mockResolvedValue({ data: [] });

//     render(<AddProduct />);

//     await waitFor(() => {
//       expect(screen.getByTestId("header-add")).toBeInTheDocument();
//     });
//   });

 
// });
