import React, { useEffect, useState, useMemo } from "react";

/* ======== UI simple reutilizable ======== */
const Page = ({ children }) => (
  <div style={{ minHeight: "100vh", background: "#0b0f19", color: "#e5e7eb" }}>
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px" }}>{children}</div>
  </div>
);
const Card = ({ children, style }) => (
  <div style={{
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 16, padding: 16, ...style
  }}>{children}</div>
);
const Button = ({ children, kind = "primary", ...props }) => {
  const theme = {
    primary: { bg: "#3b82f6", hover: "#2563eb", color: "#fff" },
    ghost: { bg: "transparent", hover: "rgba(255,255,255,0.06)", color: "#e5e7eb", border: "1px solid rgba(255,255,255,0.12)" }
  }[kind];
  return (
    <button {...props}
      style={{
        padding: "10px 14px", borderRadius: 12, border: theme.border ?? "none",
        background: theme.bg, color: theme.color, fontWeight: 600, cursor: "pointer"
      }}
      onMouseEnter={e => e.currentTarget.style.background = theme.hover}
      onMouseLeave={e => e.currentTarget.style.background = theme.bg}
    >{children}</button>
  );
};
const Input = (props) => (
  <input {...props} style={{
    width: "100%", padding: "10px 12px", borderRadius: 12,
    background: "rgba(255,255,255,0.05)", color: "#e5e7eb",
    border: "1px solid rgba(255,255,255,0.12)", outline: "none"
  }}/>
);
const Select = (props) => (
  <select {...props} style={{
    padding: "10px 12px", borderRadius: 12,
    background: "rgba(255,255,255,0.05)", color: "#e5e7eb",
    border: "1px solid rgba(255,255,255,0.12)", outline: "none",
    width: "100%"
  }}/>
);
const Table = ({ columns, rows, empty }) => (
  <div style={{ overflow: "hidden", borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)" }}>
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead style={{ background: "rgba(255,255,255,0.04)" }}>
        <tr>
          {columns.map((c) => (
            <th key={c.key} style={{ textAlign: c.align ?? "left", padding: 12, fontSize: 13, color: "#9ca3af" }}>{c.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr><td colSpan={columns.length} style={{ padding: 16, color: "#9ca3af" }}>{empty ?? "Sin registros"}</td></tr>
        ) : rows.map((row, i) => (
          <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            {columns.map((c) => (
              <td key={c.key} style={{ padding: 12, fontSize: 14, color: "#e5e7eb" }}>{row[c.key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ======== Navegación ======== */
const linkStyle = { padding: "8px 10px", borderRadius: 10, textDecoration: "none", color: "#cbd5e1", border: "1px solid rgba(255,255,255,0.1)" };
const Nav = ({ authed }) => (
  <nav style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
    {!authed ? (
      <a href="#/" style={linkStyle}>Login</a>
    ) : (
      <>
        <a href="#/home" style={linkStyle}>Inicio</a>
        <a href="#/simulador" style={linkStyle}>Simulador</a>
        <a href="#/solicitud" style={linkStyle}>Estado de solicitud</a>
        <a href="#/cuenta" style={linkStyle}>Configurar cuenta</a>
      </>
    )}
  </nav>
);
function useHashRoute() {
  const get = () => (typeof window !== "undefined" ? window.location.hash.slice(1) || "/" : "/");
  const [route, setRoute] = useState(get());
  useEffect(() => {
    const onHash = () => setRoute(get());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const navigate = (to) => { window.location.hash = to; };
  return { route, navigate };
}

/* ======== Login e Inicio ======== */
const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ email: "", pass: "" });
  return (
    <Card style={{ maxWidth: 420, margin: "40px auto" }}>
      <h1 style={{ marginTop: 0 }}>Ingreso</h1>
      <label style={{ fontSize: 13, color: "#9ca3af" }}>Email</label>
      <Input type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
      <div style={{ height: 10 }}/>
      <label style={{ fontSize: 13, color: "#9ca3af" }}>Contraseña</label>
      <Input type="password" value={form.pass} onChange={e=>setForm(f=>({...f,pass:e.target.value}))}/>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <Button onClick={()=>onLogin(form)}>Ingresar</Button>
        <Button kind="ghost" onClick={()=>setForm({email:"", pass:""})}>Limpiar</Button>
      </div>
      <p style={{ color: "#9ca3af", fontSize: 12, marginTop: 10 }}>Este login no valida credenciales.</p>
    </Card>
  );
};
const Home = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginTop: 10 }}>
    <OptionCard title="Simulador de Préstamo" to="#/simulador" desc="Calcula cuotas y tabla de amortización."/>
    <OptionCard title="Estado de solicitud" to="#/solicitud" desc="Consulta el estado de tu solicitud."/>
    <OptionCard title="Configurar cuenta" to="#/cuenta" desc="Preferencias y seguridad."/>
  </div>
);
const OptionCard = ({ title, desc, to }) => (
  <Card>
    <h2 style={{ marginTop: 0 }}>{title}</h2>
    <p style={{ color: "#9ca3af", marginTop: 6 }}>{desc}</p>
    <Button onClick={()=>{ window.location.hash = to; }}>Ir</Button>
  </Card>
);

/* ======== Simulador conectado al backend ======== */
const apiBase = (import.meta.env.VITE_API_URL ?? "http://localhost:3000").replace(/\/$/, "");
const Simulador = () => {
  const [form, setForm] = useState({
    principal: 10000000, months: 60, rateAnnual: 0.18,
    rateType: "TNA", system: "frances",
    monthlyExtra: 0, upfrontFee: 0,
    prepaymentMonth: "", prepaymentAmount: ""
  });
  const [sim, setSim] = useState(null);
  const [error, setError] = useState("");

  const simulate = async () => {
    setError("");
    try {
      const payload = {
        principal: Number(form.principal),
        months: Number(form.months),
        rateAnnual: Number(form.rateAnnual),
        rateType: form.rateType,
        system: form.system,
        monthlyExtra: Number(form.monthlyExtra || 0),
        upfrontFee: Number(form.upfrontFee || 0),
        prepayment: (form.prepaymentMonth && form.prepaymentAmount)
          ? { month: Number(form.prepaymentMonth), amount: Number(form.prepaymentAmount) }
          : null
      };
      const r = await fetch(`${apiBase}/simulate`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload)
      });
      if (!r.ok) throw new Error(await r.text());
      const data = await r.json();
      setSim(data);
    } catch (e) { setError(String(e)); }
  };

  return (
    <Card>
      <h2 style={{ marginTop: 0 }}>Simulador de Préstamo</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
        <Input type="number" step="1000" value={form.principal} onChange={e=>setForm(f=>({...f, principal:e.target.value}))} placeholder="Monto (P)" />
        <Input type="number" value={form.months} onChange={e=>setForm(f=>({...f, months:e.target.value}))} placeholder="Plazo (meses)" />
        <Input type="number" step="0.001" value={form.rateAnnual} onChange={e=>setForm(f=>({...f, rateAnnual:e.target.value}))} placeholder="Tasa anual (0.18=18%)" />
        <Select value={form.rateType} onChange={e=>setForm(f=>({...f, rateType:e.target.value}))}>
          <option value="TNA">TNA</option>
          <option value="TEA">TEA</option>
        </Select>
        <Select value={form.system} onChange={e=>setForm(f=>({...f, system:e.target.value}))}>
          <option value="frances">Francés (cuota fija)</option>
          <option value="aleman">Alemán (amort. fija)</option>
          <option value="bullet">Bullet</option>
        </Select>
        <Input type="number" step="100" value={form.monthlyExtra} onChange={e=>setForm(f=>({...f, monthlyExtra:e.target.value}))} placeholder="Extra mensual" />
        <Input type="number" step="100" value={form.upfrontFee} onChange={e=>setForm(f=>({...f, upfrontFee:e.target.value}))} placeholder="Comisión inicial" />
        <Input type="number" value={form.prepaymentMonth} onChange={e=>setForm(f=>({...f, prepaymentMonth:e.target.value}))} placeholder="Mes prepago (opcional)" />
        <Input type="number" step="1000" value={form.prepaymentAmount} onChange={e=>setForm(f=>({...f, prepaymentAmount:e.target.value}))} placeholder="Monto prepago" />
      </div>
      <div style={{ marginTop: 12 }}>
        <Button onClick={simulate}>Simular</Button>
      </div>
      {error && <p style={{ color: "#ef4444", marginTop: 8 }}>{error}</p>}
      {sim && (
        <div style={{ marginTop: 16 }}>
          <p>Tasa mensual: <b>{(sim.rateMonthly*100).toFixed(3)}%</b></p>
          {sim.cuotaBase && <p>Cuota base: <b>${sim.cuotaBase.toLocaleString()}</b></p>}
          <p>Interés total: <b>${sim.totals.interes.toLocaleString()}</b> · Extras: <b>${sim.totals.extras.toLocaleString()}</b></p>
          <Table
            columns={[
              { key:"month", header:"Mes" },
              { key:"saldoInicial", header:"Saldo Inicial" },
              { key:"interes", header:"Interés" },
              { key:"amortizacion", header:"Amortización" },
              { key:"extra", header:"Extra" },
              { key:"cuota", header:"Cuota" },
              { key:"saldoFinal", header:"Saldo Final" },
            ]}
            rows={sim.schedule}
            empty="Sin filas"
          />
        </div>
      )}
    </Card>
  );
};

/* ======== Otros placeholders ======== */
const EstadoSolicitud = () => <Card><h2>Estado de solicitud</h2><p>Pantalla en construcción.</p></Card>;
const ConfigCuenta = () => <Card><h2>Configurar cuenta</h2><p>Pantalla en construcción.</p></Card>;

/* ======== App principal ======== */
export default function App() {
  const { route, navigate } = useHashRoute();
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    if (!authed && route !== "/") navigate("/");
    if (authed && (route === "/" || route === "")) navigate("/home");
  }, [authed, route]);

  return (
    <Page>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0 }}>Prestamo de consumo digitales</h1>
          <p style={{ color: "#9ca3af", margin: "6px 0 0" }}>Login ficticio, navegación, simulador conectado.</p>
        </div>
        <Nav authed={authed} />
      </header>

      <div style={{ height: 16 }} />

      {!authed ? (
        <Login onLogin={() => { setAuthed(true); navigate("/home"); }} />
      ) : (
        <>
          {route === "/home" && <Home />}
          {route === "/simulador" && <Simulador />}
          {route === "/solicitud" && <EstadoSolicitud />}
          {route === "/cuenta" && <ConfigCuenta />}
        </>
      )}

      <footer style={{ marginTop: 28, textAlign: "center", color: "#9ca3af", fontSize: 12 }}>
      </footer>
    </Page>
  );
}
