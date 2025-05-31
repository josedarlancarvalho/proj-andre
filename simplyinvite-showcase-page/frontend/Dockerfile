# Estágio de build
FROM node:20-alpine as builder

WORKDIR /app

# Copiar apenas package.json para instalar dependências
COPY package.json ./

# Remover package-lock.json e node_modules para forçar reinstalação limpa
RUN rm -f package-lock.json && rm -rf node_modules

# Instalar dependências (gerará um novo package-lock.json compatível com Alpine)
RUN npm install

# Copiar o restante do código, incluindo o novo package-lock.json gerado
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