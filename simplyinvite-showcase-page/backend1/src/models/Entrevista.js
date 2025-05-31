module.exports = (sequelize, DataTypes) => {
  const Entrevista = sequelize.define(
    "Entrevista",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      gestorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Usuarios",
          key: "id",
        },
      },
      talentoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Usuarios",
          key: "id",
        },
      },
      candidato: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      hora: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipo: {
        type: DataTypes.ENUM("online", "presencial"),
        allowNull: false,
      },
      detalhes: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM("agendada", "realizada", "cancelada"),
        defaultValue: "agendada",
      },
      observacoes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "entrevistas",
      timestamps: true,
    }
  );

  Entrevista.associate = (models) => {
    // Uma entrevista pertence a um gestor
    Entrevista.belongsTo(models.Usuario, {
      foreignKey: "gestorId",
      as: "gestor",
    });

    // Uma entrevista pertence a um talento (jovem)
    Entrevista.belongsTo(models.Usuario, {
      foreignKey: "talentoId",
      as: "talento",
    });
  };

  return Entrevista;
};
