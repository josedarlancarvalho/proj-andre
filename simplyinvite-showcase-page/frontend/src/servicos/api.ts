import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 10000, // Timeout aumentado para 10 segundos
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Debug log para todas as requisições
instance.interceptors.request.use(
  (config) => {
    // Guarda a URL original para logging
    const originalUrl = config.url;

    console.log(
      `API Request: ${config.method?.toUpperCase()} ${config.url}`,
      config.data
    );

    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Verifica se a URL já começa com /api para evitar duplicação
    if (config.url?.startsWith("/api/")) {
      console.log(`URL já começa com /api: ${config.url}`);
      return config;
    }

    // Adiciona prefixo /api para todas as rotas da API
    if (
      config.url?.startsWith("/jovem/") ||
      config.url?.startsWith("/rh/") ||
      config.url?.startsWith("/gestor/") ||
      config.url?.startsWith("/auth/") ||
      config.url?.startsWith("jovem/") ||
      config.url?.startsWith("rh/") ||
      config.url?.startsWith("gestor/") ||
      config.url?.startsWith("auth/") ||
      config.url?.startsWith("/entrevistas") ||
      config.url?.startsWith("entrevistas") ||
      config.url?.startsWith("/talentos") ||
      config.url?.startsWith("talentos")
    ) {
      // Remove a barra inicial se existir e adiciona /api/
      const urlPath = config.url.startsWith("/")
        ? config.url.substring(1)
        : config.url;

      config.url = `/api/${urlPath}`;
      console.log(`URL normalizada: ${originalUrl} -> ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Debug log para todas as respostas
instance.interceptors.response.use(
  (response) => {
    console.log(
      `API Response: ${response.status} - ${response.config.url}`,
      response.data
    );
    return response;
  },
  (error) => {
    console.error("API Response Error:", error);

    if (error.response) {
      console.error(
        `API Error Status: ${error.response.status}`,
        error.response.data
      );

      // Erro do servidor (status code não 2xx)
      if (error.response.status === 401) {
        // Token inválido ou expirado
        localStorage.removeItem("token");
        window.location.href = "/";
      }
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // Erro de rede
      console.error("API Network Error", error.request);
      return Promise.reject({ message: "Erro de conexão com o servidor" });
    } else {
      // Erro na configuração da requisição
      console.error("API Config Error", error.message);
      return Promise.reject({ message: "Erro ao processar a requisição" });
    }
  }
);

export default instance;
