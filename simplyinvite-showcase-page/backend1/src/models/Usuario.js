const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      nomeCompleto: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      senha: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "usuarios",
      timestamps: true,
      hooks: {
        beforeCreate: async (usuario) => {
          if (usuario.senha) {
            usuario.senha = await bcrypt.hash(usuario.senha, 10);
          }
        },
        beforeUpdate: async (usuario) => {
          if (usuario.changed("senha") && usuario.senha) {
            usuario.senha = await bcrypt.hash(usuario.senha, 10);
          }
        },
      },
      defaultScope: {
        attributes: { exclude: ["senha"] },
      },
    }
  );

  // Método de associação
  // Usuario.associate = (models: any) => {
  //   Usuario.belongsTo(models.Empresa, {
  //     foreignKey: "empresaId",
  //     as: "empresa",
  //   });
  //   Usuario.hasMany(models.Projeto, {
  //     foreignKey: "usuarioId",
  //     as: "projetos",
  //   });
  //   Usuario.hasMany(models.Avaliacao, {
  //     foreignKey: "avaliadorId",
  //     as: "avaliacoes",
  //   });
  //   Usuario.hasMany(models.Feedback, {
  //     foreignKey: "gestorId",
  //     as: "feedbacks",
  //   });
  //   Usuario.hasMany(models.Convite, { foreignKey: "jovemId", as: "convites" });
  // };

  return Usuario;
};
