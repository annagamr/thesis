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

}

export default new productService();