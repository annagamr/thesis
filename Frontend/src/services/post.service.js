import axios from 'axios';

class postService {
    getAllPosts() {
        return axios.get('http://localhost:3002/api/posts');
    }
    getSkincare() {
        return axios.get('http://localhost:3002/api/countPostsByTopic/Skincare');
    }
    getMakeUp() {
        return axios.get('http://localhost:3002/api/countPostsByTopic/Make-up');
    }
    getHealth() {
        return axios.get('http://localhost:3002/api/countPostsByTopic/Health');
    }
    getRec() {
        return axios.get('http://localhost:3002/api/countPostsByTopic/Recommendation');
    }
    getHair() {
        return axios.get('http://localhost:3002/api/countPostsByTopic/Hair');
    }
    getSun() {
        return axios.get('http://localhost:3002/api/countPostsByTopic/Sun');
    }
    getPerfumes() {
        return axios.get('http://localhost:3002/api/countPostsByTopic/Perfumes');
    }
}

export default new postService();