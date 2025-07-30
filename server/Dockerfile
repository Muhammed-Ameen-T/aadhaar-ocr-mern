# Production image
FROM node:22-alpine AS base

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Optional: Use PM2 for process management
RUN npm install -g pm2

EXPOSE 3000

CMD ["pm2-runtime", "index.js"]
