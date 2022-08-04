import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  header: {
    'content-Type': 'application/json',
  },
});

// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    console.log('request interceptor', config);

    //Attach token to request if exits
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    return response.data; // only recevie data
  },
  function (error) {
    // console.log('axiosClient - response error', error.response);
    if (!error.response) throw new error('Network error. Please try again later.');

    if (error.response.status === 401) {
      // clear token, logout
      // ...
      window.location.assign('/login.html');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
