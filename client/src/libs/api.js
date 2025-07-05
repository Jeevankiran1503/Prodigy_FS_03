import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// You can also add an interceptor to include the auth token in requests


export default api;
