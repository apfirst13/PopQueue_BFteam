# ==============================================================================
# PopQueue — Backend Dockerfile for local Docker Compose (server + migrate)
# ==============================================================================
# Used by docker-compose.yml (`server` and `migrate` services).
# Cloud Run uses the unified root `Dockerfile`.
# ==============================================================================

FROM node:24-alpine
WORKDIR /app

# Prisma requires openssl on alpine
RUN apk add --no-cache openssl

# Install dependencies (cached until package*.json changes)
COPY package*.json ./
RUN npm ci

# Generate Prisma client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy source and build TypeScript -> dist/
COPY tsconfig*.json ./
COPY src ./src/
COPY docker-entrypoint.sh ./docker-entrypoint.sh

RUN npm run build && sed -i 's/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

# Runtime settings
ENV NODE_ENV=production
ENV TZ=Asia/Bangkok
ENV PORT=3000
EXPOSE 3000

# Run as non-root user
USER node

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/index.js"]
