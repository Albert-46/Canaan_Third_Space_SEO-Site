-- ============================================================
-- Migration 001 — Create enquiries table
-- Canaan Third Space Senior Care Home — Enquiry API
-- ============================================================
--
-- Safe to run repeatedly: CREATE TABLE IF NOT EXISTS
-- Never uses DROP TABLE.
-- Never destroys existing data.
--
-- Schema mirrors the original SQLite schema exactly, with
-- PostgreSQL-idiomatic types:
--   INTEGER AUTOINCREMENT → BIGINT GENERATED ALWAYS AS IDENTITY
--   TEXT (datetime)       → TIMESTAMPTZ
--   INTEGER (consent 0/1) → BOOLEAN
--

CREATE TABLE IF NOT EXISTS enquiries (
  id                BIGINT       GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name              TEXT         NOT NULL,
  email             TEXT         NOT NULL,
  phone             TEXT,
  enquiry_type      TEXT,
  preferred_contact TEXT,
  message           TEXT         NOT NULL,
  consent           BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Migrations tracking table ─────────────────────────────────────────────────
-- Created by the migration runner the first time it executes.
-- Listed here for documentation purposes only.
-- The runner creates it before executing any migration file.
