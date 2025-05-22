import axios from "axios";

const API = axios.create({
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
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const adminCreateUser = (data) => API.post("/admin/create-user", data);

export const getAdminById = (id) => API.get(`/admin/${id}`);

export const updateAdminProfile = (id, data) => {
  return API.put(`/admin/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const deleteAdminAvatar = (id) => API.delete(`/admin/${id}/avatar`);
