const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

const checkProfileType = (allowedProfiles) => {
  return (req, res, next) => {
    try {
      const userProfile = req.usuario?.tipoPerfil;
      if (!userProfile || !allowedProfiles.includes(userProfile)) {
        return res.status(403).json({
          message: "Acesso negado: perfil não autorizado para esta operação",
        });
      }
      next();
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Erro ao verificar perfil do usuário" });
    }
  };
};

module.exports = { authenticate, checkProfileType };
