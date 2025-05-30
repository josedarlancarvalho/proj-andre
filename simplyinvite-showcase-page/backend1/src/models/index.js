const sequelize = require("../config/database");
const UsuarioModel = require("./Usuario");
const ProjetoModel = require("./Projeto");
const AvaliacaoModel = require("./Avaliacao");
const FeedbackModel = require("./Feedback");
const EmpresaModel = require("./Empresa");
const ConviteModel = require("./Convite");

const models = {
  Usuario: UsuarioModel(sequelize),
  Projeto: ProjetoModel(sequelize),
  Avaliacao: AvaliacaoModel(sequelize),
  Feedback: FeedbackModel(sequelize),
  Empresa: EmpresaModel(sequelize),
  Convite: ConviteModel(sequelize),
};

<<<<<<< HEAD
=======
// Definir relações entre modelos
models.Usuario.hasMany(models.Projeto, {
  foreignKey: "usuarioId",
  as: "projetos",
});

models.Projeto.belongsTo(models.Usuario, {
  foreignKey: "usuarioId",
  as: "usuario",
});

models.Projeto.hasMany(models.Avaliacao, {
  foreignKey: "projetoId",
  as: "avaliacoes",
});

models.Avaliacao.belongsTo(models.Projeto, {
  foreignKey: "projetoId",
  as: "projeto",
});

models.Avaliacao.belongsTo(models.Usuario, {
  foreignKey: "avaliadorId",
  as: "avaliador",
});

models.Projeto.hasMany(models.Feedback, {
  foreignKey: "projetoId",
  as: "feedbacks",
});

models.Feedback.belongsTo(models.Projeto, {
  foreignKey: "projetoId",
  as: "projeto",
});

models.Feedback.belongsTo(models.Usuario, {
  foreignKey: "gestorId",
  as: "gestor",
});

>>>>>>> origin/producao1
module.exports = models;
