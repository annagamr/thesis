import axios from 'axios';

class ProductService {
  getAllProducts() {
    return axios.get(process.env.REACT_APP_BACKEND_ENDPOINT + '/api/products');

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

const productService = new ProductService();
export default productService;
