const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

// Gerar token único para identificar respostas de e-mail
const gerarTokenResposta = (tipo, entidadeId, usuarioId) => {
  const dados = `${tipo}-${entidadeId}-${usuarioId}-${Date.now()}`;
  return crypto.createHash("md5").update(dados).digest("hex");
};

// Configuração do transportador de e-mail
// Para desenvolvimento, usamos um serviço de teste (ethereal.email)
// Em produção, seria substituído por um serviço real como Gmail, SendGrid, etc.
const createTransporter = async () => {
  // Em ambiente de desenvolvimento, criar uma conta de teste
  if (process.env.NODE_ENV !== "production") {
    // Gerar conta de teste do Ethereal
    const testAccount = await nodemailer.createTestAccount();

    // Criar um transportador SMTP reutilizável usando a conta de teste
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true para 465, false para outras portas
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    // Configuração para ambiente de produção
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_SECURE === "true",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
};

// Função para enviar e-mail de feedback
const sendFeedbackEmail = async (destinatario, dados) => {
  try {
    const transporter = await createTransporter();

    // Gerar token de resposta
    const tokenResposta = gerarTokenResposta(
      "feedback",
      dados.projetoId,
      dados.jovemId
    );

    // URL para resposta direta
    const appUrl = process.env.APP_URL || "http://localhost:5173";
    const respostaUrl = `${appUrl}/respostas/feedback/${tokenResposta}`;

    // Template do e-mail para feedback
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333;">Novo Feedback no SimplyInvite</h1>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="color: #4a5568; margin-top: 0;">Olá ${
            dados.nomeJovem || "Jovem Talento"
          },</h2>
          <p style="color: #4a5568;">Você recebeu um novo feedback para seu projeto "${
            dados.tituloProjeto
          }".</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #4a5568;">Feedback de ${
            dados.nomeGestor || "Gestor"
          }</h3>
          <p style="background-color: #f3f4f6; padding: 15px; border-left: 4px solid #3b82f6; margin: 10px 0; color: #4b5563;">${
            dados.comentario
          }</p>
          
          ${
            dados.oportunidade
              ? `
          <div style="background-color: #ecfdf5; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h4 style="color: #065f46; margin-top: 0;">Oportunidade Disponível</h4>
            <p style="color: #065f46;"><strong>Tipo:</strong> ${dados.oportunidade.tipo}</p>
            <p style="color: #065f46;"><strong>Descrição:</strong> ${dados.oportunidade.descricao}</p>
          </div>
          `
              : ""
          }
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #4a5568;">Responder ao Feedback</h3>
          <p style="color: #4a5568;">Você pode responder diretamente a este feedback:</p>
          <div style="border: 1px solid #e5e7eb; border-radius: 5px; padding: 15px; margin-top: 10px;">
            <form action="${respostaUrl}" method="POST">
              <textarea name="resposta" style="width: 100%; min-height: 100px; padding: 10px; border: 1px solid #d1d5db; border-radius: 5px; margin-bottom: 10px;" placeholder="Escreva sua resposta aqui..."></textarea>
              <input type="hidden" name="token" value="${tokenResposta}">
              <button type="submit" style="background-color: #3b82f6; color: white; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer;">Enviar Resposta</button>
            </form>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${
            dados.linkProjeto
          }" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Feedback Completo</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #6b7280; font-size: 12px;">
          <p>Você também pode responder a este e-mail diretamente.</p>
          <p>Sua mensagem será encaminhada para o gestor que enviou o feedback.</p>
        </div>
      </div>
    `;

    // Enviar e-mail
    const info = await transporter.sendMail({
      from: '"SimplyInvite" <noreply@simplyinvite.com>',
      to: destinatario,
      subject: `Novo feedback para seu projeto: ${dados.tituloProjeto}`,
      html: emailHTML,
      // Versão texto para clientes de e-mail que não suportam HTML
      text: `Olá ${
        dados.nomeJovem || "Jovem Talento"
      },\n\nVocê recebeu um novo feedback para seu projeto "${
        dados.tituloProjeto
      }".\n\nFeedback de ${dados.nomeGestor || "Gestor"}:\n${
        dados.comentario
      }\n\n${
        dados.oportunidade
          ? `Oportunidade Disponível:\nTipo: ${dados.oportunidade.tipo}\nDescrição: ${dados.oportunidade.descricao}\n\n`
          : ""
      }Para responder, acesse: ${respostaUrl}\n\nOu para ver o feedback completo, acesse: ${
        dados.linkProjeto
      }\n\nEquipe SimplyInvite`,
      // Adicionar cabeçalhos personalizados para rastreamento
      headers: {
        "X-SimplyInvite-Token": tokenResposta,
        "X-SimplyInvite-Type": "feedback",
        "Reply-To": `resposta+${tokenResposta}@simplyinvite.com`,
      },
    });

    console.log("E-mail enviado: %s", info.messageId);

    // Em ambiente de desenvolvimento, mostrar a URL de visualização
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "URL de visualização: %s",
        nodemailer.getTestMessageUrl(info)
      );
    }

    return {
      success: true,
      messageId: info.messageId,
      tokenResposta,
    };
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return { success: false, error: error.message };
  }
};

// Função para enviar e-mail de notificação de entrevista
const sendEntrevistaEmail = async (destinatario, dados) => {
  try {
    const transporter = await createTransporter();

    // Gerar token de resposta
    const tokenResposta = gerarTokenResposta(
      "entrevista",
      dados.entrevistaId,
      dados.jovemId
    );

    // URL para resposta direta
    const appUrl = process.env.APP_URL || "http://localhost:5173";
    const respostaUrl = `${appUrl}/respostas/entrevista/${tokenResposta}`;

    // Template do e-mail para entrevista
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #333;">Nova Entrevista Agendada</h1>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
          <h2 style="color: #4a5568; margin-top: 0;">Olá ${
            dados.nomeJovem || "Jovem Talento"
          },</h2>
          <p style="color: #4a5568;">Uma nova entrevista foi agendada para você com a empresa ${
            dados.empresa || "Empresa"
          }.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #4a5568;">Detalhes da Entrevista</h3>
          
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Data:</strong> ${dados.data}</p>
            <p style="margin: 5px 0;"><strong>Hora:</strong> ${dados.hora}</p>
            <p style="margin: 5px 0;"><strong>Tipo:</strong> ${
              dados.tipo === "online" ? "Online" : "Presencial"
            }</p>
            
            ${
              dados.tipo === "online" && dados.link
                ? `
            <p style="margin: 5px 0;"><strong>Link:</strong> <a href="${dados.link}" style="color: #3b82f6;">${dados.link}</a></p>
            `
                : ""
            }
            
            ${
              dados.tipo === "presencial" && dados.local
                ? `
            <p style="margin: 5px 0;"><strong>Local:</strong> ${dados.local}</p>
            `
                : ""
            }
            
            ${
              dados.observacoes
                ? `
            <p style="margin: 10px 0 5px;"><strong>Observações:</strong></p>
            <p style="margin: 5px 0;">${dados.observacoes}</p>
            `
                : ""
            }
          </div>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #4a5568;">Responder sobre a Entrevista</h3>
          <p style="color: #4a5568;">Confirme sua presença ou envie uma mensagem ao recrutador:</p>
          <div style="border: 1px solid #e5e7eb; border-radius: 5px; padding: 15px; margin-top: 10px;">
            <form action="${respostaUrl}" method="POST">
              <textarea name="resposta" style="width: 100%; min-height: 100px; padding: 10px; border: 1px solid #d1d5db; border-radius: 5px; margin-bottom: 10px;" placeholder="Escreva sua resposta aqui..."></textarea>
              <input type="hidden" name="token" value="${tokenResposta}">
              <div style="display: flex; gap: 10px;">
                <button type="submit" name="confirmacao" value="confirmar" style="background-color: #10b981; color: white; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer;">Confirmar Presença</button>
                <button type="submit" style="background-color: #3b82f6; color: white; padding: 8px 16px; border: none; border-radius: 5px; cursor: pointer;">Enviar Mensagem</button>
              </div>
            </form>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${
            dados.linkEntrevista
          }" style="background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Ver Detalhes da Entrevista</a>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #6b7280; font-size: 12px;">
          <p>Você também pode responder a este e-mail diretamente.</p>
          <p>Sua mensagem será encaminhada para o recrutador que agendou a entrevista.</p>
        </div>
      </div>
    `;

    // Enviar e-mail
    const info = await transporter.sendMail({
      from: '"SimplyInvite" <noreply@simplyinvite.com>',
      to: destinatario,
      subject: `Entrevista Agendada: ${dados.empresa || "Empresa"} - ${
        dados.data
      } às ${dados.hora}`,
      html: emailHTML,
      text: `Olá ${
        dados.nomeJovem || "Jovem Talento"
      },\n\nUma nova entrevista foi agendada para você com a empresa ${
        dados.empresa || "Empresa"
      }.\n\nDetalhes da Entrevista:\nData: ${dados.data}\nHora: ${
        dados.hora
      }\nTipo: ${dados.tipo === "online" ? "Online" : "Presencial"}\n${
        dados.tipo === "online" && dados.link ? `Link: ${dados.link}\n` : ""
      }${
        dados.tipo === "presencial" && dados.local
          ? `Local: ${dados.local}\n`
          : ""
      }${
        dados.observacoes ? `\nObservações:\n${dados.observacoes}\n` : ""
      }\n\nPara responder sobre a entrevista, acesse: ${respostaUrl}\n\nPara ver os detalhes completos, acesse: ${
        dados.linkEntrevista
      }\n\nEquipe SimplyInvite`,
      // Adicionar cabeçalhos personalizados para rastreamento
      headers: {
        "X-SimplyInvite-Token": tokenResposta,
        "X-SimplyInvite-Type": "entrevista",
        "Reply-To": `resposta+${tokenResposta}@simplyinvite.com`,
      },
    });

    console.log("E-mail enviado: %s", info.messageId);

    // Em ambiente de desenvolvimento, mostrar a URL de visualização
    if (process.env.NODE_ENV !== "production") {
      console.log(
        "URL de visualização: %s",
        nodemailer.getTestMessageUrl(info)
      );
    }

    return {
      success: true,
      messageId: info.messageId,
      tokenResposta,
    };
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendFeedbackEmail,
  sendEntrevistaEmail,
};
