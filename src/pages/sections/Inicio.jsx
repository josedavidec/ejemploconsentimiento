import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Inicio.css";
import AlertasSanitizacion from "../../components/AlertasSanitizacion.jsx";
import { useClientesCount } from "../../hooks/useClientesCount";

const Inicio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { count, loading } = useClientesCount();
  return (
    <div className="section-container">
      <h1>🏠 Inicio</h1>
      <div className="dashboard-main-layout">
        <div className="dashboard-main-left">
          <div className="welcome-content">
            <p>¡Bienvenido al panel de administración!</p>

            {user && (
              <div className="user-info">
                <h3>Información del usuario:</h3>
                <ul>
                  <li>
                    <strong>Usuario:</strong> {user.email}
                  </li>
                  <li>
                    <strong>Rol:</strong> {user.role}
                  </li>
                  <li>
                    <strong>Sesión iniciada:</strong>{" "}
                    {new Date(user.loginTime).toLocaleString()}
                  </li>
                </ul>
              </div>
            )}

            <div className="dashboard-stats">
              <h3>Estadísticas del Dashboard</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <h4>Clientes Activos</h4>
                  <span className="stat-number">
                    {loading ? '...' : count ?? 0}
                  </span>
                </div>
                <div className="stat-card">
                  <h4>Servicios programados este mes</h4>
                  <span className="stat-number">8</span>
                </div>
                <div className="stat-card">
                  <h4>Servicios completados este mes</h4>
                  <span className="stat-number">23</span>
                </div>
                <div className="stat-card">
                  <h4>Próxima visita más cercana</h4>
                  <span className="stat-number">5</span>
                </div>
              </div>
            </div>

            <div className="quick-actions">
              <h3>Acciones Rápidas</h3>
              <div className="actions-grid">
                <button className="action-btn">Ver Reportes</button>
                <button
                  className="action-btn"
                  onClick={() => navigate("/dashboard/usuarios")}
                >
                  Gestionar Usuarios
                </button>
                <button className="action-btn">Configurar Sistema</button>
              </div>
            </div>
          </div>
        </div>
        <div className="dashboard-main-right">
          <AlertasSanitizacion />
        </div>
      </div>
    </div>
  );
};

export default Inicio;
