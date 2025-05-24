require('dotenv').config();

module.exports = {
  development: {
    username: 'postgres',
    password: '321',
    database: 'simplyinvite',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    logging: false,
  },
  test: {
    username: 'postgres',
    password: '321',
    database: 'simplyinvite_test',
    host: '127.0.0.1',
    port: 5432,
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false,
  },
}; 