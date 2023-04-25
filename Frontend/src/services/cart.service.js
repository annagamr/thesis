import axios from 'axios';

function getAccessTokenHeaderFromLocalStorage() {
  // Retrieve the user object from the local storage
  const user = JSON.parse(localStorage.getItem('user'));

  // Check if the user object exists and if it has an accessToken property
  if (user && user.accessToken) {
    // If the user object has an accessToken property, return an HTTP header object
    // with a single key-value pair where the key is 'x-access-token' and the
    // value is the accessToken retrieved from the user object
    return { 'x-access-token': user.accessToken };
  } else {
    // If the user object does not exist or the accessToken property is not present,
    // return an empty HTTP header object
    return {};
  }
}

class CartService {
  constructor() {
    this.baseURL = 'http://localhost:3002/api/cart';
    this.headers = getAccessTokenHeaderFromLocalStorage();
  }

  async getCart(author) {
    const url = `${this.baseURL}/products/${author}`;
    const response = await axios.post(url, {}, { headers: this.headers });
    return response.data;
  }

  async addToCart(productId) {
    const url = `${this.baseURL}/add/${productId}`;
    const response = await axios.post(url, {}, { headers: this.headers });
    return response.data;
  }

  async removeFromCart(itemId) {
    const url = `${this.baseURL}/remove/${itemId}`;
    const response = await axios.post(url, {}, { headers: this.headers });
    return response.data;
  }
}

export default new CartService();