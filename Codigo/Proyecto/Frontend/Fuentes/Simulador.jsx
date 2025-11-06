import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importamos Link para el botón
import './global.css'; // Reutilizamos el CSS global

// Esta es la página del Simulador (HU1)
export function Simulador() {
    const [monto, setMonto] = useState(1000000);
    const [plazo, setPlazo] = useState(12);
    
    // Simulación de prototipo (cálculo simple para el demo)
    const interes = 0.05; // 5%
    const costoTotal = monto * (1 + interes);
    const cuota = Math.round(costoTotal / plazo);

    return (
        <div className="container">
            <h1>Simulador de Crédito (HU1)</h1>
            <p>Simula tu monto y plazo para evaluar tu crédito.</p>

            <fieldset>
                <legend>Tu Simulación</legend>
                
                <label htmlFor="monto">Monto a Solicitar:</label><br/>
                <input 
                    type="number" 
                    id="monto" 
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    step="100000"
                />
                <br/><br/>

                <label htmlFor="plazo">Plazo (en meses):</label><br/>
                <input 
                    type="number" 
                    id="plazo" 
                    value={plazo}
                    onChange={(e) => setPlazo(e.target.value)}
                    max="36"
                />
                <br/><br/>
            </fieldset>

            <br/>
            {/* Esto cumple el Criterio 1 de HU1: "muestra el monto de las cuotas..." */}
            <div className="resultados-simulacion" style={{ border: '1px solid #ccc', padding: '10px' }}>
                <h3>Resultados de tu Simulación</h3>
                <p>Cuota Mensual (aprox): <strong>${cuota.toLocaleString('es-CL')}</strong></p>
                <p>Costo Total del Préstamo: <strong>${costoTotal.toLocaleString('es-CL')}</strong></p>
            </div>

            <br/>
            {/* ESTE ES EL BOTÓN MÁGICO - El puente a la HU2 */}
            <Link to="/solicitud-paso1">
                <button style={{ backgroundColor: 'green', color: 'white', padding: '10px 15px' }}>
                    Me gusta, ¡Quiero solicitarlo!
                </button>
            </Link>
        </div>
    );
}