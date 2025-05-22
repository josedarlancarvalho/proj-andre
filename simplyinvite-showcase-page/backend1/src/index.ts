import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models';
import routes from './routes';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors()); // Habilitar CORS para todas as origens
app.use(express.json()); // Parser para JSON
app.use(express.urlencoded({ extended: true })); // Parser para URL encoded

// Rotas da API
app.use('/api', routes);

// Sincronizar modelos com o banco de dados
// Force: true fará com que as tabelas sejam recriadas (use apenas em desenvolvimento)
const syncOptions = {
  force: process.env.NODE_ENV === 'development',
  alter: true // Altera as tabelas existentes para corresponder aos modelos
};

// Iniciar servidor
const startServer = async () => {
  try {
    // Sincronizar com o banco de dados
    await sequelize.sync(syncOptions);
    console.log('Banco de dados sincronizado');

    // Iniciar o servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
  }
};

startServer(); 