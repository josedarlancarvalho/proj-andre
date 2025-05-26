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

module.exports = models;
