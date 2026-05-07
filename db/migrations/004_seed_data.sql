-- ─────────────────────────────────────────
-- Migration 004: Seed initial data
-- ─────────────────────────────────────────

-- Insert admin user
-- Password is hashed (bcrypt of 'Admin@123')
INSERT INTO users (name, email, password, role, status)
VALUES (
  'Super Admin',
  'admin@example.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
  'admin',
  'active'
)
ON CONFLICT (email) DO NOTHING;   -- skip if already exists

-- Insert sample manager
INSERT INTO users (name, email, password, role, status)
VALUES (
  'Manager One',
  'manager@example.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
  'manager',
  'active'
)
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, stock, status)
VALUES
  ('Product Alpha',   'First sample product',   19.99, 100, 'active'),
  ('Product Beta',    'Second sample product',  49.99,  50, 'active'),
  ('Product Gamma',   'Third sample product',   99.99,  25, 'active'),
  ('Product Delta',   'Out of stock product',    9.99,   0, 'out_of_stock')
ON CONFLICT DO NOTHING;