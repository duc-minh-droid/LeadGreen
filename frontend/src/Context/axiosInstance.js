import axios from "axios";
import { BACKEND_URL, DEMO_MODE } from "../config";
import { demoAdapter } from "../demo/demoApi";
import { jwtDecode } from "jwt-decode";
import dayjs from "dayjs";

const baseURL = BACKEND_URL+"/api/";

// In demo mode every request (including plain `axios` calls elsewhere) is served
// by the in-browser demo API instead of the network.
if (DEMO_MODE) axios.defaults.adapter = demoAdapter;

let authTokens = localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null;
// Retrieve stored authentication tokens from localStorage
// Create an Axios instance with a base URL and initial authorization header
const axiosInstance = axios.create({
  baseURL,
  ...(DEMO_MODE && { adapter: demoAdapter }),
  headers: {
    Authorization: authTokens ? `Bearer ${authTokens.access}` : "",
  },
});

// Add an interceptor to handle token expiration and refresh automatically
axiosInstance.interceptors.request.use(async (req) => {
  // Re-fetch auth tokens from localStorage before every request
  authTokens = localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null;
// If no tokens are available, proceed without modifying the request
  if (!authTokens) return req;

  // Decode JWT token to check expiration
  const user = jwtDecode(authTokens.access);
  const isExpired = dayjs.unix(user.exp).isBefore(dayjs());

  if (!isExpired) {
    // Token is still valid, attach it to the request
    req.headers.Authorization = `Bearer ${authTokens.access}`;
    return req;
  }

  // Token is expired, attempt to refresh it
  try {
    const response = await axios.post(`${baseURL}auth/token/refresh/`, {
      refresh: authTokens.refresh,
    });

    localStorage.setItem("authTokens", JSON.stringify(response.data));
    // Attach the new access token to the request heade
    req.headers.Authorization = `Bearer ${response.data.access}`;
  } catch (error) {
    console.error("Token Refresh Failed:", error);
    // If refresh fails, remove tokens from localStorage to force logout
    localStorage.removeItem("authTokens");
    localStorage.removeItem("user");
    
  }
  return req;
});

export default axiosInstance;
