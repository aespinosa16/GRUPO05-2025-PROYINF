import React, { useState } from "react";

const THEME = {
  fontFamily:
    "'Inter', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  colors: {
    background: "linear-gradient(135deg,#f72585,#b5179e,#7209b7,#560bad,#480ca8,#3a0ca3,#3f37c9,#4361ee,#4895ef,#4cc9f0)",
    panelBg: "#ffffff",
    text: "#001435",
    textMuted: "#6B7280",
    border: "#e5e7eb",
    primary: "#003087",
    primaryHover: "#012a72",
    link: "#0070ba",
    inputBg: "#ffffff",
    inputBorder: "#d1d5db",
    inputFocus: "#2563eb",
    divider: "#e5e7eb",
    success: "#16a34a",
  },
  radius: { panel: 16, input: 10, button: 28 },
  shadow: "0 12px 32px rgba(0,0,0,.06)",
  widths: { panel: 520, inputHeight: 52, buttonHeight: 48 },
  logoEmoji: "📝",
};

const API = import.meta?.env?.VITE_API_URL || "http://localhost:3000";

export default function Register() {
  const [form, setForm] = useState({
    nombre: "",
    numero: "",
    email: "",
    contrasena: "",
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [okMsg, setOkMsg] = useState("");

  const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setOkMsg("");

    if (!form.email || !form.contrasena) {
      setErr("Email y contraseña son obligatorios.");
      return;
    }
    if (form.contrasena.length < 6) {
      setErr("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo registrar");

      setOkMsg("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
      setLoading(false);
    } catch (e) {
      setErr(e.message);
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
        }}
      >
        {}
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
              boxShadow: "0 6px 20px rgba(0,48,135,.25)",
            }}
          >
            {THEME.logoEmoji}
          </div>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
          Crear cuenta
        </h1>
        <p style={{ color: THEME.colors.textMuted, marginBottom: 14 }}>
          Completa tus datos para registrarte.
        </p>

        <form onSubmit={onSubmit} style={{ marginTop: 8 }}>
          <div style={{ display: "grid", gap: 12 }}>
            {}
            <div>
              <label
                htmlFor="nombre"
                style={{
                  display: "block",
                  fontSize: 14,
                  color: THEME.colors.textMuted,
                  marginBottom: 8,
                }}
              >
                Nombre
              </label>
              <input
                id="nombre"
                placeholder="Tu nombre"
                value={form.nombre}
                onChange={(e) => onChange("nombre", e.target.value)}
                style={inputStyle()}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = THEME.colors.inputFocus)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = THEME.colors.inputBorder)
                }
              />
            </div>

            {}
            <div>
              <label
                htmlFor="numero"
                style={{
                  display: "block",
                  fontSize: 14,
                  color: THEME.colors.textMuted,
                  marginBottom: 8,
                }}
              >
                Teléfono (opcional)
              </label>
              <input
                id="numero"
                placeholder="+56912345678"
                value={form.numero}
                onChange={(e) => onChange("numero", e.target.value)}
                style={inputStyle()}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = THEME.colors.inputFocus)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = THEME.colors.inputBorder)
                }
              />
            </div>

            {}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  fontSize: 14,
                  color: THEME.colors.textMuted,
                  marginBottom: 8,
                }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
                style={inputStyle()}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = THEME.colors.inputFocus)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = THEME.colors.inputBorder)
                }
                required
              />
            </div>

            {}
            <div>
              <label
                htmlFor="pass"
                style={{
                  display: "block",
                  fontSize: 14,
                  color: THEME.colors.textMuted,
                  marginBottom: 8,
                }}
              >
                Contraseña (mínimo 6 caracteres)
              </label>
              <input
                id="pass"
                type="password"
                placeholder="••••••••"
                value={form.contrasena}
                onChange={(e) => onChange("contrasena", e.target.value)}
                style={inputStyle()}
                onFocus={(e) =>
                  (e.currentTarget.style.borderColor = THEME.colors.inputFocus)
                }
                onBlur={(e) =>
                  (e.currentTarget.style.borderColor = THEME.colors.inputBorder)
                }
                required
                minLength={6}
              />
            </div>
          </div>

          {}
          {err && (
            <p style={{ color: "#dc2626", fontSize: 14, marginTop: 12 }}>{err}</p>
          )}
          {okMsg && (
            <p style={{ color: THEME.colors.success, fontSize: 14, marginTop: 12 }}>
              {okMsg}
            </p>
          )}

          {}
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
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = THEME.colors.primaryHover)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = THEME.colors.primary)
            }
          >
            {loading ? "Creando..." : "Crear cuenta"}
          </button>

          <button
            type="button"
            onClick={() => {
              history.back();
            }}
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
            }}
          >
            Volver a iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

function inputStyle() {
  return {
    width: "100%",
    height: THEME.widths.inputHeight,
    borderRadius: THEME.radius.input,
    border: `1px solid ${THEME.colors.inputBorder}`,
    background: THEME.colors.inputBg,
    padding: "0 14px",
    outline: "none",
    fontSize: 16,
  };
}
