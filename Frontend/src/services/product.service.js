import axios from 'axios';

class productService {
    getAllProducts() {
        return axios.get('http://localhost:3002/api/products');

  }
  getSellerProducts() {
   return axios.get("http://localhost:3002/api/sellerProducts");
   
}}
  
  export default new productService();