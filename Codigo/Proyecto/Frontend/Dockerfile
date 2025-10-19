FROM node:20-alpine
WORKDIR /app

# Copiamos solo manifestos primero
COPY package*.json ./

# Si hay lock, usa 'npm ci'; si no, 'npm install'
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# Ahora el resto del código
COPY . .

EXPOSE 5173
CMD ["npm","run","dev","--","--host","0.0.0.0","--port","5173"]