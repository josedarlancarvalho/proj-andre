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
      nota: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
          max: 10,
        },
      },
      comentario: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      medalha: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Valores possíveis: ouro, prata, bronze",
      },
      encaminhadoParaGestor: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      dataAvaliacao: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "avaliacoes",
      timestamps: true,
    }
  );
};
