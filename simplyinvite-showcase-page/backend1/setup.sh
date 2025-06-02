#!/bin/bash

echo "Configurando o SimplyInvite com sistema de e-mail..."

# Instalar dependências
echo "Instalando dependências..."
npm install

# Criar diretório de views se não existir
echo "Verificando diretório de views..."
mkdir -p src/views

# Criar arquivo .env se não existir
if [ ! -f .env ]; then
  echo "Criando arquivo .env com configurações padrão..."
  cat > .env << EOF
PORT=3001
JWT_SECRET=simplyinvite_secret_key
NODE_ENV=development
APP_URL=http://localhost:5173
# Configurações de e-mail (quando em produção)
# EMAIL_HOST=smtp.example.com
# EMAIL_PORT=587
# EMAIL_SECURE=false
# EMAIL_USER=your_email@example.com
# EMAIL_PASS=your_password
EOF
fi

echo "Configuração concluída!"
echo "Para iniciar o servidor em modo de desenvolvimento, execute: npm run dev"
echo "Para iniciar o servidor em produção, execute: npm start" 