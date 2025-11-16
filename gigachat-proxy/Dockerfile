# Используем официальный Node.js образ
FROM node:20-alpine

# Рабочая директория
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --production

# Копируем весь код
COPY . .

# Экспортируем порт
EXPOSE 5000

# Команда запуска
CMD ["node", "index.js"]
