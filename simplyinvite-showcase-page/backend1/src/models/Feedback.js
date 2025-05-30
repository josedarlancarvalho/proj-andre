const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Feedback",
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
      gestorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
<<<<<<< HEAD
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
=======
      comentario: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      oportunidade: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Detalhes da oportunidade oferecida (se houver)",
      },
      contatoRealizado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Indica se o gestor já entrou em contato com o jovem",
      },
      dataFeedback: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
>>>>>>> origin/producao1
      },
    },
    {
      tableName: "feedbacks",
      timestamps: true,
    }
  );
};
