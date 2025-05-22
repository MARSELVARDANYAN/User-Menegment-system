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
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const uploadPhoto = async (photo) => {
  const formData = new FormData();
  formData.append("photo", photo);

  try {
    const response = await API.post("/photo", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};

export const getPhotoById = async (id) => {
  try {
    const response = await API.get(`/photo/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching photo:", error);
    throw error;
  }
};
export const deletePhotoById = async (id) => {
  try {
    const response = await API.delete(`/photo/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting photo:", error);
    throw error;
  }
};
export const updatePhotoById = async (id, photo) => {
  const formData = new FormData();
  formData.append("photo", photo);

  try {
    const response = await API.put(`/photo/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating photo:", error);
    throw error;
  }
};
