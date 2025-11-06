import React from 'react';
import { Link } from 'react-router-dom'; // Importamos Link para el botón de "Volver"
import './global.css'; // Reutilizamos el CSS global

export function SolicitudPaso3() {
    // Generamos un número de solicitud falso para el prototipo
    // Esto cumple el Criterio 3: "muestra una confirmación... con el número de solicitud"
    const numeroSolicitud = Math.floor(Math.random() * (99999 - 10000) + 10000);

    return (
        <div className="container" style={{ textAlign: 'center', paddingTop: '50px' }}>
            <h1 style={{ color: 'green' }}>✅ ¡Solicitud Enviada con Éxito!</h1>
            <p>Hemos recibido tu solicitud y la estamos revisando.</p>
            
            <h3>Tu número de solicitud es el:</h3>
            <h2>#S-{numeroSolicitud}</h2>
            
            <br/>
            {/* Este <Link> nos permite volver al inicio */}
            <Link to="/">Volver al Inicio</Link>
        </div>
    );
}