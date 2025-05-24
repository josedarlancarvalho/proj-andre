FROM node:20-alpine

WORKDIR /usr/src/app

# Instalar netcat para o wait-for-it.sh
RUN apk add --no-cache netcat-openbsd

# Copiar arquivos de dependência
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código-fonte e wait-for-it.sh
COPY . .
COPY wait-for-it.sh ./
RUN chmod +x wait-for-it.sh

# Expor a porta da aplicação
EXPOSE 8080

# Comando para iniciar a aplicação
CMD ["./wait-for-it.sh", "postgres", "--", "npm", "start"] 