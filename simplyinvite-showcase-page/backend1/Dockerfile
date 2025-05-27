FROM node:20-alpine

WORKDIR /usr/src/app

# Instalar netcat para o wait-for-it.sh (pode remover se não for usar o script)
# RUN apk add --no-cache netcat-openbsd

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código-fonte
COPY . .

# Expor a porta da aplicação
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["npm", "start"]