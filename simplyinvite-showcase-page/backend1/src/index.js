const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const sequelize = require("./config/database");
const jovemRoutes = require("./routes/jovemRoutes");
const rhRoutes = require("./routes/rhRoutes");
const gestorRoutes = require("./routes/gestorRoutes");
const authRoutes = require("./routes/authRoutes");
const respostasRoutes = require("./routes/respostasRoutes");
const models = require("./models");
const bodyParser = require("body-parser");

// Carregar variáveis de ambiente
dotenv.config();

// Configurar Express
const app = express();
const port = process.env.PORT || 3001;

// Configurar o mecanismo de visualização EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(cors());

// Aumentar o limite do tamanho do payload JSON
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // Log adicional para POST em /jovem/projetos
  if (
    req.method === "POST" &&
    (req.url === "/api/jovem/projetos" ||
      req.url === "/jovem/projetos" ||
      req.url === "/api/api/jovem/projetos")
  ) {
    console.log("CRIAÇÃO DE PROJETO DETECTADA:");
    console.log("Corpo da requisição:", JSON.stringify(req.body));
  }

  next();
});

// Normalizar URLs com múltiplos prefixos /api
app.use((req, res, next) => {
  if (req.url.startsWith("/api/api/")) {
    console.log(`Normalizando URL duplicada: ${req.url}`);
    req.url = req.url.replace("/api/api/", "/api/");
    console.log(`URL normalizada para: ${req.url}`);
  }
  next();
});

// Rotas
app.use("/api/jovem", jovemRoutes);
app.use("/api/rh", rhRoutes);
app.use("/api/gestor", gestorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/respostas", respostasRoutes);

// Rotas sem o prefixo /api para lidar com requisições do frontend
app.use("/jovem", jovemRoutes);
app.use("/rh", rhRoutes);
app.use("/gestor", gestorRoutes);
app.use("/auth", authRoutes);
app.use("/respostas", respostasRoutes);

// Rota simples para teste
app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo ao servidor!" });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error("Erro não tratado:", err);
  res.status(500).json({
    message: "Erro interno do servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Sincronizar o modelo com o banco de dados
// Isso criará as colunas que faltam na tabela usuarios
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Banco de dados sincronizado");
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  })
  .catch((err) => {
    console.error("Erro ao sincronizar banco de dados:", err);
  });
