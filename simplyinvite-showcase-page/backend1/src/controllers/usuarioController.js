const db = require("../models");
const bcrypt = require("bcryptjs");

// Interface para dados de onboarding
const OnboardingRequest = {
  experiences: { type: String },
  portfolioLinks: { type: String },
  educationalBackground: { type: String },
};

exports.getAll = async (_req, res) => {
  try {
    const usuarios = await db.Usuario.findAll({
      attributes: { exclude: ["senha"] },
    });
    return res.json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await db.Usuario.findByPk(id, {
      attributes: { exclude: ["senha"] },
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.json(usuario);
  } catch (error) {
    console.error(`Erro ao buscar usuário ${req.params.id}:`, error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      email,
      senha,
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
      dataNascimento,
      areasInteresse,
      habilidadesPrincipais,
    } = req.body;

    // Validar campos obrigatórios
    if (!email || !senha || !nomeCompleto || !tipoPerfil) {
      return res.status(400).json({
        message:
          "Campos obrigatórios não fornecidos: email, senha, nomeCompleto e tipoPerfil",
      });
    }

    // Verificar se o email já existe
    const usuarioExistente = await db.Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ message: "Este email já está em uso" });
    }

    // Se for RH ou gestor e tiver empresaId, verificar se a empresa existe
    if ((tipoPerfil === "rh" || tipoPerfil === "gestor") && empresaId) {
      const empresa = await db.Empresa.findByPk(empresaId);
      if (!empresa) {
        return res.status(400).json({ message: "Empresa não encontrada" });
      }
    }

    // Criar o usuário
    const usuario = await db.Usuario.create({
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
      onboardingCompleto: false,
    });

    // Retornar o usuário criado sem a senha
    const usuarioSemSenha = { ...usuario };
    delete usuarioSemSenha.senha;

    return res.status(201).json(usuarioSemSenha);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o usuário existe
    const usuario = await db.Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Atualizar o usuário
    await usuario.update(req.body);

    // Retornar o usuário atualizado sem a senha
    const usuarioAtualizado = await db.Usuario.findByPk(id, {
      attributes: { exclude: ["senha"] },
    });

    return res.json(usuarioAtualizado);
  } catch (error) {
    console.error(`Erro ao atualizar usuário ${req.params.id}:`, error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o usuário existe
    const usuario = await db.Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Remover o usuário
    await usuario.destroy();

    return res.status(204).send();
  } catch (error) {
    console.error(`Erro ao remover usuário ${req.params.id}:`, error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.completarOnboarding = async (req, res) => {
  try {
    if (!req.usuario) {
      return res
        .status(401)
        .json({ message: "Não autorizado: Usuário não autenticado" });
    }

    const {
      experiences,
      portfolioLinks,
      educationalBackground,
      institutionName,
      studyDetails,
      talentSource,
      humanizedCategory,
      customCategory,
      recognitionBadge,
    } = req.body;

    const usuario = await db.Usuario.findByPk(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Salvar todos os campos do onboarding
    if (experiences) {
      usuario.experiences = experiences;
    }

    if (portfolioLinks) {
      usuario.portfolioLinks = portfolioLinks;
    }

    if (educationalBackground) {
      usuario.educationalBackground = educationalBackground;
    }

    if (institutionName) {
      usuario.institutionName = institutionName;
    }

    if (studyDetails) {
      usuario.studyDetails = studyDetails;
    }

    if (talentSource) {
      usuario.talentSource = talentSource;
    }

    if (humanizedCategory) {
      usuario.humanizedCategory = humanizedCategory;
    }

    if (customCategory) {
      usuario.customCategory = customCategory;
    }

    if (recognitionBadge) {
      usuario.recognitionBadge = recognitionBadge;
    }

    usuario.onboardingCompleto = true;
    await usuario.save();

    // Retornar o usuário atualizado (sem a senha, conforme defaultScope do modelo)
    const usuarioAtualizado = await db.Usuario.findByPk(req.usuario.id);
    return res.json(usuarioAtualizado);
  } catch (error) {
    console.error("Erro ao completar onboarding:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};

exports.getPerfilUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar o usuário primeiro para verificar o tipoPerfil
    const usuarioBasico = await db.Usuario.findByPk(id, {
      attributes: { exclude: ["senha"] },
    });

    if (!usuarioBasico) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Definir includes baseado no tipo de perfil
    let includes = [];

    if (usuarioBasico.tipoPerfil === "jovem") {
      includes = [{ association: "projetos" }];
    } else if (
      usuarioBasico.tipoPerfil === "rh" ||
      usuarioBasico.tipoPerfil === "gestor"
    ) {
      includes = [{ association: "empresa" }];
    }

    // Buscar novamente com os includes apropriados
    const usuario = await db.Usuario.findByPk(id, {
      attributes: { exclude: ["senha"] },
      include: includes,
    });

    return res.json(usuario);
  } catch (error) {
    console.error(`Erro ao buscar perfil do usuário ${req.params.id}:`, error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
};
