import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const SupabaseDiagnostic = () => {
  const [diagnosticResults, setDiagnosticResults] = useState({
    loading: true,
    envVars: {},
    urlTest: null,
    authTest: null,
    apiTest: null,
    error: null
  });

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    setDiagnosticResults(prev => ({ ...prev, loading: true }));
    
    try {
      console.log('🔍 Iniciando diagnóstico completo de Supabase...');
      
      // 1. Verificar variables de entorno
      const envVars = {
        VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY
      };
      
      console.log('✅ Variables de entorno:', {
        url: envVars.VITE_SUPABASE_URL ? 'Configurada' : 'NO CONFIGURADA',
        key: envVars.VITE_SUPABASE_ANON_KEY ? 'Configurada' : 'NO CONFIGURADA'
      });

      // 2. Test de conectividad Auth API
      let urlTest = { success: false, error: null, status: null, details: null };
      try {
        const response = await fetch(`${envVars.VITE_SUPABASE_URL}/auth/v1/settings`);
        urlTest.status = response.status;
        urlTest.success = response.status === 401; // 401 es esperado sin auth
        
        if (response.status === 404) {
          urlTest.error = 'Proyecto no encontrado - Auth API no disponible';
        } else if (response.status === 401) {
          // 401 es lo que esperamos - significa que el endpoint existe
          urlTest.success = true;
        } else if (response.status >= 400) {
          urlTest.error = `HTTP ${response.status}`;
        }
        
        urlTest.details = {
          status: response.status,
          statusText: response.statusText,
          note: response.status === 401 ? 'Esperado - Auth endpoint existe' : null,
          headers: Object.fromEntries(response.headers.entries())
        };
      } catch (error) {
        urlTest.error = error.message;
      }

      // 3. Test de autenticación
      let authTest = { success: false, error: null, details: null };
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          authTest.error = error.message;
        } else {
          authTest.success = true;
          authTest.details = {
            hasSession: !!data.session,
            sessionUser: data.session?.user?.email || null
          };
        }
      } catch (error) {
        authTest.error = error.message;
      }

      // 4. Test de API REST
      let apiTest = { success: false, error: null, details: null };
      try {
        // Intentar una consulta simple que debería funcionar siempre
        const { data, error } = await supabase
          .from('usuarios')
          .select('count')
          .limit(1);
          
        if (error) {
          apiTest.error = error.message;
          apiTest.details = {
            code: error.code,
            hint: error.hint,
            details: error.details
          };
        } else {
          apiTest.success = true;
          apiTest.details = { queryWorked: true };
        }
      } catch (error) {
        apiTest.error = error.message;
      }

      setDiagnosticResults({
        loading: false,
        envVars,
        urlTest,
        authTest,
        apiTest,
        error: null
      });

    } catch (error) {
      console.error('❌ Error en diagnóstico:', error);
      setDiagnosticResults(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  const ResultItem = ({ title, test, children }) => (
    <div style={{
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '15px',
      border: `2px solid ${test?.success ? '#28a745' : '#dc3545'}`,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h3 style={{ 
        margin: '0 0 10px 0',
        color: test?.success ? '#28a745' : '#dc3545',
        display: 'flex',
        alignItems: 'center'
      }}>
        {test?.success ? '✅' : '❌'} {title}
      </h3>
      {children}
    </div>
  );

  if (diagnosticResults.loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>🔍 Ejecutando diagnóstico de Supabase...</h2>
        <div style={{ margin: '20px 0' }}>Por favor espera...</div>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
        🔧 Diagnóstico Completo de Supabase
      </h1>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          onClick={runDiagnostics}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🔄 Ejecutar Diagnóstico Nuevamente
        </button>
      </div>

      {/* Variables de entorno */}
      <ResultItem title="Variables de Entorno" test={{ success: !!(diagnosticResults.envVars?.VITE_SUPABASE_URL && diagnosticResults.envVars?.VITE_SUPABASE_ANON_KEY) }}>
        <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
          <p><strong>VITE_SUPABASE_URL:</strong> {diagnosticResults.envVars?.VITE_SUPABASE_URL || '❌ NO DEFINIDA'}</p>
          <p><strong>VITE_SUPABASE_ANON_KEY:</strong> {diagnosticResults.envVars?.VITE_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ NO DEFINIDA'}</p>
        </div>
      </ResultItem>

      {/* Test de URL */}
      <ResultItem title="Auth API Endpoint" test={diagnosticResults.urlTest}>
        {diagnosticResults.urlTest?.error ? (
          <div>
            <p style={{ color: '#dc3545' }}><strong>Error:</strong> {diagnosticResults.urlTest.error}</p>
            {diagnosticResults.urlTest.details && (
              <details style={{ marginTop: '10px' }}>
                <summary>Detalles técnicos</summary>
                <pre style={{ fontSize: '12px', backgroundColor: '#f1f1f1', padding: '10px', marginTop: '10px' }}>
                  {JSON.stringify(diagnosticResults.urlTest.details, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ) : (
          <p style={{ color: '#28a745' }}>URL responde correctamente</p>
        )}
      </ResultItem>

      {/* Test de autenticación */}
      <ResultItem title="Sistema de Autenticación" test={diagnosticResults.authTest}>
        {diagnosticResults.authTest?.error ? (
          <p style={{ color: '#dc3545' }}><strong>Error:</strong> {diagnosticResults.authTest.error}</p>
        ) : (
          <div>
            <p style={{ color: '#28a745' }}>✅ Auth API funciona correctamente</p>
            {diagnosticResults.authTest?.details && (
              <div style={{ marginTop: '10px', fontSize: '14px' }}>
                <p><strong>Sesión activa:</strong> {diagnosticResults.authTest.details.hasSession ? 'Sí' : 'No'}</p>
                {diagnosticResults.authTest.details.sessionUser && (
                  <p><strong>Usuario:</strong> {diagnosticResults.authTest.details.sessionUser}</p>
                )}
              </div>
            )}
          </div>
        )}
      </ResultItem>

      {/* Test de API */}
      <ResultItem title="API REST / Base de Datos" test={diagnosticResults.apiTest}>
        {diagnosticResults.apiTest?.error ? (
          <div>
            <p style={{ color: '#dc3545' }}><strong>Error:</strong> {diagnosticResults.apiTest.error}</p>
            {diagnosticResults.apiTest?.details && (
              <div style={{ marginTop: '10px', fontSize: '14px' }}>
                <p><strong>Código:</strong> {diagnosticResults.apiTest.details.code}</p>
                <p><strong>Detalle:</strong> {diagnosticResults.apiTest.details.details}</p>
                {diagnosticResults.apiTest.details.hint && (
                  <p><strong>Sugerencia:</strong> {diagnosticResults.apiTest.details.hint}</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: '#28a745' }}>✅ Base de datos accesible</p>
        )}
      </ResultItem>

      {/* Recomendaciones */}
      <div style={{
        backgroundColor: '#d1ecf1',
        color: '#0c5460',
        padding: '20px',
        borderRadius: '8px',
        marginTop: '20px'
      }}>
        <h3>💡 Recomendaciones:</h3>
        <ul>
          <li>Si ves errores 404: Tu proyecto de Supabase puede estar pausado o eliminado</li>
          <li>Si hay errores de autenticación: Verifica las claves API</li>
          <li>Si falla la base de datos: Revisa que las tablas existan y tengan permisos RLS correctos</li>
          <li>Si todo falla: Puede ser un problema de configuración de CORS o red</li>
        </ul>
      </div>
    </div>
  );
};

export default SupabaseDiagnostic;
