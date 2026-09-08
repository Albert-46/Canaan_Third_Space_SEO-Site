# ============================================================
# Canaan Third Space — Enquiry API Server
# ============================================================
#
# Multi-stage build:
#   Stage 1 (builder) — installs ALL deps and compiles TypeScript
#   Stage 2 (runtime) — installs production deps only, copies compiled JS
#
# Node 24+ is used as per project requirements.
#
# ── DATABASE CONNECTION ──────────────────────────────────────
# This image uses PostgreSQL.
# The database connection string must be provided at runtime via
# the DATABASE_URL environment variable.
#
# ── ENVIRONMENT VARIABLES ────────────────────────────────────
# Required at runtime (set via platform secrets, NOT in this file):
#   PORT              (default 3001)
#   DATABASE_URL      PostgreSQL connection string
#   SMTP_HOST
#   SMTP_PORT
#   SMTP_SECURE
#   SMTP_USER
#   SMTP_PASS
#   SMTP_FROM
#   ENQUIRY_TO_EMAIL
#
# ── BUILD ────────────────────────────────────────────────────
#   docker build -t canaan-enquiry-server -f server/Dockerfile server/
#
# ── RUN ──────────────────────────────────────────────────────
#   docker run -p 3001:3001 \
#     -e PORT=3001 \
#     -e DATABASE_URL=postgresql://user:pass@host:5432/dbname \
#     -e SMTP_HOST=smtp.gmail.com \
#     ... \
#     canaan-enquiry-server
# ============================================================

# ── Stage 1: Build ───────────────────────────────────────────
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files and install ALL dependencies (including devDependencies for tsc)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and compile
COPY tsconfig.json ./
COPY *.ts ./
# Migrations directory is needed by the runtime
COPY migrations/ ./migrations/
RUN npm run build


# ── Stage 2: Runtime ─────────────────────────────────────────
FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

# Copy package files and install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist
# Copy SQL migrations (needed for schema initialization)
COPY --from=builder /app/migrations ./migrations

EXPOSE 3001

# Start the compiled server directly (prestart build step not needed in container)
CMD ["node", "dist/index.js"]
