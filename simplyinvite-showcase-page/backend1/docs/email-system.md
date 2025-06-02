# Sistema de E-mail do SimplyInvite

Este documento descreve o sistema de comunicação por e-mail implementado no SimplyInvite para melhorar a experiência do usuário, permitindo respostas diretas a feedbacks e entrevistas.

## Visão Geral

O sistema de e-mail permite:

1. Enviar notificações por e-mail para jovens talentos quando:

   - Recebem um feedback de um gestor
   - Têm uma entrevista agendada

2. Os jovens podem responder diretamente pelo e-mail, sem precisar acessar a plataforma.

## Arquitetura

O sistema é composto por:

1. **Serviço de E-mail**: Utiliza Nodemailer para enviar e-mails formatados.
2. **Sistema de Tokens**: Gera tokens únicos para identificar respostas.
3. **Rotas de Resposta**: Processam as respostas recebidas via e-mail.
4. **Templates EJS**: Fornecem feedback visual após o processamento das respostas.

## Funcionamento

### Envio de E-mails

1. Quando um gestor envia um feedback ou agenda uma entrevista, o sistema gera um e-mail com:

   - Detalhes do feedback/entrevista
   - Formulário de resposta incorporado
   - Token único para identificação

2. O e-mail contém:
   - Cabeçalhos especiais para rastreamento (`X-SimplyInvite-Token`, `Reply-To`)
   - Versão HTML com formulário interativo
   - Versão texto para clientes que não suportam HTML

### Processamento de Respostas

1. O jovem pode responder:

   - Preenchendo o formulário no próprio e-mail
   - Respondendo diretamente ao e-mail (utilizando o endereço Reply-To)
   - Clicando no link e preenchendo o formulário na plataforma

2. A resposta é processada pelo servidor:
   - O token é validado
   - A mensagem é salva no banco de dados
   - Uma notificação é criada para o gestor/recrutador
   - O jovem recebe uma página de confirmação

## Configuração

Para configurar o sistema de e-mail:

1. Variáveis de ambiente necessárias:

   ```
   NODE_ENV=development       # ou production
   APP_URL=http://localhost:5173

   # Em produção:
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_password
   ```

2. Em ambiente de desenvolvimento:
   - O sistema usa [Ethereal Email](https://ethereal.email/) para teste
   - Os e-mails não são realmente enviados, mas podem ser visualizados no console

## Segurança

O sistema implementa as seguintes medidas de segurança:

1. Tokens criptografados para validar respostas
2. Validação de usuários antes de processar respostas
3. Proteção contra ataques de falsificação de solicitações

## Limitações na Implementação Atual

1. Não existe persistência de tokens no banco de dados (implementação simplificada)
2. Não há processo para receber respostas por e-mail (requer configuração de servidor SMTP de recebimento)

## Melhorias Futuras

1. Implementar persistência de tokens no banco de dados
2. Configurar servidor para receber respostas por e-mail
3. Adicionar rastreamento de abertura de e-mails
4. Implementar sistema de assinaturas e preferências de comunicação
