# --- Stage 1: Build & Compilation ---
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install package files first for optimal build caching
COPY package*.json tsconfig.json ./
RUN npm ci

# Copy source tree and compile TypeScript into raw JavaScript
COPY src/ ./src
RUN npm run build

# --- Stage 2: Production Runtime Execution ---
FROM node:20-alpine AS runner
WORKDIR /usr/src/app

# Set production context variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy minimal runtime files and clean production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Pull the compiled JavaScript output from Stage 1 builder
COPY --from=builder /usr/src/app/dist ./dist

# Enforce secure container execution by running as a non-root user
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/healthz').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "dist/app.js"]