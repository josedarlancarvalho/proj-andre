const { Router } = require("express");
const authController = require("../controllers/authController");
const usuarioController = require("../controllers/usuarioController");
const { authenticate } = require("../middlewares/auth");
const { validateRequest } = require("../middlewares/validateRequest");
const { body } = require("express-validator");

const router = Router();

// Validação para login
const loginValidation = [
  body("email").isEmail().withMessage("Email inválido"),
  body("senha").notEmpty().withMessage("Senha é obrigatória"),
  body("tipoPerfil")
    .isIn(["jovem", "rh", "gestor"])
    .withMessage("Tipo de perfil inválido"),
];

// Rotas públicas
router.post("/login", loginValidation, validateRequest, authController.login);
router.get("/verificar-token", authController.verificarToken);

// Rota pública para registro
router.post("/register", usuarioController.create);

// Rota protegida para obter os dados do usuário autenticado
router.get("/me", authenticate, authController.getMeuPerfil);

module.exports = router;
