const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const { validateRequest } = require("../middlewares/validateRequest");
const respostasController = require("../controllers/respostasController");

// Middleware de validação para respostas de e-mail
const respostaValidation = [
  body("tipo").isIn(["feedback", "entrevista"]).withMessage("Tipo inválido"),
  body("entidadeId").isNumeric().withMessage("ID da entidade inválido"),
  body("usuarioId").isNumeric().withMessage("ID do usuário inválido"),
  body("resposta").notEmpty().withMessage("Resposta é obrigatória"),
];

// Rota para processar respostas de e-mail via API
router.post(
  "/processar/:entidadeId/:usuarioId",
  respostaValidation,
  validateRequest,
  respostasController.processarRespostaEmail
);

// Rotas para formulários de resposta de e-mail
router.post("/feedback/:token", respostasController.processarRespostaFeedback);

router.post(
  "/entrevista/:token",
  respostasController.processarRespostaEntrevista
);

module.exports = router;
