const jwt = require('jsonwebtoken');
const db = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

exports.login = async (req, res) => {
  try {
    const { email, senha, tipoPerfil } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const usuario = await db.Usuario.scope(null).findOne({
      where: { 
        email,
        tipoPerfil
      }
    });

    if (!usuario) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const senhaValida = await usuario.validarSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        tipoPerfil: usuario.tipoPerfil
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nomeCompleto: usuario.nomeCompleto,
        tipoPerfil: usuario.tipoPerfil,
        onboardingCompleto: usuario.onboardingCompleto
      },
      tipoPerfil: usuario.tipoPerfil
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

exports.verificarToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const usuario = await db.Usuario.findByPk(decoded.id);

    if (!usuario) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    return res.json({
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nomeCompleto: usuario.nomeCompleto,
        tipoPerfil: usuario.tipoPerfil,
        onboardingCompleto: usuario.onboardingCompleto
      }
    });
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

exports.getMeuPerfil = async (req, res) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({ 
        message: 'Não autorizado: Nenhum usuário autenticado encontrado.' 
      });
    }

    const usuario = await db.Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['senha'] }
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    return res.json({
      usuario: usuario,
      tipoPerfil: usuario.tipoPerfil
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}; 