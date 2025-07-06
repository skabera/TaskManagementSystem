// src/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7299/", // Base URL for your backend API
  timeout: 5000, // Optional: Set a timeout for requests
});

export default axiosInstance;
