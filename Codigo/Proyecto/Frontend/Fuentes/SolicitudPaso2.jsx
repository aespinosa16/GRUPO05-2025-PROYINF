import React from 'react';
import { useNavigate } from 'react-router-dom';
import './global.css'; // Reutilizamos el CSS global

export function SolicitudPaso2() {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Como es un prototipo, no validamos si subió algo,
        // solo lo llevamos al paso final.
        navigate('/solicitud-paso3');
    };

    return (
        <div className="container"> {/* Asumiendo que tienen clases en global.css */}
            <h1>Paso 2: Carga de Documentos</h1>
            <p>Para validar tu solicitud, necesitamos los siguientes documentos.</p>
            
            {/* Esto cumple el Criterio 2: permite la carga de documentos */}
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Documentos Requeridos</legend>
                    
                    <label htmlFor="cedula">Cédula de Identidad (ambos lados):</label><br/>
                    <input type="file" id="cedula" name="cedula" accept=".pdf, .jpg, .png" />
                    <br/><br/>

                    <label htmlFor="liquidaciones">Últimas 3 Liquidaciones de Sueldo:</label><br/>
                    <input type="file" id="liquidaciones" name="liquidaciones" accept=".pdf, .jpg, .png" />
                    <br/><br/>
                </fieldset>
                
                <br/>
                <button type="submit">Enviar Solicitud</button>
            </form>
        </div>
    );
}