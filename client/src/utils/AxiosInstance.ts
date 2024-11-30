import axios from 'axios';

// Create an Axios instance with base configuration
  const AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Response Interceptor
  AxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Check if it's a 401 error and we haven't already tried to retry
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // Retry the original request
          return await AxiosInstance(originalRequest);
        } catch (retryError) {
          if (axios.isAxiosError(retryError) && retryError.response?.status === 401) {
            // If retry fails with 401, redirect to login
            console.error('Authentication failed after retry');
            window.alert('Please login first.');
            window.location.href = '/login';
          } else {
            // If retry fails with other error, just show the error
            console.error('Request failed after retry:', retryError);
          }
          return Promise.reject(retryError);
        }
      }

      // For all other errors
      return Promise.reject(error);
    }
  );

  export default AxiosInstance;