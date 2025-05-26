const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Avaliacao",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      projetoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      avaliadorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      medalha: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "avaliacoes",
      timestamps: true,
    }
  );
};
