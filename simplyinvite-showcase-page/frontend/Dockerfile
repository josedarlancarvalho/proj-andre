# Estágio de build
FROM node:20-alpine as builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./


# Instalar dependências
RUN npm install

# Copiar o resto do código
COPY . .

# Build da aplicação
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copiar configuração do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build da aplicação
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Comando para iniciar o nginx
CMD ["nginx", "-g", "daemon off;"] 