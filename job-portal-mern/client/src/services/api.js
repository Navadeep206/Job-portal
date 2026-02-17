import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5005/api", // Hardcoded for debugging
});

console.log("API Service Initialized");
console.log("Target Base URL:", "http://localhost:5005/api");

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

