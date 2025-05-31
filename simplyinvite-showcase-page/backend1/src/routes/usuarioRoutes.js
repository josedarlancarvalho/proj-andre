const { Router } = require("express");
const usuarioController = require("../controllers/usuarioController");
const { authenticate } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/checkRole");
const { validateRequest } = require("../middlewares/validateRequest");
const { body } = require("express-validator");

const router = Router();

// Rotas públicas
router.post("/", usuarioController.create); // Cadastro de usuários

// Rotas protegidas
router.get("/", authenticate, usuarioController.getAll);
router.get("/:id", authenticate, usuarioController.getById);
router.put("/:id", authenticate, usuarioController.update);
router.delete(
  "/:id",
  authenticate,
  checkRole(["rh"]),
  usuarioController.remove
); // Somente RH pode excluir usuários

// Rota para perfil de usuário (com dados específicos de acordo com o tipo de perfil)
router.get("/:id/perfil", authenticate, usuarioController.getPerfilUsuario);

// Rota para onboarding de usuário
router.put(
  "/me/onboarding",
  authenticate,
  usuarioController.completarOnboarding
);

module.exports = router;
