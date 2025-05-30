const { Router } = require("express");
const jovemController = require("../controllers/jovemController");
const { authenticate } = require("../middlewares/auth");
const { checkRole } = require("../middlewares/checkRole");
const { validateRequest } = require("../middlewares/validateRequest");
const { body } = require("express-validator");
// Comentando temporariamente para permitir que o aplicativo inicie
// const multer = require("multer");
// const path = require("path");

const router = Router();

// Middleware de autenticação e verificação de papel
router.use(authenticate);
router.use(checkRole("jovem"));

/*
// Configuração do Multer para upload de vídeos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/videos"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "video-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limite
  fileFilter: (req, file, cb) => {
    const filetypes = /mp4|webm|mov|avi/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Apenas arquivos de vídeo são permitidos"));
  },
});
*/

// Validações
const projetoValidation = [
  body("titulo").notEmpty().withMessage("O título é obrigatório"),
  body("descricao").notEmpty().withMessage("A descrição é obrigatória"),
  body("tecnologias").isArray().withMessage("Tecnologias deve ser um array"),
  body("linkRepositorio")
    .optional()
    .isURL()
    .withMessage("Link do repositório inválido"),
  body("linkYoutube")
    .optional()
    .matches(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)
    .withMessage("Link do YouTube inválido"),
  body("linkDeploy").optional().isURL().withMessage("Link do deploy inválido"),
];

const perfilValidation = [
  body("nomeCompleto")
    .optional()
    .notEmpty()
    .withMessage("Nome completo não pode ser vazio"),
  body("email").optional().isEmail().withMessage("Email inválido"),
  body("linkedin")
    .optional()
    .isURL()
    .withMessage("LinkedIn deve ser uma URL válida"),
  body("github")
    .optional()
    .isURL()
    .withMessage("GitHub deve ser uma URL válida"),
];

// Rotas para projetos
router.get("/projetos", jovemController.buscarMeusProjetos);
router.get("/projetos/meus", jovemController.buscarMeusProjetos);
router.get("/projetos/:projetoId", jovemController.buscarProjeto);
router.get(
  "/projetos/:projetoId/feedback",
  jovemController.buscarFeedbackProjeto
);
router.post(
  "/projetos",
  projetoValidation,
  validateRequest,
  jovemController.criarProjeto
);

/* Comentando temporariamente
router.post(
  "/projetos/:projetoId/video",
  upload.single("video"),
  jovemController.uploadVideo
);
*/

router.put(
  "/projetos/:projetoId",
  projetoValidation,
  validateRequest,
  jovemController.atualizarProjeto
);
router.delete("/projetos/:id", jovemController.excluirProjeto);

// Rotas para feedbacks
router.get("/feedbacks", jovemController.buscarFeedbacks);

// Rotas para convites
router.get("/convites", jovemController.buscarConvites);
router.post("/convites/:id/aceitar", jovemController.aceitarConvite);
router.post("/convites/:id/recusar", jovemController.recusarConvite);

// Rotas para perfil
router.get("/perfil", jovemController.buscarPerfil);
router.put(
  "/perfil",
  perfilValidation,
  validateRequest,
  jovemController.atualizarPerfil
);

// Rota para estatísticas
router.get("/estatisticas", jovemController.buscarEstatisticas);

// Rota para evolução
router.get("/evolucao", jovemController.buscarEvolucao);

// Rota para onboarding
router.post(
  "/onboarding",
  perfilValidation,
  validateRequest,
  jovemController.completarOnboarding
);

module.exports = router;
