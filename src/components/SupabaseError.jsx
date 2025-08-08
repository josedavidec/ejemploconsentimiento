import React from 'react';

const SupabaseError = () => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f8f9fa'
    }}>
      <div style={{ 
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '600px',
        border: '1px solid #f5c6cb'
      }}>
        <h2 style={{ margin: '0 0 20px 0' }}>⚠️ Problema de Configuración</h2>
        
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
          No se puede conectar con Supabase. Tu proyecto parece no estar disponible.
        </p>
        
        <div style={{ 
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <strong>Posibles causas:</strong>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>El proyecto de Supabase fue eliminado</li>
            <li>El proyecto está pausado por inactividad</li>
            <li>La URL en el archivo .env es incorrecta</li>
            <li>Problemas temporales del servicio</li>
          </ul>
        </div>
        
        <div style={{ 
          backgroundColor: '#d1ecf1',
          color: '#0c5460',
          padding: '15px',
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <strong>Soluciones:</strong>
          <ol style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>Ve a <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" style={{ color: '#0c5460' }}>supabase.com</a> e inicia sesión</li>
            <li>Verifica que tu proyecto existe y está activo</li>
            <li>Si está pausado, reactívalo</li>
            <li>Si no existe, crea un nuevo proyecto</li>
            <li>Actualiza las variables en tu archivo .env</li>
          </ol>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              marginRight: '10px'
            }}
          >
            🔄 Recargar Página
          </button>
          
          <button 
            onClick={() => window.open('https://supabase.com', '_blank')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            🚀 Ir a Supabase
          </button>
        </div>
      </div>
      
      <div style={{ 
        marginTop: '20px',
        fontSize: '14px',
        color: '#6c757d'
      }}>
        <p>Si el problema persiste, verifica la consola del navegador para más detalles.</p>
      </div>
    </div>
  );
};

export default SupabaseError;
