
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../db");
const { enviarCorreo } = require("../utils/mailer");

const router = express.Router();

const firmarToken = (payload, opts = {}) =>
  jwt.sign(payload, process.env.JWT_SECRET || "dev-secret", {
    expiresIn: opts.expiresIn || process.env.JWT_EXPIRES || "2h",
  });

const generarOTP = () => String(Math.floor(100000 + Math.random() * 900000)); 


router.post("/register", async (req, res) => {
  try {
    const { email, contrasena, numero, nombre } = req.body || {};

    if (!email || !contrasena) {
      return res.status(400).json({ error: "Debe proporcionar email y contraseña." });
    }
    if (String(contrasena).length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres." });
    }

    const hash = await bcrypt.hash(contrasena, 12);

    await pool.query(
      "INSERT INTO usuarios (email, contrasena_hash, numero, nombre) VALUES ($1,$2,$3,$4)",
      [email.toLowerCase(), hash, numero || null, nombre || null]
    );

    return res.status(201).json({ mensaje: "Usuario registrado con éxito. Por favor, inicie sesión." });
  } catch (err) {
    if (err?.code === "23505") {
      return res.status(400).json({ error: `El correo '${req.body?.email}' ya está en uso.` });
    }
    console.error("[REGISTER] Error:", err.message);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, contrasena } = req.body || {};
    if (!email || !contrasena) {
      return res.status(401).json({ error: "Credenciales inválidas. Por favor, intente nuevamente." });
    }

    const { rows } = await pool.query(
      "SELECT id, email, contrasena_hash, nombre, dos_pasos_habilitado FROM usuarios WHERE email=$1",
      [email.toLowerCase()]
    );
    const usuario = rows[0];
    if (!usuario) {
      return res.status(401).json({ error: "Credenciales inválidas. Por favor, intente nuevamente." });
    }

    const ok = await bcrypt.compare(contrasena, usuario.contrasena_hash);
    if (!ok) {
      return res.status(401).json({ error: "Credenciales inválidas. Por favor, intente nuevamente." });
    }

    
    if (!usuario.dos_pasos_habilitado) {
      const token = firmarToken({ sub: usuario.id, email: usuario.email });
      return res.json({
        mensaje: "Inicio de sesión exitoso",
        token,
        usuario: { nombre: usuario.nombre || null, email: usuario.email }
      });
    }

    
    const codigo = generarOTP();
    const codigoHash = await bcrypt.hash(codigo, 10);
    const expira = new Date(Date.now() + 5 * 60 * 1000); 

    
    await pool.query("DELETE FROM codigos_verificacion WHERE usuario_id=$1 AND usado_en IS NULL", [usuario.id]);

    await pool.query(
      "INSERT INTO codigos_verificacion (usuario_id, codigo_hash, expira_en) VALUES ($1,$2,$3)",
      [usuario.id, codigoHash, expira]
    );

    
    await enviarCorreo({
      para: usuario.email,
      asunto: "Tu código de verificación",
      texto: `Tu código es: ${codigo} (válido por 5 minutos)`,
    });

    
    const tokenTemporal = firmarToken(
      { sub: usuario.id, email: usuario.email, etapa: "2fa" },
      { expiresIn: "5m" }
    );

    return res.json({
      mensaje: "Código enviado. Revisa tu correo (o la consola en desarrollo).",
      requires2fa: true,
      tokenTemporal
    });
  } catch (err) {
    console.error("[LOGIN] Error:", err.message);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
});


router.post("/2fa/verificar", async (req, res) => {
  try {
    const { codigo, tokenTemporal } = req.body || {};
    if (!codigo || !tokenTemporal) {
      return res.status(400).json({ error: "Faltan parámetros." });
    }

    let payload;
    try {
      payload = jwt.verify(tokenTemporal, process.env.JWT_SECRET || "dev-secret");
      if (payload.etapa !== "2fa") throw new Error("etapa");
    } catch {
      return res.status(401).json({ error: "Token temporal inválido o expirado." });
    }

    const { rows } = await pool.query(
      "SELECT id, email, nombre FROM usuarios WHERE id=$1",
      [payload.sub]
    );
    const usuario = rows[0];
    if (!usuario) return res.status(401).json({ error: "No autorizado." });

    
    const { rows: r2 } = await pool.query(
      `SELECT id, codigo_hash, expira_en, usado_en
         FROM codigos_verificacion
        WHERE usuario_id=$1
        ORDER BY creado_en DESC
        LIMIT 1`,
      [usuario.id]
    );
    const registro = r2[0];
    if (!registro) return res.status(401).json({ error: "No hay código activo. Inicie sesión nuevamente." });
    if (registro.usado_en) return res.status(401).json({ error: "Código ya utilizado." });
    if (new Date(registro.expira_en).getTime() < Date.now()) {
      return res.status(401).json({ error: "Código expirado. Inicie sesión nuevamente." });
    }

    const ok = await bcrypt.compare(String(codigo), registro.codigo_hash || "");
    if (!ok) return res.status(401).json({ error: "Código incorrecto." });

    
    await pool.query(
      "UPDATE codigos_verificacion SET usado_en=now() WHERE id=$1",
      [registro.id]
    );

    
    const token = firmarToken({ sub: usuario.id, email: usuario.email });
    return res.json({
      mensaje: "Verificación en dos pasos exitosa",
      token,
      usuario: { nombre: usuario.nombre || null, email: usuario.email }
    });
  } catch (err) {
    console.error("[2FA VERIFICAR] Error:", err.message);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
});

module.exports = router;
