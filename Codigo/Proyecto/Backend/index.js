
require("dotenv").config();
const express = require("express");
const cors = require("cors");

if (!process.env.DB_PASSWORD && process.env.DB_PASSW) {
  process.env.DB_PASSWORD = process.env.DB_PASSW;
}

const app = express();

app.use(cors());                  
app.use(express.json());          
app.set("trust proxy", true);     


let pool;
try {
  
  ({ pool } = require("./db"));

  
  pool.query("SELECT 1")
    .then(() => {
      console.log("[DB] Conectado a Postgres ");
    })
    .catch((err) => {
      console.error("[DB] Error de conexión :", err.message);
    });
} catch (e) {
  console.error("[DB] No se pudo cargar ./db:", e.message);
}

app.get("/health", async (_, res) => {
  try {
    if (pool) await pool.query("SELECT 1");
    return res.json({ ok: true });
  } catch {
    return res.status(500).json({ ok: false });
  }
});


const authRouter = require("./rutas/auth");
app.use("/api/auth", authRouter);

const { enviarCorreo } = require("./utils/mailer");

app.get("/api/test-email", async (req, res) => {
  try {
    await enviarCorreo({
      para: process.env.MAIL_USER, 
      asunto: "Prueba de envío",
      texto: "¡Correo de prueba enviado correctamente desde tu backend !",
    });
    res.json({ ok: true, mensaje: "Correo enviado correctamente" });
  } catch (err) {
    console.error("[TEST MAIL] Error:", err.message);
    res.status(500).json({ ok: false, error: err.message });
  }
});


app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});


app.use((err, req, res, next) => {
  console.error("[ERROR]", err);
  res.status(500).json({ error: "Error interno del servidor." });
});


const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT} 🚀`);
});


process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
