const checkRole = (role) => {
  return (req, res, next) => {
    const usuario = req.usuario;
    if (!usuario || usuario.tipoPerfil !== role) {
      return res.status(403).json({ message: 'Acesso não autorizado' });
    }
    next();
  };
};

module.exports = { checkRole }; 