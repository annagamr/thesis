import axios from "../__mocks__/axios";
import ProductService from "../services/product.service";

jest.mock("axios");

describe("ProductService Tests", () => {
  test("1. Test if the ProductService instance is created without errors", () => {
    expect(ProductService).toBeDefined();
  });

  test("2. Test if the getAllProducts method sends a GET request to the correct URL", async () => {
    const expectedURL = "http://localhost:3002/api/products";
    const mockedGet = axios.get.mockResolvedValueOnce({ data: [] });
    await ProductService.getAllProducts();
    expect(mockedGet).toHaveBeenCalledWith(expectedURL);
  });

  test("3. Test if the getSellerProducts method sends a GET request to the correct URL", async () => {
    const expectedUserId = "test_user_id";
    const expectedURL = `http://localhost:3002/api/productsbyAuthor/${expectedUserId}`;
    const mockedGet = axios.get.mockResolvedValueOnce({ data: [] });
    await ProductService.getSellerProducts(expectedUserId);
    expect(mockedGet).toHaveBeenCalledWith(expectedURL);
  });

  test("4. Test if the getProductImages method sends a GET request to the correct URL", async () => {
    const expectedUserId = "test_user_id";
    const expectedURL = `http://localhost:3002/api/product-image/${expectedUserId}`;
    const mockedGet = axios.get.mockResolvedValueOnce({ data: [] });
    await ProductService.getProductImages(expectedUserId);
    expect(mockedGet).toHaveBeenCalledWith(expectedURL);
  });

  test("5. Test if the getProductById method sends a GET request to the correct URL", async () => {
    const expectedId = "test_product_id";
    const expectedURL = `http://localhost:3002/api/products/${expectedId}`;
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
      "http://localhost:3002/api/product-image/test_user_id"
    );
    expect(actualData).toEqual(expectedData);
  });

//   test('7. Test if the getProductById method handles errors correctly', async () => {
//     console.log = jest.fn(); // Mock console.log
  
//     const errorMessage = '[Error retrieving product data]';
//     const mockedGet = axios.get.mockRejectedValueOnce(new Error(errorMessage));
  
//     const actualData = await ProductService.getProductById('test_id');
  
//     expect(mockedGet).toHaveBeenCalledWith('http://localhost:3002/api/products/test_id');
//     expect(actualData).toBeNull();
//     expect(console.log).toHaveBeenCalledWith(errorMessage);
  
//     console.log.mockRestore(); // Restore console.log
//   });
});
