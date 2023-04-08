import axios from 'axios';

const API_URL = 'http://localhost:3002/api/';

class postService {
    getAllPosts() {
        return axios.get(API_URL + 'posts');

  }}
  
  export default new postService();