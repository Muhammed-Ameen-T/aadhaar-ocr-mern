import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

/**
 * Response Interceptor
 * @description Handles various HTTP errors and network issues.
 */
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400: 
          console.error("Client Error: Invalid request format.", data);
          break;
        case 404: 
          console.error("Client Error: Resource not found.", data);
          break;
        case 500: 
          console.error("Server Error: An unexpected error occurred.", data);
          break;
        default:
          console.error(`HTTP Error: ${status}`, data);
      }
    } else if (error.request) {
      console.error("Network Error: No response received from server.");
    } else {
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;