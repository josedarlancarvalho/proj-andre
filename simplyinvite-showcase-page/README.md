# SimplyInvite - Plataforma de Conexão entre Talentos e Empresas

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
  - Senha: jonas1385
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

- **Backend**
  - PostgreSQL
  - Supabase (autenticação)

## 📁 Estrutura do Projeto

```
src/
├── components/     # Componentes React reutilizáveis
├── pages/         # Páginas da aplicação
├── backend/       # Lógica do backend
│   ├── auth/      # Serviços de autenticação
│   ├── database/  # Configuração do banco de dados
│   ├── services/  # Serviços específicos por perfil
│   ├── types/     # Tipos e interfaces
│   └── utils/     # Funções utilitárias
├── contexts/      # Contextos React
└── hooks/         # Hooks personalizados
```

## 🔧 Comandos Úteis

```bash
# Ver logs dos containers
docker-compose logs

# Subir todos os containers em segundo plano
docker-compose up -d

# Subir todos os containers e reconstruir as imagens
docker-compose up --build

# Parar todos os containers
docker-compose down

# Parar containers e remover volumes
docker-compose down -v

# Reiniciar um serviço específico
docker-compose restart frontend
docker-compose restart postgres

# Ver os containers em execução
docker ps

# Criar uma nova imagem de um Dockerfile
docker build -t nome-da-imagem .

# Rodar um container a partir de uma imagem
docker run -d -p 80:80 nome-da-imagem

# Entrar no terminal de um container em execução
docker exec -it nome-do-container /bin/bash

# Parar um container específico
docker stop nome-do-container

# Remover um container específico
docker rm nome-do-container

```

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

## 📝 Notas de Produção

Para ambiente de produção:

1. Configure as variáveis de ambiente:

   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima do seu projeto Supabase

2. Ajuste as configurações de segurança no `nginx.conf`

3. Configure backups regulares do banco de dados

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
