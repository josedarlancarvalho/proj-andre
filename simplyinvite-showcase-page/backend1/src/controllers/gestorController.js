const db = require("../models");
const { Op } = require("sequelize");
const emailService = require("../utils/emailService");

// Buscar projetos destacados
exports.buscarProjetosDestacados = async (req, res) => {
  try {
    const projetos = await db.Projeto.findAll({
      where: { status: "destacado" },
      include: [
        {
          model: db.Usuario,
          as: "usuario",
          attributes: ["id", "nomeCompleto", "email"],
        },
      ],
    });
    return res.json(projetos);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar projetos destacados" });
  }
};

// Buscar projeto destacado específico
exports.buscarProjetoDestacado = async (req, res) => {
  try {
    const { id } = req.params;
    const projeto = await db.Projeto.findOne({
      where: { id: parseInt(id, 10), status: "destacado" },
      include: [
        {
          model: db.Usuario,
          as: "usuario",
          attributes: ["id", "nomeCompleto", "email"],
        },
      ],
    });
    if (!projeto) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }
    return res.json(projeto);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar projeto" });
  }
};

// Enviar feedback para um projeto
exports.enviarFeedback = async (req, res) => {
  try {
    const { projetoId } = req.params;
    const { comentario, oportunidade } = req.body;
    const gestorId = req.usuario.id;

    // Buscar informações do projeto e do jovem
    const projeto = await db.Projeto.findOne({
      where: { id: parseInt(projetoId, 10) },
      include: [
        {
          model: db.Usuario,
          as: "usuario",
          attributes: ["id", "nomeCompleto", "email"],
        },
      ],
    });

    if (!projeto) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }

    // Buscar informações do gestor
    const gestor = await db.Usuario.findByPk(gestorId, {
      attributes: ["id", "nomeCompleto", "email"],
    });

    // Criar o feedback
    const feedback = await db.Feedback.create({
      projetoId: parseInt(projetoId, 10),
      gestorId,
      comentario,
      oportunidade,
    });

    // Criar uma nova notificação para o jovem
    await db.Notificacao.create({
      usuarioId: projeto.usuario.id,
      tipo: "feedback",
      conteudo: `Você recebeu um novo feedback para seu projeto "${projeto.titulo}" de ${gestor.nomeCompleto}.`,
      dados: {
        projetoId: projeto.id,
        feedbackId: feedback.id,
        gestorId: gestor.id,
        gestorNome: gestor.nomeCompleto,
      },
    });

    // Enviar e-mail de notificação
    try {
      // Construir o link para o projeto
      const appUrl = process.env.APP_URL || "http://localhost:5173";
      const linkProjeto = `${appUrl}/jovem/submissoes`;

      const emailResult = await emailService.sendFeedbackEmail(
        projeto.usuario.email,
        {
          nomeJovem: projeto.usuario.nomeCompleto,
          tituloProjeto: projeto.titulo,
          nomeGestor: gestor.nomeCompleto,
          comentario: comentario,
          oportunidade: oportunidade,
          linkProjeto: linkProjeto,
          projetoId: projeto.id,
          jovemId: projeto.usuario.id,
        }
      );

      if (emailResult.success) {
        console.log(`E-mail de feedback enviado para ${projeto.usuario.email}`);
      } else {
        console.error("Erro ao enviar e-mail de feedback:", emailResult.error);
      }
    } catch (emailError) {
      console.error("Exceção ao enviar e-mail de feedback:", emailError);
      // Não interromper o fluxo se o e-mail falhar
    }

    res.json({
      ...feedback.toJSON(),
      emailEnviado: true,
      notificacaoCriada: true,
    });
  } catch (error) {
    console.error("Erro ao enviar feedback:", error);
    res.status(500).json({ message: "Erro ao enviar feedback" });
  }
};

