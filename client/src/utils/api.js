import axios from 'axios';

// Create an axios instance with a base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to handle errors
api.interceptors.response.use(
  response => response,
  error => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with a status code outside the 2xx range
      const { status } = error.response;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 