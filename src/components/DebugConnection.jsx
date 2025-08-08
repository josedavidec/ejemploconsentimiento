import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const DebugConnection = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [show, setShow] = useState(true);

  // Solo mostrar info de env vars
  const envVars = {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'NO DEFINIDA',
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'DEFINIDA' : 'NO DEFINIDA'
  };

  if (!show) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'checking': return '#ffc107';
      case 'connected': return '#28a745';
      case 'error': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'checking': return 'Verificando...';
      case 'connected': return 'Conectado';
      case 'error': return 'Error de conexión';
      default: return 'Desconocido';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: 'white',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '15px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      fontSize: '12px',
      maxWidth: '300px',
      zIndex: 1000
    }}>
      <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Debug Conexión</h4>
      
      <div style={{ marginBottom: '10px' }}>
        <strong>Estado de Auth:</strong>
        <div style={{
          color: isAuthenticated ? '#28a745' : (isLoading ? '#ffc107' : '#dc3545'),
          fontWeight: 'bold'
        }}>
          {isLoading ? 'Cargando...' : (isAuthenticated ? `Autenticado: ${user?.email}` : 'No autenticado')}
        </div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <strong>Variables de Entorno:</strong>
        <ul style={{ margin: '5px 0', paddingLeft: '15px' }}>
          {Object.entries(envVars).map(([key, value]) => (
            <li key={key} style={{
              color: value.includes('NO DEFINIDA') ? '#dc3545' : '#28a745'
            }}>
              {key}: {value}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '5px 10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Recargar
        </button>
        <button
          onClick={() => setShow(false)}
          style={{
            padding: '5px 10px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default DebugConnection;
