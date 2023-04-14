import axios from 'axios';

class postService {
    getAllPosts() {
        return axios.get('http://localhost:3002/api/posts');
    }
    getSkincare() {
        return axios.get('http://localhost:3002/api/countPostsByTopic/skinCare');
    }
    getMakeUp() {
        return axios.get('http://localhost:3002/api/countPostsByTopic/makeUp');
    }
    getHealth() {
        return axios.get('http://localhost:3002/api/countPostsByTopic/healthNbeauty');
    }
    getRec() {
        return axios.get('http://localhost:3002/api/countPostsByTopic/productRecommendation');
    }
    getHair() {
        return axios.get('http://localhost:3002/api/countPostsByTopic/hair');
    }
    getSun() {
        return axios.get('http://localhost:3002/api/countPostsByTopic/tanning');
    }
    getPerfumes() {
        return axios.get('http://localhost:3002/api/countPostsByTopic/perfumes');
    }
}

export default new postService();