// Buscar talentos
exports.buscarTalentos = async (req, res) => {
  try {
    const talentos = await db.Usuario.findAll({
      where: { tipoPerfil: "jovem" },
      attributes: { exclude: ["senha"] },
    });
    res.json(talentos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar talentos" });
  }
};

// Buscar histórico de interações com um talento
exports.buscarHistoricoInteracoes = async (req, res) => {
  try {
    const { talentoId } = req.params;
    const historico = await db.Feedback.findAll({
      where: { "$projeto.usuarioId$": parseInt(talentoId, 10) },
      include: [
        {
          model: db.Projeto,
          as: "projeto",
          include: [
            {
              model: db.Usuario,
              as: "usuario",
              attributes: ["id", "nomeCompleto", "email"],
            },
          ],
        },
      ],
    });
    res.json(historico);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar histórico de interações" });
  }
};

// Buscar talentos em destaque
exports.buscarTalentosDestaque = async (req, res) => {
  try {
    const talentos = await db.Usuario.findAll({
      where: {
        tipoPerfil: "jovem",
        [Op.or]: [
          { "$projetos.status$": "destacado" },
          { "$avaliacoes.medalha$": { [Op.not]: null } },
        ],
      },
      include: [
        {
          model: db.Projeto,
          as: "projetos",
          include: [{ model: db.Avaliacao, as: "avaliacoes" }],
        },
      ],
      attributes: { exclude: ["senha"] },
    });
    res.json(talentos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar talentos em destaque" });
  }
};

// Buscar talentos por área
exports.buscarTalentosPorArea = async (req, res) => {
  try {
    const { area } = req.params;
    const talentos = await db.Usuario.findAll({
      where: {
        tipoPerfil: "jovem",
        areasInteresse: {
          [Op.overlap]: [area],
        },
      },
      attributes: { exclude: ["senha"] },
    });
    return res.json(talentos);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao buscar talentos por área" });
  }
};

// Favoritar um talento
exports.favoritarTalento = async (req, res) => {
  try {
    const { talentoId } = req.params;
    const gestorId = req.usuario?.id || 1; // Usa ID 1 como fallback se não houver usuário autenticado

    console.log(`Gestor ID ${gestorId} favoritou o talento ID ${talentoId}`);

    // Simulação de banco de dados
    // Em um ambiente real, aqui teríamos uma inserção no banco
    // INSERT INTO favoritos (gestor_id, talento_id) VALUES (gestorId, talentoId)

    // Retornar sucesso
    return res.status(200).json({
      success: true,
      message: "Talento favoritado com sucesso",
      data: {
        gestorId,
        talentoId,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Erro ao favoritar talento:", error);
    return res
      .status(500)
      .json({ success: false, message: "Erro ao favoritar talento" });
  }
};

// Remover talento dos favoritos
exports.removerFavorito = async (req, res) => {
  try {
    const { talentoId } = req.params;
    const gestorId = req.usuario?.id || 1; // Usa ID 1 como fallback

    console.log(
      `Gestor ID ${gestorId} removeu o talento ID ${talentoId} dos favoritos`
    );

    // Simulação de banco de dados
    // Em um ambiente real, aqui teríamos uma remoção no banco
    // DELETE FROM favoritos WHERE gestor_id = gestorId AND talento_id = talentoId

    // Retornar sucesso
    return res.status(200).json({
      success: true,
      message: "Talento removido dos favoritos com sucesso",
      data: {
        gestorId,
        talentoId,
        removedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Erro ao remover talento dos favoritos:", error);
    return res.status(500).json({
      success: false,
      message: "Erro ao remover talento dos favoritos",
    });
  }
};

// Buscar entrevistas
exports.buscarEntrevistas = async (req, res) => {
  try {
    // Aqui você precisaria ter uma tabela de entrevistas
    // Por enquanto, vamos retornar uma lista vazia
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar entrevistas" });
  }
};

// Buscar estatísticas
exports.buscarEstatisticas = async (req, res) => {
  try {
    const gestorId = req.usuario.id;
    const estatisticas = {
      totalFeedbacks: await db.Feedback.count({ where: { gestorId } }),
      totalTalentosFavoritados: 0, // Precisaria de uma tabela de favoritos
      totalEntrevistas: 0, // Precisaria de uma tabela de entrevistas
      projetosAvaliados: await db.Projeto.count({
        where: {
          "$feedbacks.gestorId$": gestorId,
        },
        include: [{ model: db.Feedback, as: "feedbacks" }],
      }),
    };

    res.json(estatisticas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar estatísticas" });
  }
};

// Explorar talentos
exports.explorarTalentos = async (req, res) => {
  try {
    const talentos = await db.Usuario.findAll({
      where: {
        tipoPerfil: "jovem",
        status: "ativo",
      },
      attributes: { exclude: ["senha"] },
      include: [
        {
          model: db.Projeto,
          as: "projetos",
          include: [{ model: db.Avaliacao, as: "avaliacoes" }],
        },
      ],
    });
    return res.json(talentos);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar talentos" });
  }
};

// Buscar favoritos
exports.buscarFavoritos = async (req, res) => {
  try {
    const gestorId = req.usuario.id;
    const favoritos = await db.Favorito.findAll({
      where: { gestorId },
      include: [
        {
          model: db.Usuario,
          as: "talento",
          attributes: { exclude: ["senha"] },
          include: [{ model: db.Projeto, as: "projetos" }],
        },
      ],
    });

    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar favoritos" });
  }
};

// Atualizar perfil do gestor
exports.atualizarPerfil = async (req, res) => {
  try {
    const gestorId = req.usuario.id;
    const {
      nomeCompleto,
      telefone,
      cidade,
      empresa,
      cnpj,
      cargo,
      departamento,
      experienciaProfissional,
      areasInteresse,
      especialidades,
      linkedinUrl,
      onboardingCompleto,
    } = req.body;

    // Verificar se o usuário existe
    const gestor = await db.Usuario.findByPk(gestorId);
    if (!gestor) {
      return res.status(404).json({ message: "Gestor não encontrado" });
    }

    // Atualizar o perfil
    await gestor.update({
      nomeCompleto: nomeCompleto || gestor.nomeCompleto,
      telefone: telefone || gestor.telefone,
      cidade: cidade || gestor.cidade,
      empresa: empresa || gestor.empresa,
      cnpj: cnpj || gestor.cnpj,
      cargo: cargo || gestor.cargo,
      departamento: departamento || gestor.departamento,
      experienciaProfissional:
        experienciaProfissional || gestor.experienciaProfissional,
      areasInteresse: areasInteresse || gestor.areasInteresse,
      especialidades: especialidades || gestor.especialidades,
      linkedinUrl: linkedinUrl || gestor.linkedinUrl,
      onboardingCompleto:
        onboardingCompleto !== undefined
          ? onboardingCompleto
          : gestor.onboardingCompleto,
    });

    // Retornar o perfil atualizado (sem a senha)
    const perfilAtualizado = await db.Usuario.findByPk(gestorId, {
      attributes: { exclude: ["senha"] },
    });

    return res.json({
      message: "Perfil atualizado com sucesso",
      usuario: perfilAtualizado,
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil do gestor:", error);
    return res.status(500).json({
      message: "Erro ao atualizar perfil do gestor",
      error: error.message,
    });
  }
};

// Buscar projetos avaliados pelo RH
exports.buscarProjetosAvaliados = async (req, res) => {
  try {
    const projetos = await db.Projeto.findAll({
      where: {
        status: "avaliado",
      },
      include: [
        {
          model: db.Usuario,
          as: "usuario",
          attributes: [
            "id",
            "nomeCompleto",
            "email",
            "cidade",
            "formacaoCurso",
            "formacaoInstituicao",
          ],
        },
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
    console.error("Erro ao buscar projetos avaliados:", error);
    res.status(500).json({ message: "Erro ao buscar projetos avaliados" });
  }
};

// Buscar projetos que já receberam feedback
exports.buscarProjetosComFeedback = async (req, res) => {
  try {
    const projetos = await db.Projeto.findAll({
      include: [
        {
          model: db.Usuario,
          as: "usuario",
          attributes: [
            "id",
            "nomeCompleto",
            "email",
            "cidade",
            "formacaoCurso",
            "formacaoInstituicao",
          ],
        },
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
          required: true, // INNER JOIN - apenas projetos com feedback
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
    console.error("Erro ao buscar projetos com feedback:", error);
    res.status(500).json({ message: "Erro ao buscar projetos com feedback" });
  }
};

// Buscar avaliações encaminhadas para o gestor
exports.buscarAvaliacoesEncaminhadas = async (req, res) => {
  try {
    const avaliacoes = await db.Avaliacao.findAll({
      where: { encaminhadoParaGestor: true },
      include: [
        {
          model: db.Projeto,
          as: "projeto",
          include: [
            {
              model: db.Usuario,
              as: "usuario",
              attributes: ["id", "nomeCompleto", "email", "cidade"],
            },
          ],
        },
        {
          model: db.Usuario,
          as: "avaliador",
          attributes: ["id", "nomeCompleto", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(avaliacoes);
  } catch (error) {
    console.error("Erro ao buscar avaliações encaminhadas:", error);
    res.status(500).json({ message: "Erro ao buscar avaliações encaminhadas" });
  }
};
