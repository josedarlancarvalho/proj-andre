# Backend Node.js para Simply Invite

API REST desenvolvida com Node.js, Express e PostgreSQL.

## Pré-requisitos

- Node.js (v14+)
- PostgreSQL
- Docker (opcional)

## Configuração

1. Copie o arquivo `env.example` para `.env`
   ```
   cp env.example .env
   ```

2. Ajuste as variáveis de ambiente no arquivo `.env` conforme necessário

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