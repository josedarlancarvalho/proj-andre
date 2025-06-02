module.exports = (sequelize, DataTypes) => {
  const Notificacao = sequelize.define(
    "Notificacao",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
      },
      tipo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      conteudo: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      lida: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      dados: {
        type: DataTypes.JSON,
        allowNull: true,
      },
    },
    {
      tableName: "notificacoes",
      timestamps: true,
    }
  );

  Notificacao.associate = (models) => {
    // Uma notificação pertence a um usuário
    Notificacao.belongsTo(models.Usuario, {
      foreignKey: "usuarioId",
      as: "usuario",
    });
  };

  return Notificacao;
};
