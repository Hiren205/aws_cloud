-- ─────────────────────────────────────────
-- Migration 002: Create products table
-- ─────────────────────────────────────────

CREATE TYPE product_status AS ENUM ('active', 'inactive', 'out_of_stock');

CREATE TABLE IF NOT EXISTS products (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(200)  NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  stock       INTEGER       NOT NULL DEFAULT 0,
  status      product_status NOT NULL DEFAULT 'active',
  created_by  UUID          REFERENCES users(id) ON DELETE SET NULL,
  created_at  TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Index for fast filtering
CREATE INDEX idx_products_status     ON products(status);
CREATE INDEX idx_products_created_by ON products(created_by);