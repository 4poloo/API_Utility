import React from 'react'

const APILOG = ({ logs }) => {
    return (
        <div className="w-full max-w-lg mt-4 p-4 bg-gray-100 border-2 border-gray-300 rounded-lg hover:border-yellow-500">
            <h2 className="text-lg font-bold mb-2 text-center">Registro de Actividad</h2>
            <ul className="space-y-2">
                {Array.isArray(logs) && logs.length > 0 ? (
                    logs.map((log, index) => (
                        <li key={index} className={`p-2 rounded-md ${log.status === 'success' ? 'bg-green-200' : 'bg-red-200'}`}>
                            {log.message}
                            {log.status === 'error' && log.code && (
                                <span className="ml-2 text-sm text-gray-700">
                                    (Código de error: {log.code})
                                </span>
                            )}
                            {log.status === 'error' && log.code === 405 && (
                                <div className="text-sm text-red-600">Método no permitido (405). Por favor, verifica la solicitud.</div>
                            )}
                            {log.status === 'error' && log.code === 422 && (
                                <div className="text-sm text-red-600">Datos no válidos (422). Por favor, revisa los datos enviados.</div>
                            )}
                        </li>
                    ))
                ) : (
                    <li className="text-gray-500">No hay actividad registrada.</li>
                )}
            </ul>
        </div>
    )
}

export default APILOG
