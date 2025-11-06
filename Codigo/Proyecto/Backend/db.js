
const { Pool } = require("pg");

const config = {
  host: process.env.DB_HOST || "db",              
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || "appuser",
  password: process.env.DB_PASSWORD || process.env.DB_PASSW || "",
  database: process.env.DB_NAME || "appdb",
  
};

const pool = new Pool(config);


pool.query("SELECT 1").then(() => {
  console.log("[DB] Conectado a Postgres:", {
    host: config.host,
    port: config.port,
    user: config.user,
    db: config.database,
  });
}).catch((err) => {
  console.error("[DB] Error de conexión:", err.message);
});

module.exports = { pool };
