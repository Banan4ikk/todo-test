# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --production

# Копируем остальной код
COPY . .

# Указываем порт
EXPOSE 3001

# Команда для запуска приложения
CMD ["node", "index.js"]
