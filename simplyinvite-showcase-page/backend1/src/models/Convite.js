const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Convite",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      jovemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      empresaId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pendente",
      },
    },
    {
      tableName: "convites",
      timestamps: true,
    }
  );
};
