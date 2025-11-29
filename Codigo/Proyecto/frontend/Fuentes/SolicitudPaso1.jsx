import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './global.css';

export function SolicitudPaso1() {
    const navigate = useNavigate();
    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');
    const [renta, setRenta] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!rut || !nombre || !renta) {
            setError('Todos los campos son obligatorios.');
            return;
        }

        navigate('/solicitud-paso2');
    };

    return (
        <div className="main-page">
            <div className="main-panel">

                <h1>Paso 1: Completa tus Datos</h1>
                <p>Por favor, completa tus datos personales y de ingresos.</p>

                <form onSubmit={handleSubmit}>

                    <fieldset style={{ marginTop: "20px" }}>
                        <legend>Datos Personales</legend>

                        <label htmlFor="rut">RUT:</label>
                        <input
                            type="text"
                            id="rut"
                            value={rut}
                            onChange={(e) => setRut(e.target.value)}
                            placeholder="Ej: 12.345.678-9"
                            style={{ width: "100%" }}
                        />

                        <br /><br />

                        <label htmlFor="nombre">Nombre Completo:</label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Alex Espinosa"
                            style={{ width: "100%" }}
                        />

                        <br /><br />

                        <label htmlFor="renta">Renta Líquida Mensual:</label>
                        <input
                            type="number"
                            id="renta"
                            value={renta}
                            onChange={(e) => setRenta(e.target.value)}
                            placeholder="Ej: 850000"
                            style={{ width: "100%" }}
                        />
                    </fieldset>

                    {error && (
                        <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
                    )}

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
                            Siguiente: Adjuntar Documentos
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
