import axios from "axios";

const instance = axios.create({
  baseURL: "/api",
  timeout: 5000, // Timeout de 5 segundos
  headers: {
    // ... existing code ...
  },
});

// Adiciona um interceptor de requisição
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
