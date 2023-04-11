import axios from 'axios';

class postService {
    getAllPosts() {
        return axios.get('http://localhost:3002/api/posts');
  }}
  
  export default new postService();