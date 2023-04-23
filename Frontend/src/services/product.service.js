import axios from 'axios';

class productService {
  getAllProducts() {
    return axios.get('http://localhost:3002/api/products');

  }
  getSellerProducts(userId) {
    return axios.get(`http://localhost:3002/api/productsbyAuthor/${userId}`);

  }
  getProductImages(userId) {
    return axios.get(`http://localhost:3002/api/product-image/${userId}`);
  }
  async getProductById(id) {
    try {
      const response = await axios.get(`http://localhost:3002/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export default new productService();