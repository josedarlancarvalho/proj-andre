const db = require("../models");
const { Op } = require("sequelize");

// Criar novo projeto
exports.criarProjeto = async (req, res) => {
  const { titulo, descricao, tecnologias, linkRepositorio, linkDeploy } =
    req.body;
  try {
    const novoProjeto = await db.Projeto.create({
      titulo,
      descricao,
      tecnologias,
      linkRepositorio,
      linkDeploy,
      status: "pendente",
      usuarioId: req.usuario.id,
    });
    const projetoCompleto = await db.Projeto.findByPk(novoProjeto.id, {
      include: [
        {
          model: db.Usuario,
          as: "usuario",
          attributes: ["id", "nomeCompleto", "email"],
        },
      ],
    });
    res.status(201).json(projetoCompleto);
  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

// Atualizar projeto
exports.atualizarProjeto = async (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, tecnologias, linkRepositorio, linkDeploy } =
    req.body;
  try {
    const projeto = await db.Projeto.findOne({
      where: {
        id,
        usuarioId: req.usuario.id,
        status: "pendente",
      },
    });
    if (!projeto) {
      res
        .status(404)
        .json({ message: "Projeto não encontrado ou não pode ser editado" });
      return;
    }
    await projeto.update({
      titulo,
      descricao,
      tecnologias,
      linkRepositorio,
      linkDeploy,
    });
    res.json(projeto);
  } catch (error) {
    console.error("Erro ao atualizar projeto:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

// Excluir projeto
exports.excluirProjeto = async (req, res) => {
  const { id } = req.params;
  try {
    const projeto = await db.Projeto.findOne({
      where: {
        id,
        usuarioId: req.usuario.id,
        status: "pendente",
      },
    });
    if (!projeto) {
      res
        .status(404)
        .json({ message: "Projeto não encontrado ou não pode ser excluído" });
      return;
    }
    await projeto.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir projeto:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

// Buscar projetos do jovem
exports.buscarMeusProjetos = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const projetos = await db.Projeto.findAll({
      where: { usuarioId },
      include: [
        {
          model: db.Avaliacao,
          as: "avaliacoes",
          include: [
            {
              model: db.Usuario,
              as: "avaliador",
              attributes: ["id", "nomeCompleto", "email"],
            },
          ],
        },
        {
          model: db.Feedback,
          as: "feedbacks",
          include: [
            {
              model: db.Usuario,
              as: "gestor",
              attributes: ["id", "nomeCompleto", "email"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(projetos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar projetos" });
  }
};

// Buscar projeto específico
exports.buscarProjeto = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id;
    const projeto = await db.Projeto.findOne({
      where: { id: parseInt(id, 10), usuarioId },
      include: [
        {
          model: db.Avaliacao,
          as: "avaliacoes",
          include: [
            {
              model: db.Usuario,
              as: "avaliador",
              attributes: ["id", "nomeCompleto", "email"],
            },
          ],
        },
        {
          model: db.Feedback,
          as: "feedbacks",
          include: [
            {
              model: db.Usuario,
              as: "gestor",
              attributes: ["id", "nomeCompleto", "email"],
            },
          ],
        },
      ],
    });
    if (!projeto) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }
    res.json(projeto);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar projeto" });
  }
};

// Buscar perfil do jovem
exports.buscarPerfil = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const usuario = await db.Usuario.findByPk(usuarioId, {
      attributes: { exclude: ["senha"] },
    });
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ message: "Erro ao buscar perfil" });
  }
};

// Atualizar perfil do jovem
exports.atualizarPerfil = async (req, res) => {
  const { nomeCompleto, email, ...outrosDados } = req.body;
  try {
    console.log(
      "Atualizando perfil do usuário com dados (completo):",
      JSON.stringify(req.body, null, 2)
    );
    console.log("Dados do usuário atual:", req.usuario.id);

    const usuarioId = req.usuario.id;
    const usuario = await db.Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Crie um objeto com os campos atualizáveis
    const dadosParaAtualizar = {
      ...outrosDados,
    };

    // Adicione o campo nomeCompleto se ele foi fornecido
    if (nomeCompleto) {
      dadosParaAtualizar.nomeCompleto = nomeCompleto;
    }

    console.log(
      "Dados que serão atualizados:",
      JSON.stringify(dadosParaAtualizar, null, 2)
    );

    // Tente atualizar o usuário e capture qualquer erro específico
    try {
      await usuario.update(dadosParaAtualizar);
    } catch (updateError) {
      console.error("Erro específico na atualização:", updateError.message);
      console.error("Stack trace:", updateError.stack);
      return res
        .status(500)
        .json({ message: `Erro específico: ${updateError.message}` });
    }

    // Remover a inclusão da empresa que está causando o erro
    const usuarioAtualizado = await db.Usuario.findByPk(usuarioId, {
      attributes: { exclude: ["senha"] },
    });

    console.log("Perfil atualizado com sucesso:", usuarioAtualizado.id);
    res.json(usuarioAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error.message);
    console.error("Stack trace:", error.stack);
    res
      .status(500)
      .json({ message: "Erro ao atualizar perfil", error: error.message });
  }
};

// Buscar estatísticas do jovem
exports.buscarEstatisticas = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const estatisticas = {
      totalProjetos: await db.Projeto.count({ where: { usuarioId } }),
      projetosAvaliados: await db.Projeto.count({
        where: { usuarioId, status: "avaliado" },
      }),
      projetosDestacados: await db.Projeto.count({
        where: { usuarioId, status: "destacado" },
      }),
      medalhasRecebidas: await db.Avaliacao.count({
        where: {
          "$projeto.usuarioId$": usuarioId,
          medalha: { [Op.not]: null },
        },
        include: [
          {
            model: db.Projeto,
            as: "projeto",
          },
        ],
      }),
      feedbacksRecebidos: await db.Feedback.count({
        include: [
          {
            model: db.Projeto,
            as: "projeto",
            where: { usuarioId },
          },
        ],
      }),
    };
    res.json(estatisticas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar estatísticas" });
  }
};

// Buscar feedbacks
exports.buscarFeedbacks = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const feedbacks = await db.Feedback.findAll({
      include: [
        {
          model: db.Projeto,
          as: "projeto",
          where: { usuarioId },
          include: [
            {
              model: db.Usuario,
              as: "usuario",
              attributes: ["id", "nomeCompleto", "email"],
            },
          ],
        },
        {
          model: db.Usuario,
          as: "gestor",
          attributes: ["id", "nomeCompleto", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar feedbacks" });
  }
};

// Buscar convites
exports.buscarConvites = async (req, res) => {
  try {
    const jovemId = req.usuario.id;
    const convites = await db.Convite.findAll({
      where: { jovemId },
      include: [
        {
          model: db.Empresa,
          as: "empresa",
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(convites);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar convites" });
  }
};

// Aceitar convite
exports.aceitarConvite = async (req, res) => {
  try {
    const { id } = req.params;
    const jovemId = req.usuario.id;
    const convite = await db.Convite.findOne({
      where: { id: parseInt(id, 10), jovemId, status: "pendente" },
    });
    if (!convite) {
      return res
        .status(404)
        .json({ message: "Convite não encontrado ou já respondido" });
    }
    await convite.update({ status: "aceito" });
    await db.Usuario.update(
      { empresaId: convite.empresaId },
      { where: { id: jovemId } }
    );
    res.json(convite);
  } catch (error) {
    res.status(500).json({ message: "Erro ao aceitar convite" });
  }
};

// Recusar convite
exports.recusarConvite = async (req, res) => {
  try {
    const { id } = req.params;
    const jovemId = req.usuario.id;
    const convite = await db.Convite.findOne({
      where: { id: parseInt(id, 10), jovemId, status: "pendente" },
    });
    if (!convite) {
      return res
        .status(404)
        .json({ message: "Convite não encontrado ou já respondido" });
    }
    await convite.update({ status: "recusado" });
    res.json(convite);
  } catch (error) {
    res.status(500).json({ message: "Erro ao recusar convite" });
  }
};

// Buscar evolução
exports.buscarEvolucao = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const evolucao = {
      projetos: await db.Projeto.findAll({
        where: { usuarioId },
        order: [["createdAt", "ASC"]],
        include: [
          {
            model: db.Avaliacao,
            as: "avaliacoes",
            include: [
              {
                model: db.Usuario,
                as: "avaliador",
                attributes: ["id", "nomeCompleto", "email"],
              },
            ],
          },
        ],
      }),
      medalhas: await db.Avaliacao.findAll({
        include: [
          {
            model: db.Projeto,
            as: "projeto",
            where: { usuarioId },
            required: true,
          },
        ],
        where: {
          medalha: { [Op.not]: null },
        },
      }),
      feedbacks: await db.Feedback.findAll({
        include: [
          {
            model: db.Projeto,
            as: "projeto",
            where: { usuarioId },
            required: true,
          },
        ],
        order: [["createdAt", "DESC"]],
      }),
    };
    return res.json(evolucao);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar evolução" });
  }
};

// Completar onboarding
exports.completarOnboarding = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
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
      gender,
      genderOther,
      cidade,
      areasInteresse,
    } = req.body;

    const usuario = await db.Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    // Atualizar todos os campos do onboarding
    const updateData = {};

    if (experiences) updateData.experiences = experiences;
    if (portfolioLinks) updateData.portfolioLinks = portfolioLinks;
    if (educationalBackground)
      updateData.educationalBackground = educationalBackground;
    if (institutionName) updateData.institutionName = institutionName;
    if (studyDetails) updateData.studyDetails = studyDetails;
    if (talentSource) updateData.talentSource = talentSource;
    if (humanizedCategory) updateData.humanizedCategory = humanizedCategory;
    if (customCategory) updateData.customCategory = customCategory;
    if (recognitionBadge) updateData.recognitionBadge = recognitionBadge;

    // Novos campos
    if (gender) updateData.gender = gender;
    if (genderOther) updateData.genderOther = genderOther;
    if (cidade) updateData.cidade = cidade;
    if (areasInteresse) updateData.areasInteresse = areasInteresse;

    // Marcar onboarding como completo
    updateData.onboardingCompleto = true;

    await usuario.update(updateData);

    const usuarioAtualizado = await db.Usuario.findByPk(usuarioId, {
      attributes: { exclude: ["senha"] },
    });

    return res.json(usuarioAtualizado);
  } catch (error) {
    console.error("Erro ao completar onboarding:", error);
    return res.status(500).json({ message: "Erro ao completar onboarding" });
  }
};
