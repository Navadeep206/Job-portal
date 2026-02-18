import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5005/api";

const API = axios.create({
  baseURL,
});

console.log("API Service Initialized");
console.log("Target Base URL:", baseURL);

/* Attach Token */
API.interceptors.request.use((req) => {

  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.token) {
      req.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (e) {
    console.error("Error parsing user from localStorage:", e);
    localStorage.removeItem("user");
  }

  return req;
});

export default API;

