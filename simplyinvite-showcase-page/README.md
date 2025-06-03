# SimplyInvite - Plataforma de Conexão entre Talentos e Empresas

## 📋 Visão Geral do Projeto

SimplyInvite é uma plataforma inovadora que conecta jovens talentos, gestores e profissionais de RH, facilitando o processo de recrutamento através de vídeos de apresentação, projetos e entrevistas. A plataforma oferece uma experiência completa para todos os perfis de usuários, com funcionalidades específicas para cada um.

## 🚀 Início Rápido

### Pré-requisitos

- Docker Desktop
- Node.js (para desenvolvimento local)
- Git

### Executando com Docker (Recomendado)

```bash
# Clone o repositório
git clone <URL_DO_REPOSITÓRIO>
cd simplyinvite-showcase-page

# Inicie os containers
docker-compose up --build
```

Após a execução, acesse:

- Frontend: http://localhost
- PostgreSQL: localhost:5432
  - Usuário: postgres
  - Senha: podtgres
  - Banco: simplyinvite

### Desenvolvimento Local

```bash
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🔑 Credenciais de Desenvolvimento

Para testar a aplicação, use:

| Perfil        | Email              | Senha    |
| ------------- | ------------------ | -------- |
| Jovem Talento | jovem@example.com  | senha123 |
| RH            | rh@example.com     | senha123 |
| Gestor        | gestor@example.com | senha123 |

## 🛠️ Tecnologias

- **Frontend**

  - React
  - TypeScript
  - Vite
  - Tailwind CSS
  - shadcn-ui
  - Lucide Icons
  - date-fns

- **Backend**
  - Node.js
  - Express
  - PostgreSQL
  - Supabase (autenticação)
  - Nodemailer (sistema de e-mails)

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes React reutilizáveis
├── pages/         # Páginas da aplicação
│   ├── talent/    # Páginas específicas para jovens talentos
│   ├── manager/   # Páginas específicas para gestores
│   └── hr/        # Páginas específicas para RH
├── servicos/      # Serviços de API e lógica de negócios
│   ├── api.ts     # Configuração base da API
│   ├── entrevistas.ts # Serviço de gerenciamento de entrevistas
│   ├── jovem.ts   # Serviços específicos para jovens
│   ├── gestor.ts  # Serviços específicos para gestores
│   └── rh.ts      # Serviços específicos para RH
├── contexts/      # Contextos React (AuthContext, etc.)
├── hooks/         # Hooks personalizados
└── utils/         # Funções utilitárias
```

## ✨ Funcionalidades Principais

### Para Jovens Talentos

- Criação de perfil completo com informações acadêmicas e profissionais
- Envio de vídeos de apresentação
- Submissão de projetos para avaliação
- Visualização de feedbacks de gestores e RH
- Agendamento e gerenciamento de entrevistas
- Recebimento de notificações por e-mail com possibilidade de resposta direta

### Para Gestores

- Avaliação de perfis e projetos de jovens talentos
- Fornecimento de feedback detalhado
- Agendamento de entrevistas
- Sistema de medalhas para classificação de talentos

### Para RH

- Gestão de processos seletivos
- Avaliação preliminar de candidatos
- Acompanhamento de feedback dos gestores
- Organização de entrevistas

## 🔄 Atualizações Recentes

### Sistema de Entrevistas

- Correção de URLs da API para agendamento de entrevistas
- Implementação de armazenamento local (localStorage) como fallback quando a API falha
- Melhoria no tratamento de erros e logs para depuração
- Adição de notificações em tempo real para novas entrevistas agendadas

### Página de Convites do Jovem

- Melhorias na exibição de entrevistas agendadas
- Implementação de recuperação de dados do localStorage quando a API não está disponível
- Adição de logs detalhados para facilitar a depuração
- Melhoria na interface do usuário para melhor experiência

### Sistema de Feedback

- Implementação de visualização completa de feedbacks na página de submissões
- Organização de feedbacks usando componente Accordion para melhor visualização
- Separação clara entre feedbacks de gestores e de RH
- Melhoria na apresentação visual das medalhas recebidas

### Sistema de Comunicação

- Implementação de sistema de e-mail para notificações importantes
- Possibilidade de resposta direta por e-mail sem necessidade de acessar a plataforma
- Tokens de segurança para validação de respostas
- Templates responsivos para e-mails em formato HTML e texto

## 🚨 Solução de Problemas

### Problemas Comuns

1. **Porta 80 em uso**

   - Verifique se não há outro serviço usando a porta 80
   - Altere a porta no docker-compose.yml se necessário

2. **Porta 5432 em uso**

   - Verifique se não há outra instância do PostgreSQL rodando
   - Altere a porta no docker-compose.yml se necessário

3. **Erro de permissão**

   - Execute o Docker Desktop como administrador
   - Verifique as permissões das pastas do projeto

4. **Problemas com entrevistas não aparecendo**
   - Verifique o localStorage do navegador
   - Limpe o cache e recarregue a página

## 📝 Notas de Produção

Para ambiente de produção:

1. Configure as variáveis de ambiente:

   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima do seu projeto Supabase
   - `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`: Configurações do servidor SMTP

2. Ajuste as configurações de segurança no `nginx.conf`

3. Configure backups regulares do banco de dados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato através do e-mail: suporte@simplyinvite.com
