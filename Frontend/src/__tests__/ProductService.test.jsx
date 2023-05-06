import axios from "axios";
import ProductService from "../services/product.service";

jest.mock("axios");

describe("ProductService Tests", () => {
  test("1. Test if the ProductService instance is created without errors", () => {
    expect(ProductService).toBeDefined();
  });

  test("2. Test if the getAllProducts method sends a GET request to the correct URL", async () => {
    const expectedURL = process.env.REACT_APP_BACKEND_ENDPOINT + "/api/products";
    const mockedGet = axios.get.mockResolvedValueOnce({ data: [] });
    await ProductService.getAllProducts();
    expect(mockedGet).toHaveBeenCalledWith(expectedURL);
  });

  test("3. Test if the getSellerProducts method sends a GET request to the correct URL", async () => {
    const expectedUserId = "test_user_id";
    const expectedURL = process.env.REACT_APP_BACKEND_ENDPOINT + `/api/productsbyAuthor/${expectedUserId}`;
    const mockedGet = axios.get.mockResolvedValueOnce({ data: [] });
    await ProductService.getSellerProducts(expectedUserId);
    expect(mockedGet).toHaveBeenCalledWith(expectedURL);
  });

  test("4. Test if the getProductImages method sends a GET request to the correct URL", async () => {
    const expectedUserId = "test_user_id";
    const expectedURL = process.env.REACT_APP_BACKEND_ENDPOINT + `/api/product-image/${expectedUserId}`;
    const mockedGet = axios.get.mockResolvedValueOnce({ data: [] });
    await ProductService.getProductImages(expectedUserId);
    expect(mockedGet).toHaveBeenCalledWith(expectedURL);
  });

  test("5. Test if the getProductById method sends a GET request to the correct URL", async () => {
    const expectedId = "test_product_id";
    const expectedURL = process.env.REACT_APP_BACKEND_ENDPOINT + `/api/products/${expectedId}`;
    const mockedGet = axios.get.mockResolvedValueOnce({ data: {} });
    await ProductService.getProductById(expectedId);
    expect(mockedGet).toHaveBeenCalledWith(expectedURL);
  });

  test("6. Test if the getProductImages method returns the correct data", async () => {
    const expectedData = [
      { id: "1", url: "http://example.com/image1.jpg" },
      { id: "2", url: "http://example.com/image2.jpg" },
    ];
    const mockResponse = { data: expectedData };
    const mockedGet = axios.get.mockResolvedValueOnce(mockResponse);

    const { data: actualData } = await ProductService.getProductImages(
      "test_user_id"
    );
    expect(mockedGet).toHaveBeenCalledWith(
      process.env.REACT_APP_BACKEND_ENDPOINT + "/api/product-image/test_user_id"
    );
    expect(actualData).toEqual(expectedData);
  });
});
