import React from 'react';
import { useNavigate } from 'react-router-dom';
import './global.css';

export function SolicitudPaso2() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Prototipo: no validamos si subió algo, solo pasamos al paso final
        navigate('/solicitud-paso3');
    };

    return (
        <div className="main-page">
            <div className="main-panel">

                <h1>Paso 2: Carga de Documentos</h1>
                <p>Para validar tu solicitud, necesitamos los siguientes documentos.</p>

                <form onSubmit={handleSubmit}>
                    <fieldset style={{ marginTop: "20px" }}>
                        <legend>Documentos Requeridos</legend>

                        {/* Bloque de Cédula (carnet) */}
                        <label htmlFor="cedula">Cédula de Identidad (ambos lados):</label>
                        <input
                            type="file"
                            id="cedula"
                            name="cedula"
                            accept=".pdf, .jpg, .png"
                            style={{ width: "100%" }}
                        />

                        <br /><br />

                        {/* Bloque de Liquidaciones */}
                        <label htmlFor="liquidaciones">Últimas 3 Liquidaciones de Sueldo:</label>
                        <input
                            type="file"
                            id="liquidaciones"
                            name="liquidaciones"
                            accept=".pdf, .jpg, .png"
                            style={{ width: "100%" }}
                        />

                        <br /><br />
                    </fieldset>

                    <div className="simulador-button-wrapper" style={{ marginTop: "20px" }}>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: "green",
                                color: "white",
                                padding: "10px 15px",
                                borderRadius: "6px",
                                border: "none"
                            }}
                        >
                            Enviar Solicitud
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
