const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
<<<<<<< HEAD
  return sequelize.define(
=======
  const Projeto = sequelize.define(
>>>>>>> origin/producao1
    "Projeto",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descricao: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "pendente",
<<<<<<< HEAD
=======
        comment: "Valores possíveis: pendente, avaliado, destacado, arquivado",
      },
      videoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "URL do vídeo de apresentação do projeto",
      },
      tecnologias: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: "Lista de tecnologias usadas no projeto",
        get() {
          const value = this.getDataValue("tecnologias");
          if (!value) return [];
          if (Array.isArray(value)) return value;
          try {
            return JSON.parse(value);
          } catch (e) {
            return [value];
          }
        },
        set(value) {
          if (!value) {
            this.setDataValue("tecnologias", []);
          } else if (Array.isArray(value)) {
            this.setDataValue("tecnologias", value);
          } else if (typeof value === "string") {
            try {
              this.setDataValue("tecnologias", JSON.parse(value));
            } catch (e) {
              this.setDataValue("tecnologias", [value]);
            }
          } else {
            this.setDataValue("tecnologias", [value]);
          }
        },
      },
      linkRepositorio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      linkDeploy: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      arquivoUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "URL do arquivo do projeto (se houver)",
>>>>>>> origin/producao1
      },
    },
    {
      tableName: "projetos",
      timestamps: true,
    }
  );
<<<<<<< HEAD
=======

  return Projeto;
>>>>>>> origin/producao1
};
