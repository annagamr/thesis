import axios from 'axios';

const API_URL = 'http://localhost:3002/api/';

class productService {
    getAllProducts() {
        return axios.get(API_URL + 'products');

  }}
  
  export default new productService();