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
      tipoPerfil: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Campos do onboarding
      experiences: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      portfolioLinks: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      educationalBackground: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      institutionName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      studyDetails: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      talentSource: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      humanizedCategory: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      customCategory: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      recognitionBadge: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      onboardingCompleto: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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

  // Adiciona o método de instância para validar senha
  Usuario.prototype.validarSenha = async function (senha) {
    if (!this.senha) {
      throw new Error("Senha do usuário não está definida.");
    }
    return bcrypt.compare(senha, this.senha);
  };

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
