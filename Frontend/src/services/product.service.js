import axios from 'axios';

class productService {
    getAllProducts() {
        return axios.get('http://localhost:3002/api/products');

  }}
  
  export default new productService();