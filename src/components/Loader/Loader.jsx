import React, { useState } from 'react';
import Logsection from './../Log_Api/APILOG'; // Importar el componente de logs

const Loader = () => {
    const [file, setFile] = useState(null);
    const [logs, setLogs] = useState([]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
        } else {
            alert('Por favor seleccione un archivo .CSV');
        }
    };

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

            if (response.ok) {
                alert('El archivo se subió correctamente.');
                setLogs((prevLogs) => [
                    ...prevLogs,
                    { status: 'success', message: `Archivo subido correctamente: ${responseData}` },
                ]);
            } else {
                alert(`Error al subir el archivo: ${response.statusText}`);
                setLogs((prevLogs) => [
                    ...prevLogs,
                    {
                        status: 'error',
                        message: `Error ${response.status}: ${response.statusText}`,
                        code: response.status,
                    },
                ]);
            }
        } catch (error) {
            console.error('Error con la API:', error);
            alert('Error al conectarse con la API.');
            setLogs((prevLogs) => [
                ...prevLogs,
                { status: 'error', message: `Error al conectarse con la API: ${error.message}` },
            ]);
        }
    };

    const clearLogs = () => {
        setLogs([]);
    };

    return (
        <div className="flex flex-col items-center bg-gray-800 py-6">
            <div className="w-full max-w-lg p-6 bg-gray-300 border-2 hover:border-yellow-400 border-black rounded-lg shadow-lg">
                <h1 className="text-xl font-semibold text-center mb-4">Subir Datos CSV</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    {file && <p className="text-gray-600 text-center">Archivo seleccionado: {file.name}</p>}
                    <button
                        type="submit"
                        className="w-full py-2 bg-primary/80 hover:bg-secondary/80 text-white font-semibold rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        Subir
                    </button>
                </form>
            </div>

            <div className="mt-6 w-full max-w-lg">
                <Logsection logs={logs} clearLogs={clearLogs} />
            </div>
        </div>
    );
};

export default Loader;
