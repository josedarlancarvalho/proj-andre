const { Router } = require("express");
const empresaController = require("../controllers/empresaController");
const { authenticate } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/checkRole");
const { validateRequest } = require("../middlewares/validateRequest");
const { body } = require("express-validator");

const router = Router();

// Lista todas as empresas - acessível para todos os usuários autenticados
router.get("/", authenticate, empresaController.getAll);

// Obtém empresa por ID - acessível para todos os usuários autenticados
router.get("/:id", authenticate, empresaController.getById);

// Cria uma nova empresa - apenas usuários HR ou manager
router.post(
  "/",
  authenticate,
  checkRole(["rh", "gestor"]),
  empresaController.create
);

// Atualiza uma empresa - apenas usuários HR ou manager
router.put(
  "/:id",
  authenticate,
  checkRole(["rh", "gestor"]),
  empresaController.update
);

// Remove uma empresa - apenas usuários HR
router.delete(
  "/:id",
  authenticate,
  checkRole(["rh"]),
  empresaController.remove
);

module.exports = router;
