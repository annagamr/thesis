import axios from 'axios';
import CartService from '../services/cart.service';

jest.mock('axios');

describe('CartService Tests', () => {
  test('1. Test if the cartService instance is created without errors', () => {
    expect(CartService).toBeDefined();
  });

  test('2. Test if the baseURL property is set correctly in the cartService instance', () => {
    const expectedURL = 'http://localhost:3002/api/cart';
    expect(CartService.baseURL).toBe(expectedURL);
  });

  test('3. Test if the getCart method returns the correct data', async () => {
    const expectedData = {
      products: [
        {
          id: '1234',
          name: 'Product 1',
          price: 10,
        },
        {
          id: '5678',
          name: 'Product 2',
          price: 20,
        },
      ],
      total: 50,
    };
    const mockResponse = { data: expectedData };
    const mockedPost = axios.post.mockResolvedValueOnce(mockResponse);

    const actualData = await CartService.getCart('test_author');
    expect(mockedPost).toHaveBeenCalledWith(
      `${CartService.baseURL}/products/test_author`,
      {},
      { headers: {} }
    );
    expect(actualData).toEqual(expectedData);
  });

  test('4. Test if the addToCart method sends the correct data to the API', async () => {
    const expectedData = {
      products: [
        {
          id: '1234',
          name: 'Product 1',
          price: 10,
        },
        {
          id: '5678',
          name: 'Product 2',
          price: 20,
        },
      ],
      total: 50,
    };
    const mockResponse = { data: expectedData };
    const mockedPost = axios.post.mockResolvedValueOnce(mockResponse);

    const actualData = await CartService.addToCart('test_product_id');
    expect(mockedPost).toHaveBeenCalledWith(
      `${CartService.baseURL}/add/test_product_id`,
      {},
      { headers: {} }
    );
    expect(actualData).toEqual(expectedData);
  });

  test('5. Test if the removeFromCart method sends the correct data to the API', async () => {
    const expectedData = {
      products: [
        {
          id: '1234',
          name: 'Product 1',
          price: 10,
        },
        {
          id: '5678',
          name: 'Product 2',
          price: 20,
        },
      ],
      total: 50,
    };
    const mockResponse = { data: expectedData };
    const mockedPost = axios.post.mockResolvedValueOnce(mockResponse);

    const actualData = await CartService.removeFromCart('test_item_id');
    expect(mockedPost).toHaveBeenCalledWith(
      `${CartService.baseURL}/remove/test_item_id`,
      {},
      { headers: {} }
    );
    expect(actualData).toEqual(expectedData);
  });

  test('6. Test if the getCart method returns the correct number of items in the cart', async () => {
    const mockedPost = axios.post.mockResolvedValueOnce({
      data: [
        { productId: 'product1', quantity: 2 },
        { productId: 'product2', quantity: 1 },
      ]
    });
    const actualData = await CartService.getCart('test_author');
    expect(mockedPost).toHaveBeenCalledWith(`${CartService.baseURL}/products/test_author`, {}, { headers: {} });
    expect(actualData).toHaveLength(2);
    expect(actualData[0].productId).toBe('product1');
    expect(actualData[0].quantity).toBe(2);
    expect(actualData[1].productId).toBe('product2');
    expect(actualData[1].quantity).toBe(1);
  });


});