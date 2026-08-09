FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json client/package-lock.json ./client/
COPY server/package.json server/package-lock.json ./server/

RUN npm run install:all

COPY client ./client
COPY server ./server

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app/server

ENV NODE_ENV=production

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/client/dist ../client/dist

RUN mkdir -p data

EXPOSE 8080

CMD ["node", "dist/index.js"]
