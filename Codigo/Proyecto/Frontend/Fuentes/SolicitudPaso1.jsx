import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './global.css'; // Reutilizamos el CSS global que ya tienen

export function SolicitudPaso1() {
    const navigate = useNavigate();
    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');
    const [renta, setRenta] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevenimos que el formulario se envíe de verdad
        
        // Criterio 1: Validar campos obligatorios
        if (!rut || !nombre || !renta) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        
        // Si todo está bien, navegamos al paso 2
        navigate('/solicitud-paso2');
    };

    return (
        <div className="container"> {/* Asumiendo que tienen clases en global.css */}
            <h1>Paso 1: Completa tus Datos</h1>
            <p>Por favor, completa tus datos personales y de ingresos.</p>
            
            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Datos Personales</legend>
                    
                    <label htmlFor="rut">RUT:</label><br/>
                    <input 
                        type="text" 
                        id="rut" 
                        value={rut}
                        onChange={(e) => setRut(e.target.value)}
                        placeholder="Ej: 12.345.678-9" 
                    />
                    <br/><br/>

                    <label htmlFor="nombre">Nombre Completo:</label><br/>
                    <input 
                        type="text" 
                        id="nombre" 
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej: Alex Espinosa" 
                    />
                    <br/><br/>

                    <label htmlFor="renta">Renta Líquida Mensual:</label><br/>
                    <input 
                        type="number" 
                        id="renta" 
                        value={renta}
                        onChange={(e) => setRenta(e.target.value)}
                        placeholder="Ej: 850000" 
                    />
                    <br/><br/>
                </fieldset>
                
                {/* Mostramos el error si existe */}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                <br/>
                <button type="submit">Siguiente: Adjuntar Documentos</button>
            </form>
        </div>
    );
}