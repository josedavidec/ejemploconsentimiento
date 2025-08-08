import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DebugConnection from "./components/DebugConnection";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inicio from "./pages/sections/Inicio";
import Clientes from "./pages/sections/Clientes";
import Configuracion from "./pages/sections/Configuracion";
import SupabaseDiagnostic from "./pages/SupabaseDiagnostic";

/**
 * Componente principal de la aplicación
 * Configura el sistema de rutas con autenticación persistente
 */
function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* Ruta raíz - redirige inteligentemente */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Navigate to="/dashboard" replace />
                  </ProtectedRoute>
                }
              />

              {/* Ruta pública - Login */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />

              {/* Ruta de diagnóstico - Accesible siempre */}
              <Route path="/diagnostic" element={<SupabaseDiagnostic />} />

              {/* Rutas protegidas - Dashboard y sus secciones */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              >
                {/* Rutas anidadas con slugs personalizados */}
                <Route path="inicio" element={<Inicio />} />
                <Route path="clientes" element={<Clientes />} />
                <Route path="configuracion" element={<Configuracion />} />
              </Route>

              {/* Ruta 404 - Página no encontrada */}
              <Route
                path="*"
                element={
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: "100vh",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    <h1 style={{ fontSize: "6rem", margin: "0" }}>404</h1>
                    <h2 style={{ margin: "10px 0" }}>Página no encontrada</h2>
                    <p style={{ marginBottom: "20px" }}>
                      La página que buscas no existe.
                    </p>
                    <a
                      href="/dashboard"
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: "5px",
                      }}
                    >
                      Volver al Dashboard
                    </a>
                  </div>
                }
              />
            </Routes>

            {/* Mostrar debug solo en desarrollo */}
            {import.meta.env.DEV && <DebugConnection />}
          </div>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
