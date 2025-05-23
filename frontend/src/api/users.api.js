import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:3008",
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

export const fetchAllUsers = () => API.get("/users");

export const getUsersByOption = (option) => API.get("users/option", option);

export const deleteUserById = (id) => API.delete(`/users/${id}`);

export const updateUserById = (id, data) => {
  return API.put(`/users/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const toggleUserStatus = (id) => API.patch(`/users/${id}/status`, {});

export const getUserById = (id) => API.get(`/users/${id}`);
