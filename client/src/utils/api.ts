import axios from 'axios';

// Create an axios instance with default settings
const api = axios.create({
  baseURL: 'http://localhost:8080', // Replace with your backend server URL
  withCredentials: true, // Ensures cookies (like JWT) are sent with requests
});

export default api;
