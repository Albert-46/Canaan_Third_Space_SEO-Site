# PostgreSQL Migration Report

## 1. Files Changed
- **`server/index.ts`**: Updated to import PostgreSQL functions (`insertEnquiry`, `runMigrations`, `checkDbHealth`). Changed endpoint handlers to `async`/`await`. Added startup block that runs migrations before listening on port 3001.
- **`server/db.ts`**: Completely rewritten. Removed `node:sqlite`. Implemented PostgreSQL connection pool, `runMigrations` (which tracks runs in `_migrations`), and `checkDbHealth`.
- **`server/package.json`**: Added `pg` and `@types/pg`. Removed Node 24 restriction (PostgreSQL works fine on Node 20+).
- **`server/Dockerfile`**: Removed all instructions regarding SQLite persistent volumes. Replaced with `DATABASE_URL` instructions. Added steps to copy the `migrations/` directory to the final image.
- **`.env.example` / `.env`**: Swapped `DB_PATH` for `DATABASE_URL`.
- **`README.md`**: Updated documentation to reflect the requirement for a PostgreSQL database.
- **`src/config.ts`**: Updated internal developer comments.

## 2. PostgreSQL Driver Selected
The official `pg` (node-postgres) driver was selected. It provides a robust connection pool and parameterized query support.

## 3. PostgreSQL Schema Created
Schema aligns perfectly with the old SQLite schema but using PostgreSQL idiomatic types:
- `id`: `BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY`
- `consent`: `BOOLEAN` (instead of 0/1 integers)
- `created_at`: `TIMESTAMPTZ DEFAULT NOW()`
- All other text fields remain `TEXT`.

## 4. Migration Files Created
- **`server/migrations/001_create_enquiries.sql`**: The safe `CREATE TABLE IF NOT EXISTS` script that the API server executes automatically on startup.
- **`server/scripts/migrate-sqlite-to-pg.ts`**: The one-time data extraction script.

## 5. SQLite Data Status
- **Real data exists**. 4 rows were identified in `data/enquiries.db`. Two were realistic development records and two were system-readiness test records.

## 6. Number of Records Migrated
- **0 (Pending)**: The migration script is fully written and ready to transfer the 4 rows, but it requires PostgreSQL to be running. Since Docker Desktop is currently stopped on your machine, it could not execute. Run `cd server && npx ts-node scripts/migrate-sqlite-to-pg.ts` once your database is up.

## 7. API Changes
- **No changes to the contract**. `POST /api/enquiries` accepts and returns the exact same JSON format as before. The frontend remains entirely unaware of the database swap.

## 8. SMTP Status
- Unchanged. Nodemailer continues to use the existing `SMTP_*` variables. The database transaction must succeed before the email is attempted, exactly as instructed.

## 9. Environment Variables Required
The only change is swapping `DB_PATH` for `DATABASE_URL`.
```env
PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=thirdspacecarehome@gmail.com
SMTP_PASS=...
SMTP_FROM=...
ENQUIRY_TO_EMAIL=...
```
*(No backend secrets are exposed to Astro `PUBLIC_` variables).*

## 10. Docker Changes
The Express server Dockerfile (`server/Dockerfile`) now expects a stateless filesystem. The `VOLUME ["/data"]` directive was removed. It now expects `DATABASE_URL` at runtime.

## 11. Local PostgreSQL Setup Instructions
A `docker-compose.yml` was added to the project root.
To start a local development database:
```bash
docker-compose up -d
```
This spins up PostgreSQL 15 on port 5432 with the credentials configured in `.env` (defaults to `canaan_user` / `canaan_dev_pass`).

## 12. Build Results
- `cd server && npm run build`: **Success**. The TypeScript compilation for the Express API passes cleanly.
- Frontend Astro Build: **Unchanged/Success**. The static frontend builds perfectly using the default `PUBLIC_API_BASE_URL`.

## 13. Test Results
- Compilation: Passed
- Server startup: Automatically executes migrations and binds port (verified code execution up to the DB connection point).
- Full local end-to-end verification (POST to DB): **Blocked**.

## 14. Remaining Blockers
> [!WARNING]
> Docker Desktop is currently stopped on your Windows machine, so `docker-compose up -d` failed.
> 
> **Do not claim production readiness until:**
> 1. You start Docker Desktop.
> 2. Run `docker-compose up -d`.
> 3. Start the Express server (`cd server && npm start`).
> 4. Run the data migration script (`npx ts-node scripts/migrate-sqlite-to-pg.ts`).
> 5. Make a real POST test from the Astro frontend to verify the end-to-end flow.
