import { Router } from "express";
import authRoutes from "./authRoutes";
import usuarioRoutes from "./usuarioRoutes";
import empresaRoutes from "./empresaRoutes";
import rhRoutes from "./rhRoutes";
import gestorRoutes from "./gestorRoutes";
import jovemRoutes from "./jovemRoutes";
import entrevistasController from "../controllers/entrevistasController";
import { authenticate } from "../middlewares/auth";

const router = Router();

// Prefixos das rotas
router.use("/auth", authRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/empresas", empresaRoutes);
router.use("/rh", rhRoutes);
router.use("/gestor", gestorRoutes);
router.use("/jovem", jovemRoutes);

// Nova rota para agendamento de entrevistas
router.post(
  "/entrevistas/agendar",
  authenticate,
  entrevistasController.agendarEntrevista
);
router.get(
  "/entrevistas",
  authenticate,
  entrevistasController.listarEntrevistas
);
router.put(
  "/entrevistas/:entrevistaId/cancelar",
  authenticate,
  entrevistasController.cancelarEntrevista
);
router.put(
  "/entrevistas/:entrevistaId",
  authenticate,
  entrevistasController.atualizarEntrevista
);

// Rota para verificar se a API está funcionando
router.get("/health", (req, res) => {
  res.json({ status: "API Operational", timestamp: new Date() });
});

export default router;
