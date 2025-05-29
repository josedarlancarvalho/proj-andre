const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "simplyinvite",
  process.env.DB_USER || "postgres",
  process.env.DB_PASS || "jonas1385",
  {
    host: process.env.DB_HOST || "postgres",
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    logging: false,
    retry: {
      max: 10,
      timeout: 3000,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;
