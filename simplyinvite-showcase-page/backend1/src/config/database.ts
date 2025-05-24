import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'vamo',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASS || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
    define: {
      timestamps: true,
      underscored: true,
    },
  }
);

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