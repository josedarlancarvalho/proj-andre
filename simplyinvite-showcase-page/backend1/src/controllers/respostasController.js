const db = require("../models");
const crypto = require("crypto");

// Decodificar token de resposta
const decodificarToken = (token) => {
  try {
    // Em uma implementação real, você armazenaria os tokens no banco de dados
    // e verificaria sua validade. Aqui usamos uma abordagem simplificada.

    // O formato do token é um hash MD5 de: tipo-entidadeId-usuarioId-timestamp
    // Como não podemos reverter o hash, precisamos verificar se o token é válido
    // consultando os registros no banco de dados

    return { valid: true }; // Simulação de validação de token
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return { valid: false };
  }
};

// Processar resposta via e-mail
exports.processarRespostaEmail = async (req, res) => {
  try {
    const { token, resposta, tipo, confirmacao } = req.body;

    // Verificar token
    const tokenInfo = decodificarToken(token);
    if (!tokenInfo.valid) {
      return res.status(400).json({ message: "Token inválido ou expirado" });
    }

    // Em uma implementação real, você recuperaria as informações
    // associadas ao token do banco de dados

    // Simular dados extraídos do token (em produção viriam do banco)
    const entidadeId = parseInt(req.params.entidadeId);
    const usuarioId = parseInt(req.params.usuarioId);

    // Verificar se o usuário existe
    const usuario = await db.Usuario.findByPk(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    if (tipo === "feedback") {
      // Processar resposta a feedback
      const feedback = await db.Feedback.findByPk(entidadeId);
      if (!feedback) {
        return res.status(404).json({ message: "Feedback não encontrado" });
      }

      // Criar uma mensagem de resposta
      const mensagem = await db.Mensagem.create({
        remetente: usuarioId,
        destinatario: feedback.gestorId,
        conteudo: resposta,
        referenciaId: entidadeId,
        tipoReferencia: "feedback",
      });

      // Criar notificação para o gestor
      await db.Notificacao.create({
        usuarioId: feedback.gestorId,
        tipo: "resposta_feedback",
        conteudo: `${usuario.nomeCompleto} respondeu ao seu feedback.`,
        lida: false,
        dados: {
          feedbackId: feedback.id,
          mensagemId: mensagem.id,
          usuarioId: usuarioId,
          usuarioNome: usuario.nomeCompleto,
        },
      });

      return res.status(201).json({
        message: "Resposta ao feedback enviada com sucesso",
        mensagem,
      });
    } else if (tipo === "entrevista") {
      // Processar resposta a entrevista
      const entrevista = await db.Entrevista.findByPk(entidadeId);
      if (!entrevista) {
        return res.status(404).json({ message: "Entrevista não encontrada" });
      }

      // Se for uma confirmação de presença
      if (confirmacao === "confirmar") {
        // Atualizar status da entrevista
        await entrevista.update({ statusCandidato: "confirmado" });

        // Conteúdo da mensagem de confirmação
        const conteudoMensagem = "Confirmo minha presença na entrevista.";

        // Criar mensagem
        const mensagem = await db.Mensagem.create({
          remetente: usuarioId,
          destinatario: entrevista.gestorId,
          conteudo: conteudoMensagem,
          referenciaId: entidadeId,
          tipoReferencia: "entrevista",
        });

        // Criar notificação para o gestor
        await db.Notificacao.create({
          usuarioId: entrevista.gestorId,
          tipo: "confirmacao_entrevista",
          conteudo: `${usuario.nomeCompleto} confirmou presença na entrevista.`,
          lida: false,
          dados: {
            entrevistaId: entrevista.id,
            mensagemId: mensagem.id,
            usuarioId: usuarioId,
            usuarioNome: usuario.nomeCompleto,
          },
        });

        return res.status(200).json({
          message: "Presença confirmada com sucesso",
          entrevista,
        });
      }

      // Criar uma mensagem de resposta
      const mensagem = await db.Mensagem.create({
        remetente: usuarioId,
        destinatario: entrevista.gestorId,
        conteudo: resposta,
        referenciaId: entidadeId,
        tipoReferencia: "entrevista",
      });

      // Criar notificação para o gestor
      await db.Notificacao.create({
        usuarioId: entrevista.gestorId,
        tipo: "resposta_entrevista",
        conteudo: `${usuario.nomeCompleto} respondeu sobre a entrevista agendada.`,
        lida: false,
        dados: {
          entrevistaId: entrevista.id,
          mensagemId: mensagem.id,
          usuarioId: usuarioId,
          usuarioNome: usuario.nomeCompleto,
        },
      });

      return res.status(201).json({
        message: "Resposta à entrevista enviada com sucesso",
        mensagem,
      });
    }

    return res.status(400).json({ message: "Tipo de resposta inválido" });
  } catch (error) {
    console.error("Erro ao processar resposta de e-mail:", error);
    return res.status(500).json({
      message: "Erro ao processar resposta",
      error: error.message,
    });
  }
};

// Processar resposta de feedback
exports.processarRespostaFeedback = async (req, res) => {
  try {
    const { token } = req.params;
    const { resposta } = req.body;

    // Em uma implementação real, você buscaria os dados associados ao token
    // de um banco de dados onde foram armazenados quando o e-mail foi enviado

    // Aqui estamos simulando uma resposta bem-sucedida para fins de demonstração
    return res.status(200).render("resposta-sucesso", {
      mensagem:
        "Sua resposta foi enviada com sucesso! O gestor receberá sua mensagem.",
      tipo: "feedback",
    });
  } catch (error) {
    console.error("Erro ao processar resposta de feedback:", error);
    return res.status(500).render("resposta-erro", {
      mensagem:
        "Ocorreu um erro ao processar sua resposta. Por favor, tente novamente mais tarde.",
    });
  }
};

// Processar resposta de entrevista
exports.processarRespostaEntrevista = async (req, res) => {
  try {
    const { token } = req.params;
    const { resposta, confirmacao } = req.body;

    // Em uma implementação real, você buscaria os dados associados ao token
    // de um banco de dados onde foram armazenados quando o e-mail foi enviado

    // Aqui estamos simulando uma resposta bem-sucedida para fins de demonstração
    const mensagem =
      confirmacao === "confirmar"
        ? "Sua presença na entrevista foi confirmada com sucesso!"
        : "Sua resposta foi enviada com sucesso! O recrutador receberá sua mensagem.";

    return res.status(200).render("resposta-sucesso", {
      mensagem,
      tipo: "entrevista",
    });
  } catch (error) {
    console.error("Erro ao processar resposta de entrevista:", error);
    return res.status(500).render("resposta-erro", {
      mensagem:
        "Ocorreu um erro ao processar sua resposta. Por favor, tente novamente mais tarde.",
    });
  }
};
