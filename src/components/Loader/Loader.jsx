import React, { useState } from 'react';
import Logsection from './../Log_Api/APILOG'; // Componente de logs

const Loader = () => {
    const [file, setFile] = useState(null); // Archivo seleccionado
    const [logs, setLogs] = useState([]); // Registros de logs

    // Maneja el cambio de archivo
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile?.type === 'text/csv') {
            // Verificar la codificación del archivo
            const reader = new FileReader();
            reader.onload = () => {
                const content = reader.result;
                const isUtf8 = checkUtf8Encoding(content); // Función que verifica la codificación UTF-8
                if (!isUtf8) {
                    alert('El archivo no está en formato UTF-8. Asegúrate de guardarlo correctamente.');
                    setFile(null); // Resetear el archivo si no está en UTF-8
                } else {
                    setFile(selectedFile);
                }
            };
            reader.readAsText(selectedFile); // Leer el archivo para verificar la codificación
        } else {
            alert('Por favor seleccione un archivo .CSV válido.');
        }
    };

    // Función para verificar si el contenido es UTF-8
    const checkUtf8Encoding = (content) => {
        // Un enfoque básico para verificar si el contenido tiene caracteres no válidos para UTF-8
        try {
            decodeURIComponent(escape(content));
            return true;
        } catch (e) {
            return false;
        }
    };

    // Maneja el envío del archivo
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            alert('Por favor seleccione un archivo antes de enviar.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(
                'https://g5e0ryc7rd.execute-api.us-east-1.amazonaws.com/work_order/',
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const responseData = await response.json();

            // Manejo de respuesta basada en el status lógico y HTTP
            if (response.ok) {
                // Si la respuesta es exitosa, verificar si hay errores en los datos
                const errors = responseData.filter((item) => item.status === 'error');
                if (errors.length > 0) {
                    // Si hay errores lógicos, manejamos el primer error encontrado
                    alert(`Error lógico en el servidor: ${errors[0].message}`);
                    if(errors[0].message === 'Error creating work order'){
                        addLog('error', 'Error con el archivo, posibles causas: Elemento duplicado, SKU no creado.');
                    }
                } else {
                    // Si no hay errores lógicos, la carga fue exitosa
                    alert('El archivo se subió correctamente.')
                    addLog('success', 'Archivo subido correctamente.')
                }
            } else {
                // Si la respuesta HTTP no fue exitosa, mostrar el error HTTP
                alert(`Error HTTP: ${response.statusText}`);
                // Verificamos si el error es un 500 - Internal Server Error
                if (response.status === 500) {
                    addLog('error', `Error 500 - Puede ser un problema con la codificación del archivo. Asegúrate de que el archivo esté en formato UTF-8.`);
                } else {
                    addLog('error', `HTTP ${response.status}: ${response.statusText}`);
                }   
            }
        } catch (error) {
            
            // Manejo del error si no hay respuesta del servidor (error de conexión)
            console.error('Error al conectar con la API:', error);
            alert('Error al conectarse con la API.');
            
            // Añadir al log que hubo un error de conexión
            addLog('error', `Conexión fallida: ${error.message}`);
        }
    };

    // Limpia los registros de logs
    const clearLogs = () => {
        setLogs([]);
    };

    // Agrega un nuevo registro de log
    const addLog = (status, message) => {
        setLogs((prevLogs) => [...prevLogs, { status, message }]);
    };

    return (
        <div className="flex flex-col items-center bg-gray-800 py-6">
            {/* Contenedor del formulario */}
            <div className="w-full max-w-lg p-6 bg-gray-300 border-2 hover:border-yellow-400 border-black rounded-lg shadow-lg">
                <h1 className="text-xl font-semibold text-center mb-4">Subir Datos CSV</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Selección de archivo */}
                    <div className="flex justify-center">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                            id="fileinput"
                        />
                        <label
                            htmlFor="fileinput"
                            className="cursor-pointer py-2 px-4 bg-primary/80 hover:bg-secondary/80 text-white font-semibold rounded-md shadow-sm"
                        >
                            Seleccionar Archivo
                        </label>
                    </div>
                    {/* Nombre del archivo seleccionado */}
                    {file && (
                        <p className="text-gray-600 text-center">
                            Archivo seleccionado: <span className="font-medium">{file.name}</span>
                        </p>
                    )}
                    {/* Botón para subir el archivo */}
                    <button
                        type="submit"
                        className="w-full py-2 bg-primary/80 hover:bg-secondary/80 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Subir
                    </button>
                </form>
            </div>

            {/* Sección de logs */}
            <div className="mt-6 w-full max-w-lg">
                <Logsection logs={logs} clearLogs={clearLogs} />
            </div>
        </div>
    );
};

export default Loader;
