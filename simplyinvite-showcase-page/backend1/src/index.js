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

// Função para tentar conectar ao banco de dados
const connectWithRetry = async () => {
  let retries = 5;
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log("Conexão com o banco de dados estabelecida com sucesso.");

      // Sincronizar banco de dados
      await sequelize.sync();

      // Iniciar servidor
      app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
      });

      return;
    } catch (error) {
      retries -= 1;
      console.log(`Tentativas restantes: ${retries}`);
      console.error("Erro ao conectar ao banco de dados:", error);

      if (retries === 0) {
        console.error(
          "Não foi possível conectar ao banco de dados após várias tentativas"
        );
        process.exit(1);
      }

      // Aguardar 5 segundos antes de tentar novamente
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

// Iniciar a aplicação
connectWithRetry();
