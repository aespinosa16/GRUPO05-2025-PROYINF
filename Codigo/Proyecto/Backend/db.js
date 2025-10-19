const { Pool } = require('pg');

// Toma credenciales desde variables de entorno (compose)
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  max: 10,
  idleTimeoutMillis: 5000,
});

module.exports = pool;