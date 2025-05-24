import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'vamo_db',
  logging: false // Disable logging for presentation
});

// Testar a conexão e sincronizar os modelos
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    
    // Sincronizar os modelos com o banco de dados
    await sequelize.sync();
    console.log('Modelos sincronizados com o banco de dados.');
  } catch (err) {
    console.error('Não foi possível conectar ao banco de dados:', err);
    process.exit(1);
  }
};

// Inicializar o banco de dados
initDatabase();

export default sequelize; 