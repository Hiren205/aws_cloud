const express = require('express');
const pool = require('./db/config');

const app = express();
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Hello from New Lambda!' });
});

// GET /users
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, role, status, created_at
       FROM users
       ORDER BY created_at DESC`
    );
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('❌ Error fetching users:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// GET /products
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, description, price, stock, status, created_at
       FROM products
       ORDER BY created_at DESC`
    );
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows
    });
  } catch (err) {
    console.error('❌ Error fetching products:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

module.exports = app;