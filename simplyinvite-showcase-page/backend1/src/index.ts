import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from './config/database';
import jovemRoutes from './routes/jovemRoutes';
import rhRoutes from './routes/rhRoutes';
import gestorRoutes from './routes/gestorRoutes';

// Carregar variáveis de ambiente
dotenv.config();

// Configurar Express
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/jovem', jovemRoutes);
app.use('/api/rh', rhRoutes);
app.use('/api/gestor', gestorRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'API VAMO funcionando!' });
});

// Sincronizar modelos com o banco de dados
// Force: true fará com que as tabelas sejam recriadas (use apenas em desenvolvimento)
const syncOptions = {
  force: process.env.NODE_ENV === 'development',
  alter: true // Altera as tabelas existentes para corresponder aos modelos
};

// Iniciar servidor
const startServer = async () => {
  try {
    // Testar conexão com o banco de dados
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida.');

    // Sincronizar com o banco de dados
    await sequelize.sync(syncOptions);
    console.log('Modelos sincronizados com o banco de dados.');

    // Iniciar o servidor
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
};

startServer(); 