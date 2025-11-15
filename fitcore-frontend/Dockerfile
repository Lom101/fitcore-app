# 1. Stage: build
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 2. Stage: production
FROM nginx:alpine

# Vite создаёт папку dist
COPY --from=build /app/dist /usr/share/nginx/html

# Настройка nginx для SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
