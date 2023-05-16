import axios from 'axios';

class UserService {
  constructor() {
    this.baseURL = process.env.REACT_APP_BACKEND_ENDPOINT + '/api';
  }

  getAccessTokenHeaderFromLocalStorage() {
    // Retrieve the user object from the local storage
    const user = JSON.parse(localStorage.getItem('user'));

    // Check if the user object exists and if it has an accessToken property
    if (user && user.accessToken) {
      // If the user object has an accessToken property, return an HTTP header object
      // with a single key-value pair where the key is 'x-access-token' and the
      // value is the accessToken retrieved from the user object
      return { 'x-access-token': user.accessToken };
    } else {
      // If the user object does not exist or the accessToken property is not present,
      // return an empty HTTP header object
      return {};
    }
  }


  async adminAccess(userId) {
    const url = `${this.baseURL}/admin`;

    const headers = {
      ...this.getAccessTokenHeaderFromLocalStorage(),
      'User-Id': userId,
    };

    const response = await axios.get(url, { headers: headers });

    return response.data;
  }
  
  async sellerAccess(userId) {
    const url = `${this.baseURL}/seller`;

    const headers = {
      ...this.getAccessTokenHeaderFromLocalStorage(),
      'User-Id': userId,
    };

    const response = await axios.get(url, { headers: headers });

    return response.data;
  }

}

const userService = new UserService();
export default userService;
