import axios from 'axios';

class PostService {
    getAllPosts() {
        return axios.get(process.env.REACT_APP_BACKEND_ENDPOINT + '/api/posts');
    }
    getSkincare() {
        return axios.get(process.env.REACT_APP_BACKEND_ENDPOINT + '/api/countPostsByTopic/Skincare');
    }
    getMakeUp() {
        return axios.get(process.env.REACT_APP_BACKEND_ENDPOINT + '/api/countPostsByTopic/Make-up');
    }
    getHealth() {
        return axios.get(process.env.REACT_APP_BACKEND_ENDPOINT + '/api/countPostsByTopic/Health');
    }
    getRec() {
        return axios.get(process.env.REACT_APP_BACKEND_ENDPOINT + '/api/countPostsByTopic/Recommendation');
    }
    getHair() {
        return axios.get(process.env.REACT_APP_BACKEND_ENDPOINT + '/api/countPostsByTopic/Hair');
    }
    getSun() {
        return axios.get(process.env.REACT_APP_BACKEND_ENDPOINT + '/api/countPostsByTopic/Sun');
    }
    getPerfumes() {
        return axios.get(process.env.REACT_APP_BACKEND_ENDPOINT + '/api/countPostsByTopic/Perfumes');
    }
}

const postService = new PostService();
export default postService;
