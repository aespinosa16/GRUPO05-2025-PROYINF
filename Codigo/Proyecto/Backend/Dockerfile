FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production || npm install --only=production

COPY . .

EXPOSE 3000

CMD ["sh", "-c", "npx wait-port ${DB_HOST:-postgres_db}:${DB_PORT:-5432} && npm start"]