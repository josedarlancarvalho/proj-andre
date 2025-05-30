const db = require("../models");
const { Op, Sequelize } = require("sequelize");

// Buscar projetos pendentes
exports.buscarProjetosPendentes = async (req, res) => {
  try {
<<<<<<< HEAD
=======
    console.log("RH - Buscando projetos pendentes");

>>>>>>> origin/producao1
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
<<<<<<< HEAD
    res.json(projetos);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar projetos pendentes" });
=======

    console.log(`RH - Encontrados ${projetos.length} projetos pendentes`);
    if (projetos.length > 0) {
      console.log(
        `RH - Exemplo do primeiro projeto: ${JSON.stringify(projetos[0])}`
      );
    }

    res.json(projetos);
  } catch (error) {
    console.error("RH - Erro ao buscar projetos pendentes:", error);
    res.status(500).json({
      message: "Erro ao buscar projetos pendentes",
      error: error.message,
    });
>>>>>>> origin/producao1
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

<<<<<<< HEAD
=======
// Nova função para salvar feedback do usuário RH no projeto
exports.salvarFeedbackUsuario = async (req, res) => {
  try {
    const { projetoId } = req.params;
    const { feedback } = req.body;
    const avaliadorId = req.usuario.id;

    const projeto = await db.Projeto.findByPk(parseInt(projetoId, 10));
    if (!projeto) {
      return res.status(404).json({ message: "Projeto não encontrado" });
    }

    // Verificar se já existe uma avaliação
    let avaliacao = await db.Avaliacao.findOne({
      where: { projetoId: parseInt(projetoId, 10), avaliadorId },
    });

    if (avaliacao) {
      // Atualizar avaliação existente
      avaliacao = await avaliacao.update({
        comentario: feedback,
      });
    } else {
      // Criar nova avaliação simplificada (apenas feedback)
      avaliacao = await db.Avaliacao.create({
        projetoId: parseInt(projetoId, 10),
        avaliadorId,
        nota: 5, // Nota padrão
        comentario: feedback,
      });
    }

    // Atualizar o status do projeto para "avaliado"
    await projeto.update({ status: "avaliado" });

    res.json(avaliacao);
  } catch (error) {
    console.error("Erro ao salvar feedback:", error);
    res.status(500).json({ message: "Erro ao salvar feedback do usuário" });
  }
};

>>>>>>> origin/producao1
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
<<<<<<< HEAD
=======

// Buscar todos os projetos (não apenas pendentes)
exports.buscarTodosProjetos = async (req, res) => {
  try {
    console.log("RH - Buscando todos os projetos");

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
      ],
      order: [["createdAt", "DESC"]],
    });

    console.log(`RH - Encontrados ${projetos.length} projetos no total`);
    if (projetos.length > 0) {
      console.log(
        `RH - Exemplo do primeiro projeto: ${JSON.stringify(projetos[0])}`
      );
    }

    res.json(projetos);
  } catch (error) {
    console.error("RH - Erro ao buscar todos os projetos:", error);
    res.status(500).json({
      message: "Erro ao buscar todos os projetos",
      error: error.message,
    });
  }
};

// Buscar projetos com filtros
exports.buscarProjetosFiltrados = async (req, res) => {
  try {
    const { status, tecnologia, avaliado } = req.query;

    const where = {};

    // Filtrar por status
    if (status) {
      where.status = status;
    }

    // Filtrar por tecnologia (como é um campo JSON, precisamos usar a função JSONB_CONTAINS no PostgreSQL)
    const include = [
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
    ];

    // Incluir avaliações se solicitado
    if (avaliado === "true") {
      include.push({
        model: db.Avaliacao,
        as: "avaliacoes",
        required: true, // INNER JOIN - projetos que possuem avaliações
        include: [
          {
            model: db.Usuario,
            as: "avaliador",
            attributes: ["id", "nomeCompleto", "email"],
          },
        ],
      });
    } else if (avaliado === "false") {
      where.status = "pendente"; // Projetos sem avaliação geralmente estão pendentes
    } else {
      // Se não especificado, inclui avaliações como LEFT JOIN
      include.push({
        model: db.Avaliacao,
        as: "avaliacoes",
        required: false,
        include: [
          {
            model: db.Usuario,
            as: "avaliador",
            attributes: ["id", "nomeCompleto", "email"],
          },
        ],
      });
    }

    const projetos = await db.Projeto.findAll({
      where,
      include,
      order: [["createdAt", "DESC"]],
    });

    // Filtrar por tecnologia no JavaScript (já que não estamos usando operadores SQL específicos)
    let result = projetos;
    if (tecnologia) {
      result = projetos.filter(
        (projeto) =>
          projeto.tecnologias &&
          Array.isArray(projeto.tecnologias) &&
          projeto.tecnologias.includes(tecnologia)
      );
    }

    res.json(result);
  } catch (error) {
    console.error("Erro ao buscar projetos filtrados:", error);
    res.status(500).json({ message: "Erro ao buscar projetos filtrados" });
  }
};
>>>>>>> origin/producao1
