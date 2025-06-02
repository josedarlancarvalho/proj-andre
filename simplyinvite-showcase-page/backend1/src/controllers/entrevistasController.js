const db = require("../models");
const { Op } = require("sequelize");
const emailService = require("../utils/emailService");

// Agendar entrevista
exports.agendarEntrevista = async (req, res) => {
  try {
    const gestorId = req.usuario.id;
    const { talentoId, candidato, data, hora, tipo, detalhes } = req.body;

    if (!talentoId) {
      return res.status(400).json({ message: "ID do talento é obrigatório" });
    }

    // Verificar se o talento existe
    const talento = await db.Usuario.findByPk(talentoId);
    if (!talento) {
      return res.status(404).json({ message: "Talento não encontrado" });
    }

    // Verificar se o gestor existe
    const gestor = await db.Usuario.findByPk(gestorId);
    if (!gestor) {
      return res.status(404).json({ message: "Gestor não encontrado" });
    }

    // Criar a entrevista
    const entrevista = await db.Entrevista.create({
      gestorId,
      talentoId,
      candidato,
      data,
      hora,
      tipo,
      detalhes,
      status: "agendada",
    });

    // Criar uma notificação para o talento
    await db.Notificacao.create({
      usuarioId: talentoId,
      tipo: "entrevista_agendada",
      conteudo: `${gestor.nomeCompleto} agendou uma entrevista com você para o dia ${data} às ${hora}.`,
      lida: false,
      dados: {
        entrevistaId: entrevista.id,
        gestorId,
        gestorNome: gestor.nomeCompleto,
      },
    });

    // Enviar e-mail de notificação da entrevista
    try {
      // Construir o link para as entrevistas
      const appUrl = process.env.APP_URL || "http://localhost:5173";
      const linkEntrevista = `${appUrl}/jovem/convites`;

      // Formatar os dados para o e-mail
      const emailData = {
        nomeJovem: talento.nomeCompleto,
        empresa: gestor.empresa || "Empresa",
        data: data,
        hora: hora,
        tipo: tipo,
        local: detalhes?.local,
        link: detalhes?.link,
        observacoes: detalhes?.observacoes,
        linkEntrevista: linkEntrevista,
        entrevistaId: entrevista.id,
        jovemId: talentoId,
      };

      const emailResult = await emailService.sendEntrevistaEmail(
        talento.email,
        emailData
      );

      if (emailResult.success) {
        console.log(`E-mail de entrevista enviado para ${talento.email}`);
      } else {
        console.error(
          "Erro ao enviar e-mail de entrevista:",
          emailResult.error
        );
      }
    } catch (emailError) {
      console.error("Exceção ao enviar e-mail de entrevista:", emailError);
      // Não interromper o fluxo se o e-mail falhar
    }

    return res.status(201).json({
      message: "Entrevista agendada com sucesso",
      entrevista,
      emailEnviado: true,
    });
  } catch (error) {
    console.error("Erro ao agendar entrevista:", error);
    return res.status(500).json({
      message: "Erro ao agendar entrevista",
      error: error.message,
    });
  }
};

// Listar entrevistas
exports.listarEntrevistas = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const papel = req.usuario.papel;

    let whereCondition = {};

    // Filtrar por usuário conforme seu papel
    if (papel === "jovem") {
      whereCondition.talentoId = usuarioId;
    } else if (papel === "gestor") {
      whereCondition.gestorId = usuarioId;
    }

    // Buscar entrevistas
    const entrevistas = await db.Entrevista.findAll({
      where: whereCondition,
      include: [
        {
          model: db.Usuario,
          as: "gestor",
          attributes: ["id", "nomeCompleto", "email", "empresa", "cargo"],
        },
        {
          model: db.Usuario,
          as: "talento",
          attributes: ["id", "nomeCompleto", "email", "cidade", "telefone"],
        },
      ],
      order: [
        ["data", "ASC"],
        ["hora", "ASC"],
      ],
    });

    return res.json(entrevistas);
  } catch (error) {
    console.error("Erro ao listar entrevistas:", error);
    return res.status(500).json({
      message: "Erro ao listar entrevistas",
      error: error.message,
    });
  }
};

