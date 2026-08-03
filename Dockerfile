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
ENV PORT=3001

COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/server/dist ./dist
COPY --from=builder /app/client/dist ../client/dist

RUN mkdir -p data

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/api/health > /dev/null || exit 1

CMD ["node", "dist/index.js"]
