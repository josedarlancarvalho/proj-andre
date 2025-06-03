# Backend Node.js para SimplyInvite

API REST desenvolvida com Node.js, Express e PostgreSQL para suportar a plataforma SimplyInvite.

## Pré-requisitos

- Node.js (v14+)
- PostgreSQL
- Docker (opcional)

## Configuração

1. Copie o arquivo `env.example` para `.env`

   ```
   cp env.example .env
   ```

2. Ajuste as variáveis de ambiente no arquivo `.env` conforme necessário, incluindo:
   - Configurações do banco de dados
   - Configurações de e-mail (SMTP)
   - URL da aplicação frontend

## Instalação

```bash
# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Iniciar em modo desenvolvimento
npm run dev

# Iniciar em modo produção
npm start
```

## Usando Docker

O projeto já vem com uma configuração Docker pronta.

```bash
# Na raiz do projeto (parent)
docker-compose up -d
```

## Estrutura da API

### Autenticação

- `POST /api/auth/login` - Login de usuário
- `GET /api/auth/me` - Dados do usuário autenticado

### Usuários

- `GET /api/usuarios` - Listar todos os usuários
- `GET /api/usuarios/:id` - Buscar usuário por ID
- `POST /api/usuarios` - Criar novo usuário
- `PUT /api/usuarios/:id` - Atualizar usuário
- `DELETE /api/usuarios/:id` - Remover usuário
- `GET /api/usuarios/:id/perfil` - Buscar perfil completo de um usuário
- `PUT /api/usuarios/me/onboarding` - Completar onboarding do usuário autenticado

### Empresas

- `GET /api/empresas` - Listar todas as empresas
- `GET /api/empresas/:id` - Buscar empresa por ID
- `POST /api/empresas` - Criar nova empresa
- `PUT /api/empresas/:id` - Atualizar empresa
- `DELETE /api/empresas/:id` - Remover empresa

### Entrevistas

- `GET /api/entrevistas` - Listar todas as entrevistas
- `GET /api/jovem/entrevistas` - Listar entrevistas do jovem autenticado
- `GET /api/gestor/entrevistas` - Listar entrevistas agendadas pelo gestor
- `POST /api/entrevistas/agendar/:talentoId` - Agendar nova entrevista
- `PUT /api/entrevistas/:id` - Atualizar entrevista existente
- `PUT /api/entrevistas/:id/cancelar` - Cancelar entrevista
- `GET /api/entrevistas/:id` - Buscar detalhes de uma entrevista

### Projetos e Avaliações

- `GET /api/jovem/projetos` - Listar projetos do jovem autenticado
- `POST /api/jovem/projetos` - Submeter novo projeto
- `GET /api/gestor/avaliacoes` - Listar avaliações feitas pelo gestor
- `POST /api/gestor/avaliar/:projetoId` - Avaliar projeto com medalha e feedback
- `GET /api/jovem/projetos/:id/feedback` - Buscar feedback de um projeto específico

### Sistema de E-mail

- `POST /api/email/enviar` - Enviar e-mail de notificação
- `POST /api/email/resposta/:token` - Processar resposta recebida por e-mail
- `GET /api/email/confirmar/:token` - Página de confirmação após resposta

## Recursos Adicionais

### Sistema de Armazenamento Local

O backend implementa um sistema de fallback que permite o funcionamento offline da aplicação. Quando a API não está disponível:

1. Os dados são armazenados localmente no navegador
2. São sincronizados automaticamente quando a conexão é restabelecida
3. Garantem a continuidade da experiência do usuário

### Sistema de Notificações

O sistema de notificações foi implementado para:

1. Alertar sobre novas entrevistas agendadas
2. Informar sobre feedbacks recebidos
3. Notificar sobre alterações em agendamentos

### Segurança

- Autenticação JWT
- Validação de tokens para respostas por e-mail
- Proteção contra CSRF
- Sanitização de inputs

## Documentação Adicional

Para mais detalhes sobre o sistema de e-mail, consulte o arquivo [email-system.md](./docs/email-system.md).
