const db = require("../models");
const { Op } = require("sequelize");

// Criar novo projeto
exports.criarProjeto = async (req, res) => {
  let { titulo, descricao, tecnologias, linkRepositorio, linkDeploy } =
    req.body;
  try {
    console.log(`Tentando criar projeto para usuário ID: ${req.usuario?.id}`);
    console.log(`Dados recebidos: ${JSON.stringify(req.body)}`);

    // Validações adicionais
    const errors = [];

    // Validar título
    if (!titulo || titulo.trim() === "") {
      errors.push({
        field: "titulo",
        message: "Título do projeto é obrigatório",
      });
    } else if (titulo.length > 100) {
      errors.push({
        field: "titulo",
        message: "Título deve ter no máximo 100 caracteres",
      });
    }

    // Validar descrição
    if (!descricao || descricao.trim() === "") {
      errors.push({
        field: "descricao",
        message: "Descrição do projeto é obrigatória",
      });
    } else if (descricao.length > 1000) {
      errors.push({
        field: "descricao",
        message: "Descrição deve ter no máximo 1000 caracteres",
      });
    }

    // Verificar se o usuário existe
    const usuario = await db.Usuario.findByPk(req.usuario.id);
    if (!usuario) {
      console.log(`Usuário ID ${req.usuario.id} não encontrado`);
      return res.status(404).json({
        message: "Usuário não encontrado",
        details:
          "O ID do usuário autenticado não foi encontrado no banco de dados.",
      });
    }

    // Verificar se o usuário é um jovem
    if (usuario.tipoPerfil !== "jovem") {
      console.log(
        `Usuário ID ${req.usuario.id} não é um jovem (${usuario.tipoPerfil})`
      );
      return res.status(403).json({
        message: "Apenas jovens podem criar projetos",
        details: "O usuário autenticado não tem o perfil de jovem.",
      });
    }

    // Garantir que tecnologias seja um array
    if (!tecnologias) {
      tecnologias = [];
    } else if (typeof tecnologias === "string") {
      // Se for uma string, tenta converter para array (pode ser um JSON string)
      try {
        tecnologias = JSON.parse(tecnologias);
      } catch (e) {
        tecnologias = [tecnologias];
      }
    } else if (!Array.isArray(tecnologias)) {
      // Se não for um array, coloca o valor em um array
      tecnologias = [tecnologias];
    }

    // Validar tecnologias
    if (tecnologias.length > 10) {
      errors.push({
        field: "tecnologias",
        message: "Máximo de 10 tecnologias permitidas",
      });
    }

    // Se houver erros, retornar
    if (errors.length > 0) {
      return res.status(400).json({
        message: "Erro de validação",
        errors: errors,
      });
    }

    console.log(`Tecnologias processadas: ${JSON.stringify(tecnologias)}`);

    // Criar o projeto
    console.log("Tentando criar projeto no banco de dados com dados:", {
      titulo,
      descricao,
      tecnologias,
      linkRepositorio,
      linkDeploy,
      status: "pendente",
      usuarioId: req.usuario.id,
    });

    const novoProjeto = await db.Projeto.create({
      titulo,
      descricao,
      tecnologias,
      linkRepositorio,
      linkDeploy,
      status: "pendente",
      usuarioId: req.usuario.id,
    });

    console.log(
      `Projeto criado com ID: ${novoProjeto.id}, dados completos:`,
      JSON.stringify(novoProjeto)
    );

    // Buscar o projeto com dados relacionados
    const projetoCompleto = await db.Projeto.findByPk(novoProjeto.id, {
      include: [
        {
          model: db.Usuario,
          as: "usuario",
          attributes: ["id", "nomeCompleto", "email"],
        },
      ],
    });

    console.log(
      `Projeto recuperado após criação:`,
      JSON.stringify(projetoCompleto)
    );

    // Logar sucesso
    console.log(
      `Projeto criado com sucesso. ID: ${novoProjeto.id}, Usuário: ${req.usuario.id}`
    );

    res.status(201).json(projetoCompleto);
  } catch (error) {
    console.error("Erro ao criar projeto:", error);

    // Tratamento de erros específicos
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        message: "Erro de validação",
        details: error.errors.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    }

    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res.status(400).json({
        message: "Erro de chave estrangeira",
        details: "Referência a um registro que não existe.",
      });
    }

    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        message: "Erro de unicidade",
        details: "Já existe um registro com esse valor único.",
      });
    }

    res.status(500).json({
      message: "Erro interno do servidor",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
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
    console.log(`Buscando projetos para o usuário ID: ${usuarioId}`);

    // Verificar se o usuário existe
    const usuario = await db.Usuario.findByPk(usuarioId);
    if (!usuario) {
      console.log(`Usuário ID ${usuarioId} não encontrado`);
      return res.status(404).json({
        message: "Usuário não encontrado",
        error:
          "O ID do usuário autenticado não foi encontrado no banco de dados.",
      });
    }
    console.log(
      `Usuário encontrado: ${usuario.nomeCompleto} (${usuario.tipoPerfil})`
    );

    // Consultar diretamente a tabela de projetos para verificar se existem registros
    const projetosRaw = await db.Projeto.findAll({
      where: { usuarioId },
      raw: true,
    });

    console.log(
      `Consulta raw de projetos retornou ${projetosRaw.length} registros:`,
      projetosRaw.length > 0
        ? JSON.stringify(projetosRaw)
        : "Nenhum projeto encontrado"
    );

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

    console.log(
      `Encontrados ${projetos.length} projetos para o usuário ID: ${usuarioId}`
    );
    if (projetos.length > 0) {
      console.log(
        `Exemplo do primeiro projeto: ${JSON.stringify(projetos[0])}`
      );
    } else {
      console.log("Nenhum projeto encontrado para este usuário");

      // Verificar se há projetos no banco de dados para qualquer usuário
      const todosProjetosCount = await db.Projeto.count();
      console.log(`Total de projetos no banco de dados: ${todosProjetosCount}`);

      if (todosProjetosCount > 0) {
        const amostraProjetos = await db.Projeto.findAll({
          limit: 2,
          raw: true,
        });
        console.log(
          `Amostra de projetos existentes:`,
          JSON.stringify(amostraProjetos)
        );
      }
    }

    res.json(projetos);
  } catch (error) {
    console.error("Erro ao buscar projetos:", error);
    res
      .status(500)
      .json({ message: "Erro ao buscar projetos", error: error.message });
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

// Upload de vídeo para um projeto
exports.uploadVideo = async (req, res) => {
  try {
    const { projetoId } = req.params;
    const usuarioId = req.usuario.id;

    // Verificar se o projeto existe e pertence ao usuário
    const projeto = await db.Projeto.findOne({
      where: {
        id: parseInt(projetoId, 10),
        usuarioId,
      },
    });

    if (!projeto) {
      return res.status(404).json({
        message: "Projeto não encontrado ou não pertence ao usuário logado",
      });
    }

    // Se não houver arquivo enviado
    if (!req.file) {
      return res.status(400).json({
        message: "Nenhum arquivo de vídeo foi enviado",
      });
    }

    // Construir a URL do vídeo (relativa ao servidor)
    const videoUrl = `/uploads/videos/${req.file.filename}`;

    // Atualizar o projeto com a URL do vídeo
    await projeto.update({ videoUrl });

    res.status(200).json({
      message: "Vídeo enviado com sucesso",
      videoUrl,
      projeto,
    });
  } catch (error) {
    console.error("Erro ao fazer upload de vídeo:", error);
    res.status(500).json({
      message: "Erro ao fazer upload de vídeo",
      error: error.message,
    });
  }
};
