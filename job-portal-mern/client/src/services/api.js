import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

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

