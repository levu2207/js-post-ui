import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://js-post-api.herokuapp.com/api',
  header: {
    'content-Type': 'application/json',
  },
});

// axiosClient.get()

export default axiosClient;
