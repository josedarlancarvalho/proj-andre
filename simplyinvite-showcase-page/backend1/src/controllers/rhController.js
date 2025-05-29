const db = require("../models");
const { Op, Sequelize } = require("sequelize");

// Buscar projetos pendentes
exports.buscarProjetosPendentes = async (req, res) => {
  try {
    const projetos = await db.Projeto.findAll({
      where: { status: "pendente" },
      include: [
        {
          model: db.Usuario,
          as: "usuario",
          attributes: ["id", "nomeCompleto", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    res.json(projetos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar projetos pendentes" });
  }
};

// Buscar histórico de avaliações
exports.buscarHistoricoAvaliacoes = async (req, res) => {
  try {
    const avaliadorId = req.usuario.id;
    const avaliacoes = await db.Avaliacao.findAll({
      where: { avaliadorId },
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
      order: [["createdAt", "DESC"]],
    });
    res.json(avaliacoes);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar histórico de avaliações" });
  }
};

// Avaliar projeto
exports.avaliarProjeto = async (req, res) => {
  try {
    const { projetoId } = req.params;
    const { nota, comentario, medalha } = req.body;
    const avaliadorId = req.usuario.id;

    const projeto = await db.Projeto.findByPk(parseInt(projetoId, 10));
    if (!projeto) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }

    const avaliacao = await db.Avaliacao.create({
      projetoId: parseInt(projetoId, 10),
      avaliadorId,
      nota,
      comentario,
      medalha,
    });

    await projeto.update({ status: "avaliado" });

    res.json(avaliacao);
  } catch (error) {
    res.status(500).json({ message: "Erro ao avaliar projeto" });
  }
};

// Encaminhar avaliação para gestor
exports.encaminharParaGestor = async (req, res) => {
  try {
    const { avaliacaoId } = req.params;
    const avaliacao = await db.Avaliacao.findByPk(parseInt(avaliacaoId, 10));

    if (!avaliacao) {
      return res.status(404).json({ message: "Avaliação não encontrada" });
    }

    await avaliacao.update({ encaminhadoParaGestor: true });

    res.json(avaliacao);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao encaminhar avaliação para gestor" });
  }
};

// Buscar estatísticas
exports.buscarEstatisticas = async (req, res) => {
  try {
    const avaliadorId = req.usuario.id;

    const estatisticas = {
      avaliacoesTotal: await db.Avaliacao.count({ where: { avaliadorId } }),
      medalhas: {
        ouro: await db.Avaliacao.count({
          where: { avaliadorId, medalha: "ouro" },
        }),
        prata: await db.Avaliacao.count({
          where: { avaliadorId, medalha: "prata" },
        }),
        bronze: await db.Avaliacao.count({
          where: { avaliadorId, medalha: "bronze" },
        }),
      },
      projetosPendentes: await db.Projeto.count({
        where: { status: "pendente" },
      }),
      avaliacoesPorMes: await db.Avaliacao.findAll({
        where: { avaliadorId },
        attributes: [
          [
            Sequelize.fn("date_trunc", "month", Sequelize.col("createdAt")),
            "mes",
          ],
          [Sequelize.fn("count", "*"), "total"],
        ],
        group: [
          Sequelize.fn("date_trunc", "month", Sequelize.col("createdAt")),
        ],
        raw: true,
      }),
      distribuicaoMedalhas: await db.Avaliacao.findAll({
        where: { avaliadorId },
        attributes: ["medalha", [Sequelize.fn("count", "*"), "total"]],
        group: ["medalha"],
        raw: true,
      }),
      projetosAvaliados: await db.Projeto.count({
        where: { status: "avaliado" },
        include: [
          {
            model: db.Avaliacao,
            where: { avaliadorId },
          },
        ],
      }),
    };

    res.json(estatisticas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar estatísticas" });
  }
};

// Buscar projeto específico
exports.buscarProjeto = async (req, res) => {
  try {
    const { id } = req.params;
    const projeto = await db.Projeto.findOne({
      where: { id: parseInt(id, 10) },
      include: [
        {
          model: db.Usuario,
          as: "usuario",
          attributes: ["id", "nomeCompleto", "email"],
        },
        {
          model: db.Avaliacao,
          as: "avaliacoes",
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

// Buscar perfil
exports.buscarPerfil = async (req, res) => {
  try {
    const avaliadorId = req.usuario.id;
    const usuario = await db.Usuario.findByPk(avaliadorId, {
      attributes: { exclude: ["senha"] },
      include: [
        {
          model: db.Empresa,
          as: "empresa",
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.json(usuario);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar perfil" });
  }
};

// Atualizar perfil
exports.atualizarPerfil = async (req, res) => {
  try {
    const avaliadorId = req.usuario.id;
    const usuario = await db.Usuario.findByPk(avaliadorId);

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await usuario.update(req.body);

    const usuarioAtualizado = await db.Usuario.findByPk(avaliadorId, {
      attributes: { exclude: ["senha"] },
      include: [
        {
          model: db.Empresa,
          as: "empresa",
        },
      ],
    });

    return res.json(usuarioAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar perfil do RH:", error);
    return res.status(500).json({ message: "Erro ao atualizar perfil" });
  }
};
