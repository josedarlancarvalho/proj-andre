const { Router } = require("express");
const gestorController = require("../controllers/gestorController");
const { authenticate } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/checkRole");
const { validateRequest } = require("../middlewares/validateRequest");
const { body } = require("express-validator");

const router = Router();

// Middleware de autenticação e verificação de papel
router.use(authenticate);
router.use(checkRole("gestor"));

// Validação para feedback
const feedbackValidation = [
  body("comentario").notEmpty().withMessage("O comentário é obrigatório"),
  body("oportunidade.tipo")
    .optional()
    .isIn(["estagio", "trainee", "junior"])
    .withMessage("Tipo de oportunidade inválido"),
  body("oportunidade.descricao")
    .optional()
    .notEmpty()
    .withMessage(
      "Descrição da oportunidade é obrigatória quando há oportunidade"
    ),
];

// Rotas para projetos
router.get("/projetos/destacados", gestorController.buscarProjetosDestacados);
router.get("/projetos/avaliados", gestorController.buscarProjetosAvaliados);
router.get(
  "/projetos/com-feedback",
  gestorController.buscarProjetosComFeedback
);
router.get(
  "/avaliacoes/encaminhadas",
  gestorController.buscarAvaliacoesEncaminhadas
);

router.post(
  "/projetos/:projetoId/feedback",
  feedbackValidation,
  validateRequest,
  gestorController.enviarFeedback
);

// Rotas para talentos
router.get("/talentos", gestorController.buscarTalentos);
router.get(
  "/talentos/:talentoId/historico",
  gestorController.buscarHistoricoInteracoes
);
router.get("/talentos/destaque", gestorController.buscarTalentosDestaque);
router.get("/talentos/area/:area", gestorController.buscarTalentosPorArea);
router.post(
  "/talentos/:talentoId/favoritar",
  gestorController.favoritarTalento
);
router.delete(
  "/talentos/:talentoId/favoritar",
  gestorController.removerFavorito
);

// Rota para entrevistas
router.get("/entrevistas", gestorController.buscarEntrevistas);

// Rota para estatísticas
router.get("/estatisticas", gestorController.buscarEstatisticas);

// Rota para explorar
router.get("/explorar", gestorController.explorarTalentos);

// Rota para favoritos
router.get("/favoritos", gestorController.buscarFavoritos);

// Rota para perfil
router.put("/perfil", gestorController.atualizarPerfil);

module.exports = router;
