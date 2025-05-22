import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { Usuario, Empresa } from '../models';

// Interface para dados de onboarding
interface OnboardingRequest {
  experiences?: string;
  portfolioLinks?: string;
  educationalBackground?: string;
}

export const getAll = async (_req: Request, res: Response) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['senha'] } // Excluir campo senha da resposta
    });
    return res.json(usuarios);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['senha'] }
    });
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    return res.json(usuario);
  } catch (error) {
    console.error(`Erro ao buscar usuário ${req.params.id}:`, error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const { 
      email, senha, nomeCompleto, tipoPerfil, 
      empresaId, cargoNaEmpresa, avatarUrl, 
      telefone, cidade, estado, bio, linkedinUrl, githubUrl,
      dataNascimento, areasInteresse, habilidadesPrincipais 
    } = req.body;

    // Validar campos obrigatórios
    if (!email || !senha || !nomeCompleto || !tipoPerfil) {
      return res.status(400).json({
        message: 'Campos obrigatórios não fornecidos: email, senha, nomeCompleto e tipoPerfil'
      });
    }

    // Verificar se o email já existe
    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: 'Este email já está em uso' });
    }

    // Se for RH ou gestor e tiver empresaId, verificar se a empresa existe
    if ((tipoPerfil === 'hr' || tipoPerfil === 'manager') && empresaId) {
      const empresa = await Empresa.findByPk(empresaId);
      if (!empresa) {
        return res.status(400).json({ message: 'Empresa não encontrada' });
      }
    }

    // Criar o usuário
    const usuario = await Usuario.create({
      email,
      senha, // O hook beforeCreate no modelo fará o hash da senha
      nomeCompleto,
      tipoPerfil,
      empresaId,
      cargoNaEmpresa,
      avatarUrl,
      telefone,
      cidade,
      estado,
      bio,
      linkedinUrl,
      githubUrl,
      dataNascimento: dataNascimento ? new Date(dataNascimento) : undefined,
      areasInteresse,
      habilidadesPrincipais,
      onboardingComplete: false
    });

    // Retornar o usuário criado sem a senha
    const usuarioSemSenha = usuario.toJSON();

    return res.status(201).json(usuarioSemSenha);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar se o usuário existe
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualizar o usuário
    await usuario.update(req.body);
    
    // Retornar o usuário atualizado sem a senha
    const usuarioAtualizado = await Usuario.findByPk(id, {
      attributes: { exclude: ['senha'] }
    });
    
    return res.json(usuarioAtualizado);
  } catch (error) {
    console.error(`Erro ao atualizar usuário ${req.params.id}:`, error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Verificar se o usuário existe
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Remover o usuário
    await usuario.destroy();
    
    return res.status(204).send();
  } catch (error) {
    console.error(`Erro ao remover usuário ${req.params.id}:`, error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const completarOnboarding = async (req: Request, res: Response) => {
  try {
    if (!req.currentUser) {
      return res.status(401).json({ message: 'Não autorizado: Usuário não autenticado' });
    }

    const { experiences, portfolioLinks, educationalBackground } = req.body as OnboardingRequest;

    const usuario = await Usuario.findByPk(req.currentUser.id);
    if (!usuario) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualizar campos do perfil com dados do onboarding
    if (experiences) {
      usuario.bio = experiences;
    }
    if (portfolioLinks) {
      usuario.githubUrl = portfolioLinks;
    }
    // Você poderia adicionar um novo campo para formação acadêmica
    // ou usar outro campo existente para educational background

    usuario.onboardingComplete = true;
    await usuario.save();

    // Criar objeto de resposta
    const usuarioResponse = {
      id: usuario.id,
      email: usuario.email,
      nomeCompleto: usuario.nomeCompleto,
      tipoPerfil: usuario.tipoPerfil,
      avatarUrl: usuario.avatarUrl,
      onboardingComplete: usuario.onboardingComplete
    };

    return res.json(usuarioResponse);
  } catch (error) {
    console.error('Erro ao completar onboarding:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
};

export const getPerfilUsuario = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Buscar o usuário primeiro para verificar o tipoPerfil
    const usuarioBasico = await Usuario.findByPk(id, {
      attributes: { exclude: ['senha'] }
    });
    
    if (!usuarioBasico) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    // Definir includes baseado no tipo de perfil
    let includes = [];
    
    if (usuarioBasico.tipoPerfil === 'talent') {
      includes = [{ association: 'projetos' }];
    } else if (usuarioBasico.tipoPerfil === 'hr' || usuarioBasico.tipoPerfil === 'manager') {
      includes = [{ association: 'empresa' }];
    }
    
    // Buscar novamente com os includes apropriados
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['senha'] },
      include: includes
    });
    
    return res.json(usuario);
  } catch (error) {
    console.error(`Erro ao buscar perfil do usuário ${req.params.id}:`, error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}; 