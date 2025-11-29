import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './global.css';

export function Simulador() {
    const [monto, setMonto] = useState(1000000);
    const [plazo, setPlazo] = useState(12);

    const interes = 0.05;
    const costoTotal = monto * (1 + interes);
    const cuota = Math.round(costoTotal / plazo);

    return (
        <div className="main-page">

            {/* Main reusable panel */}
            <div className="main-panel">

                <h1>Simulador de Crédito (HU1)</h1>
                <p>Simula tu monto y plazo para evaluar tu crédito.</p>

                <fieldset style={{ marginTop: "20px" }}>
                    <legend>Tu Simulación</legend>

                    <label htmlFor="monto">Monto a Solicitar:</label>
                    <input
                        type="number"
                        id="monto"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        step="100000"
                        style={{ width: "100%" }}
                    />

                    <br /><br />

                    <label htmlFor="plazo">Plazo (en meses):</label>
                    <input
                        type="number"
                        id="plazo"
                        value={plazo}
                        onChange={(e) => setPlazo(e.target.value)}
                        max="36"
                        style={{ width: "100%" }}
                    />
                </fieldset>

                <div className="simulador-resultados">
                    <h3>Resultados de tu Simulación</h3>
                    <p>
                        Cuota Mensual (aprox):{" "}
                        <strong>${cuota.toLocaleString("es-CL")}</strong>
                    </p>
                    <p>
                        Costo Total del Préstamo:{" "}
                        <strong>${costoTotal.toLocaleString("es-CL")}</strong>
                    </p>
                </div>

                <div className="simulador-button-wrapper">
                    <Link to="/solicitud-paso1">
                        <button
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                padding: "10px 15px",
                                borderRadius: "6px",
                                border: "none"
                            }}
                        >
                            Me gusta, ¡Quiero solicitarlo!
                        </button>
                    </Link>
                </div>

            </div>
        </div>
    );
}
