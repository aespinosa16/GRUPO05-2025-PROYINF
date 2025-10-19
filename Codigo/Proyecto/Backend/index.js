// Backend/index.js (CJS)
const express = require("express");
const cors = require("cors");
const pool = require("./db.js");                 // ← SIN llaves
const simulateRouter = require("./rutas/simulador.js"); // ← SIN llaves

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

// Health
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "api", ts: new Date().toISOString() });
});

// DB check
app.get("/db", async (_req, res) => {
  try {
    const r = await pool.query("SELECT NOW() AS now");
    res.json({ ok: true, now: r.rows[0].now });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

// Simulador
app.use("/simulate", simulateRouter);

// (Opcional) Mensajes si los tienes
// app.get("/messages", ...)
// app.post("/messages", ...)
// app.delete("/messages/:id", ...)

app.listen(PORT, () => {
  console.log("API on", PORT);
});
