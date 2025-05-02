# Backend for Micro-Manage Messenger
# Node.js + Express + Socket.IO + Prisma + PostgreSQL + AWS S3

FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm", "run", "start"]
