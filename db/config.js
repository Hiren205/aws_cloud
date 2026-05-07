const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     parseInt(process.env.DB_PORT) || 5432,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false   // required for AWS RDS
  },
  max: 2,                       // keep low for Lambda
  connectionTimeoutMillis: 5000,
});

module.exports = pool;