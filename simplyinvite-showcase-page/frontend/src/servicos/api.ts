import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  timeout: 5000, // Timeout de 5 segundos
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

// Interceptor de requisição para adicionar o token
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

// Interceptor de resposta para tratamento de erros
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Erro do servidor (status code não 2xx)
      if (error.response.status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem("token");
        window.location.href = "/";
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Erro de rede
      return Promise.reject({ message: "Erro de conexão com o servidor" });
    } else {
      // Erro na configuração da requisição
      return Promise.reject({ message: "Erro ao processar a requisição" });
    }
  }
);

export default instance;
