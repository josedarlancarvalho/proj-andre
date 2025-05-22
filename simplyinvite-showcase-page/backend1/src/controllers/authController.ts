import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Usuario } from '../models';
import { generateToken } from '../utils/jwt';

interface LoginRequest {
  email: string;
  senha: string;
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body as LoginRequest;

    // Verificar se o email foi fornecido
    if (!email) {
      return res.status(400).json({ message: 'Email é obrigatório' });
    }

    // Buscar usuário pelo email
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Verificar senha
    const senhaValida = await usuario.validarSenha(senha);
    if (!senhaValida) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = generateToken({
      id: usuario.id,
      email: usuario.email,
      tipoPerfil: usuario.tipoPerfil
    });

    // Criar objeto de resposta (similar ao backend original)
    const usuarioResponse = {
      id: usuario.id,
      email: usuario.email,
      nomeCompleto: usuario.nomeCompleto,
      tipoPerfil: usuario.tipoPerfil,
      avatarUrl: usuario.avatarUrl,
      onboardingComplete: usuario.onboardingComplete
    };

    // Enviar resposta
    return res.json({
      token,
      tipoPerfil: usuario.tipoPerfil,
      usuario: usuarioResponse
    });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getMeuPerfil = async (req: Request, res: Response) => {
  try {
    // O middleware de autenticação já coloca o usuário atual em req.currentUser
    if (!req.currentUser) {
      return res.status(401).json({ 
        message: 'Não autorizado: Nenhum usuário autenticado encontrado.' 
      });
    }

    const usuarioResponse = {
      id: req.currentUser.id,
      email: req.currentUser.email,
      nomeCompleto: req.currentUser.nomeCompleto,
      tipoPerfil: req.currentUser.tipoPerfil,
      avatarUrl: req.currentUser.avatarUrl,
      onboardingComplete: req.currentUser.onboardingComplete
    };
    
    return res.json({
      usuario: usuarioResponse,
      tipoPerfil: req.currentUser.tipoPerfil
    });
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}; 