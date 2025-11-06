import React, { useState } from "react";

const THEME = {
  fontFamily:
    "'Inter', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif", //  (tipografía)

  colors: {
    background: "linear-gradient(135deg,#f72585,#b5179e,#7209b7,#560bad,#480ca8,#3a0ca3,#3f37c9,#4361ee,#4895ef,#4cc9f0)", // Fondo general de la página
    panelBg:   "#ffffff",  // Fondo del panel/tarjeta
    text:      "#001435",  // Texto principal
    textMuted: "#6B7280",  // Texto secundario/labels
    border:    "#e5e7eb",  // Borde de paneles/botón secundario
    primary:   "#003087",  // Botón primario y “logo”
    primaryHover: "#252422", // Hover del botón primario
    link:      "#0070ba",  // Color de enlaces
    inputBg:   "#ffffff",  // Fondo del input
    inputBorder: "#d1d5db",// Borde del input (reposo)
    inputFocus:  "#2563eb",// Borde del input (focus)
    divider:   "#e5e7eb",  // Línea divisoria “o”
  },

  
  radius: {
    panel: 16, // Redondeado del panel
    input: 10, // Redondeado de inputs
    button: 28 // Redondeado de botones
  },

  
  shadow: "0 12px 32px rgba(0,0,0,.06)", // Sombra tarjeta

  
  widths: {
    panel: 440,      // Ancho máximo del panel
    inputHeight: 52, // Alto de inputs
    buttonHeight: 48 // Alto de botones
  },

  
  logoEmoji: "🏦", // emoji arriba
};

// 🔗 Backend
const API = import.meta?.env?.VITE_API_URL || "http://localhost:3000";

