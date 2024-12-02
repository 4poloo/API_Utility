import React, { useState, useEffect } from 'react';
import B1 from "./../../../public/1650591586319.png"
import { GrStatusWarning } from "react-icons/gr"

const Stat = () => {
    const [status, setStatus] = useState('Loading...');
    const [isOnline, setIsOnline] = useState(false);

    useEffect(() => {
        const apiUrl = 'https://g5e0ryc7rd.execute-api.us-east-1.amazonaws.com/work_order/';

        // Crear un archivo CSV vacío
        const emptyCSV = new Blob([``], { type: 'text/csv' }); // Archivo CSV vacío
        const formData = new FormData();
        formData.append('file', emptyCSV, 'empty-file.csv'); // Archivo vacío con extensión .csv

        // Realizar la solicitud POST con el archivo CSV vacío
        fetch(apiUrl, {
            method: 'POST',
            body: formData,
        })
            .then((response) => {
                if (response.ok) {
                    return response.json(); // Convertir la respuesta a JSON si la respuesta es exitosa
                }
                throw new Error('API error');
            })
            .then((data) => {
                console.log(data); // Verificar la respuesta de la API
                setStatus('online');
                setIsOnline(true);
            })
            .catch((error) => {
                console.error('Error:', error);
                setStatus('Fallo en conectar');
                setIsOnline(false);
            });
    }, []);

    return (
        <div className='h-[100px] w-full bg-gray-200'>
            <h1 className='bg-gray-300 text-black text-5xl font-mono text-center py-4'>
                Carga Invas SurChile SPA
            </h1>
            <div className='flex justify-center bg-gray-800 py-1'>
                <GrStatusWarning size={40} color='gold'/>
                <h3 className="text-xl font-bold flex mt-2 mx-4 text-gray-200">API Estado:
                    <p className={` mx-2 rounded-md ${isOnline ? 'text-green-600' : 'text-red-600'}`}>{status}</p>
                </h3>
            </div>
        </div>
    );
};

export default Stat;
