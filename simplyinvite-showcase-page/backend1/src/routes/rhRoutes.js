const { Router } = require("express");
const rhController = require("../controllers/rhController");
const { authenticate } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/checkRole");
const { validateRequest } = require("../middlewares/validateRequest");
const { body } = require("express-validator");

const router = Router();

// Middleware de autenticação e verificação de papel
router.use(authenticate);
router.use(checkRole("rh"));

// Validação para avaliação
const avaliacaoValidation = [
  body("nota")
    .isInt({ min: 0, max: 10 })
    .withMessage("Nota deve ser entre 0 e 10"),
  body("comentario").notEmpty().withMessage("O comentário é obrigatório"),
  body("medalha")
    .optional()
    .isIn(["ouro", "prata", "bronze"])
    .withMessage("Medalha inválida"),
];

// Rotas para projetos
router.get("/projetos/todos", rhController.buscarTodosProjetos);
router.get("/projetos/filtrados", rhController.buscarProjetosFiltrados);
router.get("/projetos/pendentes", rhController.buscarProjetosPendentes);
router.get("/projetos/:id", rhController.buscarProjeto);
router.delete("/projetos/:projetoId", rhController.excluirProjeto);

// Rotas para avaliações
router.get("/avaliacoes/historico", rhController.buscarHistoricoAvaliacoes);
router.post(
  "/avaliacoes/projeto/:projetoId",
  avaliacaoValidation,
  validateRequest,
  rhController.avaliarProjeto
);
router.post(
  "/avaliacoes/:avaliacaoId/encaminhar",
  rhController.encaminharParaGestor
);

// Rota para perfil
router.get("/perfil", rhController.buscarPerfil);
router.put("/perfil", rhController.atualizarPerfil);

// Rota para estatísticas
router.get("/estatisticas", rhController.buscarEstatisticas);

// Nova rota para feedback do usuário
router.post("/feedback/projeto/:projetoId", rhController.salvarFeedbackUsuario);

module.exports = router;
