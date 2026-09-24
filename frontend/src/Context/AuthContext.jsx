import { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();


  // Retrieve stored auth tokens and user data from localStorage
  const storedTokens = localStorage.getItem("authTokens");
  const storedUser = localStorage.getItem("user");

  let [authTokens, setAuthTokens] = useState(storedTokens ? JSON.parse(storedTokens) : null);
  let [user, setUser] = useState(storedUser ? JSON.parse(storedUser) : null);
  let [loading, setLoading] = useState(false);
  let [loginError, setLoginError] = useState(null);
  let [registerError, setRegisterError] = useState(null);

 // Register new user
  const registerUser = async (e) => {
    setRegisterError(null);
    try {
      const { data } = await axiosInstance.post(`/auth/register/`, {
        username: e.username,
        email: e.email,
        password: e.password,
      });
// Store tokens and user data in state and localStorage
      setAuthTokens(data.tokens);
      setUser(data.user);
      localStorage.setItem("authTokens", JSON.stringify(data.tokens));
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
    } catch (error) {
      console.error("Registration Error:", error);
      
      if(error.response && error.response.data && error.response.data.errors){
        const errorData = error.response.data.errors;

        if (typeof errorData === 'object') {
          // Check for username or email field errors
          if (errorData.username) {
            setRegisterError(errorData.username[0]);
          } else if (errorData.email) {
            setRegisterError(errorData.email[0]);
          } else {
            setRegisterError("Registration failed. Please check your information.");
          }
        } else {
          setRegisterError("An error occurred during registration. Please try again later.");
        }
      }
    }
  };

  // Log in existing user
  const loginUser = async (e, redirectTo = "/") => {
    setLoginError(null);
    try {
      const { data } = await axiosInstance.post(`/auth/login/`, {
        username: e.username,
        password: e.password,
      });
      // Store tokens and user data in state and localStorage
      setAuthTokens(data.tokens);
      setUser(data.user);
      localStorage.setItem("authTokens", JSON.stringify(data.tokens));
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate(redirectTo);
    } catch (error) {
      console.error("Login Error:", error);
      if (error.response) {
        // The server responded with a status code outside the 2xx range
        if (error.response.data.errors.detail) {
          setLoginError(error.response.data.errors.detail);
        }
      } else if (error.request) {
        // The request was made but no response was received
        setLoginError("Unable to connect to the server. Please check your internet connection.");
      } else {
        // Something happened in setting up the request
        setLoginError("Something went wrong. Please try again.");
      }
    }
  };

// User logout function
  const logoutUser = () => {

    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    localStorage.removeItem("user");
    navigate("/login");
  };
// Function to refresh authentication tokens
  const updateToken = async () => {
    if (!authTokens?.refresh) {
      logoutUser();
      return;
    }

    try {
      const { data } = await axiosInstance.post(`/auth/token/refresh/`, {
        refresh: authTokens.refresh,
      });
// Update tokens in state and localStorage
      setAuthTokens(data);
      localStorage.setItem("authTokens", JSON.stringify(data));
    } catch (error) {
      console.error("Token Refresh Error:", error);
      logoutUser();
    }

    setLoading(false);
  };

  let contextData = {
    loginUser,
    logoutUser,
    user,
    authTokens,
    registerUser,
    loginError,
    registerError,
  };

  return <AuthContext.Provider value={contextData}>{!loading && children}</AuthContext.Provider>;
};
