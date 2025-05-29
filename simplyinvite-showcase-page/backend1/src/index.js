const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/database");
const jovemRoutes = require("./routes/jovemRoutes");
const rhRoutes = require("./routes/rhRoutes");
const gestorRoutes = require("./routes/gestorRoutes");
const authRoutes = require("./routes/authRoutes");
const models = require("./models");

// Carregar variáveis de ambiente
dotenv.config();

// Configurar Express
const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/api/jovem", jovemRoutes);
app.use("/api/rh", rhRoutes);
app.use("/api/gestor", gestorRoutes);
app.use("/api/auth", authRoutes);

// Rota simples para teste
app.get("/", (req, res) => {
  res.json({ message: "Bem-vindo ao servidor!" });
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