export default function Login() {
  // Pasos del flujo (1: email, 2: pass, 3: 2FA)
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [codigo2fa, setCodigo2fa] = useState("");
  const [tokenTemporal, setTokenTemporal] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  
  const nextFromEmail = (e) => {
    e.preventDefault();
    setErr("");
    if (!email) return setErr("Ingresa tu email o número móvil.");
    setStep(2);
  };

  
  const submitLogin = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Error al iniciar sesión");

      
      if (data?.requires2fa) {
        setTokenTemporal(data.tokenTemporal);
        setCodigo2fa("");
        setStep(3);
        setLoading(false);
        return;
      }

      
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.usuario));
      alert("Inicio de sesión exitoso (sin 2FA)");
      setLoading(false);
    } catch (error) {
      setErr(error.message);
      setLoading(false);
    }
  };

  
  const submit2FA = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/2fa/verificar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo: codigo2fa, tokenTemporal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Código inválido");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.usuario));
      alert("Verificación 2FA exitosa. Sesión iniciada.");
      setLoading(false);
    } catch (error) {
      setErr(error.message);
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: THEME.colors.background,
        display: "grid",
        placeItems: "center",
        fontFamily: THEME.fontFamily,
        color: THEME.colors.text,
        padding: 16,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: THEME.widths.panel,
          background: THEME.colors.panelBg,
          borderRadius: THEME.radius.panel,
          boxShadow: THEME.shadow,
          padding: 28,
          boxSizing: "border-box",   
          overflow: "hidden",         
        }}
      >
        {/* Logo */}
        <div style={{ display: "grid", placeItems: "center", marginBottom: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              display: "grid",
              placeItems: "center",
              fontSize: 24,
              color: "#fff",
              background: THEME.colors.primary,
              boxShadow: "0 6px 20px rgba(0,0,0,.18)",
            }}
          >
            {THEME.logoEmoji}
          </div>
        </div>

        {

        }
        {step === 1 && (
          <form onSubmit={nextFromEmail} style={{ marginTop: 12 }}>
            <label
              htmlFor="email"
              style={{
                display: "block",
                fontSize: 14,
                color: THEME.colors.textMuted,
                marginBottom: 8,
              }}
            >
              Email o número de móvil
            </label>

            <input
              id="email"
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                height: THEME.widths.inputHeight,
                borderRadius: THEME.radius.input,
                border: `1px solid ${THEME.colors.inputBorder}`,
                background: THEME.colors.inputBg,
                padding: "0 14px",
                outline: "none",
                fontSize: 16,
                boxSizing: "border-box",   
                display: "block",          
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = THEME.colors.inputFocus)
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = THEME.colors.inputBorder)
              }
            />

            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              style={{
                display: "inline-block",
                marginTop: 12,
                color: THEME.colors.link,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              ¿Olvidaste tu email?
            </a>

            {err && (
              <p style={{ color: "#dc2626", fontSize: 14, marginTop: 8 }}>
                {err}
              </p>
            )}

            <button
              type="submit"
              style={{
                marginTop: 16,
                width: "100%",
                height: THEME.widths.buttonHeight,
                borderRadius: THEME.radius.button,
                border: "none",
                background: THEME.colors.primary,
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                boxSizing: "border-box",   
                display: "block",          
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = THEME.colors.primaryHover)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = THEME.colors.primary)
              }
            >
              Siguiente
            </button>

            {

            }
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto 1fr",
                alignItems: "center",
                gap: 12,
                margin: "18px 0 12px",
                color: THEME.colors.textMuted,
                fontSize: 12,
              }}
            >
              <div style={{ height: 1, background: THEME.colors.divider }} />
              <span>o</span>
              <div style={{ height: 1, background: THEME.colors.divider }} />
            </div>

            {}
            <button
              type="button"
              onClick={() => (window.location.href = "/register")}
              style={{
                width: "100%",
                height: THEME.widths.buttonHeight,
                borderRadius: THEME.radius.button,
                border: `1px solid ${THEME.colors.border}`,
                background: "#fff",
                color: THEME.colors.text,
                fontWeight: 700,
                cursor: "pointer",
                boxSizing: "border-box",   
                display: "block",          
              }}
            >
              Crear cuenta
            </button>
          </form>
        )}

        {}
        {step === 2 && (
          <form onSubmit={submitLogin} style={{ marginTop: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
                color: THEME.colors.textMuted,
                fontSize: 14,
              }}
            >
              <button
                type="button"
                onClick={() => setStep(1)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: THEME.colors.link,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                ←
              </button>
              <span>{email}</span>
            </div>

            <label
              htmlFor="pass"
              style={{
                display: "block",
                fontSize: 14,
                color: THEME.colors.textMuted,
                marginBottom: 8,
              }}
            >
              Contraseña
            </label>

            <input
              id="pass"
              type="password"
              placeholder="••••••••"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              style={{
                width: "100%",
                height: THEME.widths.inputHeight,
                borderRadius: THEME.radius.input,
                border: `1px solid ${THEME.colors.inputBorder}`,
                background: THEME.colors.inputBg,
                padding: "0 14px",
                outline: "none",
                fontSize: 16,
                boxSizing: "border-box",  
                display: "block",         
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = THEME.colors.inputFocus)
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = THEME.colors.inputBorder)
              }
            />

            {err && (
              <p style={{ color: "#dc2626", fontSize: 14, marginTop: 8 }}>
                {err}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 16,
                width: "100%",
                height: THEME.widths.buttonHeight,
                borderRadius: THEME.radius.button,
                border: "none",
                background: THEME.colors.primary,
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                opacity: loading ? 0.85 : 1,
                boxSizing: "border-box",  
                display: "block",         
              }}
            >
              {loading ? "Ingresando..." : "Iniciar sesión"}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              style={{
                marginTop: 12,
                width: "100%",
                height: THEME.widths.buttonHeight,
                borderRadius: THEME.radius.button,
                border: `1px solid ${THEME.colors.border}`,
                background: "#fff",
                color: THEME.colors.text,
                fontWeight: 700,
                cursor: "pointer",
                boxSizing: "border-box",  
                display: "block",         
              }}
            >
              Usar otro email
            </button>
          </form>
        )}

        {}
        {step === 3 && (
          <form onSubmit={submit2FA} style={{ marginTop: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
                color: THEME.colors.textMuted,
                fontSize: 14,
              }}
            >
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: THEME.colors.link,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                ←
              </button>
              <span>Código enviado a {email}</span>
            </div>

            <label
              htmlFor="code"
              style={{
                display: "block",
                fontSize: 14,
                color: THEME.colors.textMuted,
                marginBottom: 8,
              }}
            >
              Código de verificación (6 dígitos)
            </label>

            <input
              id="code"
              inputMode="numeric"
              placeholder="123456"
              value={codigo2fa}
              onChange={(e) =>
                setCodigo2fa(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              style={{
                width: "100%",
                height: THEME.widths.inputHeight,
                borderRadius: THEME.radius.input,
                border: `1px solid ${THEME.colors.inputBorder}`,
                background: THEME.colors.inputBg,
                padding: "0 14px",
                outline: "none",
                fontSize: 18,
                letterSpacing: 4,
                boxSizing: "border-box",  
                display: "block",         
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = THEME.colors.inputFocus)
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = THEME.colors.inputBorder)
              }
            />

            {err && (
              <p style={{ color: "#dc2626", fontSize: 14, marginTop: 8 }}>
                {err}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || codigo2fa.length !== 6}
              style={{
                marginTop: 16,
                width: "100%",
                height: THEME.widths.buttonHeight,
                borderRadius: THEME.radius.button,
                border: "none",
                background: THEME.colors.primary,
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
                opacity: loading ? 0.85 : 1,
                boxSizing: "border-box",  
                display: "block",         
              }}
            >
              {loading ? "Verificando..." : "Verificar código"}
            </button>

            <button
              type="button"
              onClick={() => setStep(2)}
              style={{
                marginTop: 12,
                width: "100%",
                height: THEME.widths.buttonHeight,
                borderRadius: THEME.radius.button,
                border: `1px solid ${THEME.colors.border}`,
                background: "#fff",
                color: THEME.colors.text,
                fontWeight: 700,
                cursor: "pointer",
                boxSizing: "border-box",  
                display: "block",         
              }}
            >
              Volver a contraseña
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
