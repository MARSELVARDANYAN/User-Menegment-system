import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:3002",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const loginUser = (data) => API.post("/auth/login", data);

export const registerUser = (token, data) =>
  API.post(`/auth/register?token=${token}`, data);

export const forgotPassword = (data) => API.post("/auth/forgot-password", data);

export const forgotPasswordReset = async (token, data) =>
  API.post(`/auth/forgot-password-reset?token=${token}`, data);
