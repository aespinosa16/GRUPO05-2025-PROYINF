import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login.jsx";
import Register from "./register.jsx";

// Importamos las 3 páginas de la solicitud
import { SolicitudPaso1 } from "./SolicitudPaso1.jsx";
import { SolicitudPaso2 } from "./SolicitudPaso2.jsx";
import { SolicitudPaso3 } from "./SolicitudPaso3.jsx";

// PASO NUEVO: Importamos el Simulador
import { Simulador } from "./Simulador.jsx";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>

        {/* PASO NUEVO: Añadimos la ruta para el simulador */}
        <Route path="/simulador" element={<Simulador/>}/>

        {/* Rutas de la solicitud */}
        <Route path="/solicitud-paso1" element={<SolicitudPaso1/>}/>
        <Route path="/solicitud-paso2" element={<SolicitudPaso2/>}/>
        <Route path="/solicitud-paso3" element={<SolicitudPaso3/>}/>

        {/* Esta ruta comodín ("*") debe ir SIEMPRE AL FINAL */}
        {/* Ahora, si entras a la app, te mandará al login por defecto */}
        <Route path="*" element={<Navigate to="/login" replace/>}/>
      </Routes>
    </BrowserRouter>
  );
}