// Cancelar entrevista
exports.cancelarEntrevista = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { entrevistaId } = req.params;

    // Buscar a entrevista
    const entrevista = await db.Entrevista.findByPk(entrevistaId, {
      include: [
        {
          model: db.Usuario,
          as: "gestor",
          attributes: ["id", "nomeCompleto"],
        },
        {
          model: db.Usuario,
          as: "talento",
          attributes: ["id", "nomeCompleto"],
        },
      ],
    });

    if (!entrevista) {
      return res.status(404).json({ message: "Entrevista não encontrada" });
    }

    // Verificar se o usuário tem permissão para cancelar
    if (
      entrevista.gestorId !== usuarioId &&
      entrevista.talentoId !== usuarioId
    ) {
      return res
        .status(403)
        .json({ message: "Sem permissão para cancelar esta entrevista" });
    }

    // Atualizar o status da entrevista
    await entrevista.update({ status: "cancelada" });

    // Determinar quem cancelou e para quem notificar
    const canceladorId = usuarioId;
    const destinatarioId =
      canceladorId === entrevista.gestorId
        ? entrevista.talentoId
        : entrevista.gestorId;

    const canceladorNome =
      canceladorId === entrevista.gestorId
        ? entrevista.gestor.nomeCompleto
        : entrevista.talento.nomeCompleto;

    // Criar notificação para o outro usuário
    await db.Notificacao.create({
      usuarioId: destinatarioId,
      tipo: "entrevista_cancelada",
      conteudo: `${canceladorNome} cancelou a entrevista agendada para ${entrevista.data} às ${entrevista.hora}.`,
      lida: false,
      dados: {
        entrevistaId: entrevista.id,
        canceladorId,
        canceladorNome,
      },
    });

    return res.json({
      message: "Entrevista cancelada com sucesso",
      entrevista,
    });
  } catch (error) {
    console.error("Erro ao cancelar entrevista:", error);
    return res.status(500).json({
      message: "Erro ao cancelar entrevista",
      error: error.message,
    });
  }
};

// Atualizar entrevista
exports.atualizarEntrevista = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;
    const { entrevistaId } = req.params;
    const dadosAtualizados = req.body;

    // Buscar a entrevista
    const entrevista = await db.Entrevista.findByPk(entrevistaId, {
      include: [
        {
          model: db.Usuario,
          as: "gestor",
          attributes: ["id", "nomeCompleto", "email"],
        },
        {
          model: db.Usuario,
          as: "talento",
          attributes: ["id", "nomeCompleto", "email"],
        },
      ],
    });

    if (!entrevista) {
      return res.status(404).json({ message: "Entrevista não encontrada" });
    }

    // Verificar se o usuário tem permissão para editar
    if (
      entrevista.gestorId !== usuarioId &&
      entrevista.talentoId !== usuarioId
    ) {
      return res
        .status(403)
        .json({ message: "Sem permissão para editar esta entrevista" });
    }

    // Validar os dados atualizados
    if (dadosAtualizados.data) {
      const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dataRegex.test(dadosAtualizados.data)) {
        return res
          .status(400)
          .json({ message: "Formato de data inválido. Use YYYY-MM-DD" });
      }
    }

    if (dadosAtualizados.hora) {
      const horaRegex = /^\d{2}:\d{2}$/;
      if (!horaRegex.test(dadosAtualizados.hora)) {
        return res
          .status(400)
          .json({ message: "Formato de hora inválido. Use HH:MM" });
      }
    }

    // Atualizar a entrevista
    await entrevista.update(dadosAtualizados);

    // Se a entrevista foi atualizada pelo gestor, enviar e-mail para o talento
    if (usuarioId === entrevista.gestorId && entrevista.talento) {
      try {
        // Construir o link para as entrevistas
        const appUrl = process.env.APP_URL || "http://localhost:5173";
        const linkEntrevista = `${appUrl}/jovem/convites`;

        // Formatar os dados para o e-mail
        const emailData = {
          nomeJovem: entrevista.talento.nomeCompleto,
          empresa: entrevista.gestor?.empresa || "Empresa",
          data: entrevista.data,
          hora: entrevista.hora,
          tipo: entrevista.tipo,
          local: entrevista.detalhes?.local,
          link: entrevista.detalhes?.link,
          observacoes: entrevista.detalhes?.observacoes,
          linkEntrevista: linkEntrevista,
          entrevistaId: entrevista.id,
          jovemId: entrevista.talentoId,
          atualizada: true,
        };

        const emailResult = await emailService.sendEntrevistaEmail(
          entrevista.talento.email,
          emailData
        );

        if (emailResult.success) {
          console.log(
            `E-mail de atualização de entrevista enviado para ${entrevista.talento.email}`
          );
        } else {
          console.error(
            "Erro ao enviar e-mail de atualização de entrevista:",
            emailResult.error
          );
        }
      } catch (emailError) {
        console.error(
          "Exceção ao enviar e-mail de atualização de entrevista:",
          emailError
        );
        // Não interromper o fluxo se o e-mail falhar
      }
    }

    // Criar notificação para o outro usuário
    const destinatarioId =
      usuarioId === entrevista.gestorId
        ? entrevista.talentoId
        : entrevista.gestorId;
    const atualizadorNome =
      usuarioId === entrevista.gestorId
        ? entrevista.gestor.nomeCompleto
        : entrevista.talento.nomeCompleto;

    await db.Notificacao.create({
      usuarioId: destinatarioId,
      tipo: "entrevista_atualizada",
      conteudo: `${atualizadorNome} atualizou os detalhes da entrevista agendada para ${entrevista.data} às ${entrevista.hora}.`,
      lida: false,
      dados: {
        entrevistaId: entrevista.id,
        atualizadorId: usuarioId,
        atualizadorNome,
      },
    });

    return res.json({
      message: "Entrevista atualizada com sucesso",
      entrevista,
    });
  } catch (error) {
    console.error("Erro ao atualizar entrevista:", error);
    return res.status(500).json({
      message: "Erro ao atualizar entrevista",
      error: error.message,
    });
  }
};
