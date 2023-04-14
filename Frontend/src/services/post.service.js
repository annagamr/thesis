import axios from 'axios';

class postService {
    getAllPosts() {
        return axios.get('http://localhost:3002/api/posts');
    }
    getSkincare() {
        return axios.get('http://localhost:3002/api/countSkinCarePosts');
    }
    getMakeUp() {
        return axios.get('http://localhost:3002/api/countMakeUpPosts');
    }
    getHealth() {
        return axios.get('http://localhost:3002/api/countHealthPosts');
    }
    getRec() {
        return axios.get('http://localhost:3002/api/countRecommendationPosts');
    }
    getHair() {
        return axios.get('http://localhost:3002/api/countHairPosts');
    }
    getSun() {
        return axios.get('http://localhost:3002/api/countSunPosts');
    }
    getPerfumes() {
        return axios.get('http://localhost:3002/api/countPerfPosts');
    }
}

export default new postService();