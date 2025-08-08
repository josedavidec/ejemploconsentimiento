import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Inicio = () => {
  const { user } = useAuth();

  return (
    <div className="section-container">
      <h1>🏠 Inicio</h1>
      <div className="welcome-content">
        <p>¡Bienvenido al panel de administración!</p>
        
        {user && (
          <div className="user-info">
            <h3>Información del usuario:</h3>
            <ul>
              <li><strong>Usuario:</strong> {user.username}</li>
              <li><strong>Rol:</strong> {user.role}</li>
              <li><strong>Sesión iniciada:</strong> {new Date(user.loginTime).toLocaleString()}</li>
            </ul>
          </div>
        )}

        <div className="dashboard-stats">
          <h3>Estadísticas del Dashboard</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Usuarios Activos</h4>
              <span className="stat-number">145</span>
            </div>
            <div className="stat-card">
              <h4>Configuraciones</h4>
              <span className="stat-number">8</span>
            </div>
            <div className="stat-card">
              <h4>Sesiones Hoy</h4>
              <span className="stat-number">23</span>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <h3>Acciones Rápidas</h3>
          <div className="actions-grid">
            <button className="action-btn">Ver Reportes</button>
            <button className="action-btn">Gestionar Usuarios</button>
            <button className="action-btn">Configurar Sistema</button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .section-container {
          padding: 20px;
        }
        
        .welcome-content {
          max-width: 800px;
        }
        
        .user-info {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
          border-left: 4px solid #007bff;
        }
        
        .user-info ul {
          list-style: none;
          padding: 0;
          margin: 10px 0 0 0;
        }
        
        .user-info li {
          margin: 8px 0;
          color: #555;
        }
        
        .dashboard-stats {
          margin: 30px 0;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin-top: 15px;
        }
        
        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-align: center;
          border: 1px solid #e9ecef;
        }
        
        .stat-card h4 {
          margin: 0 0 10px 0;
          color: #666;
          font-size: 14px;
          font-weight: 500;
        }
        
        .stat-number {
          font-size: 28px;
          font-weight: bold;
          color: #007bff;
        }
        
        .quick-actions {
          margin: 30px 0;
        }
        
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        
        .action-btn {
          padding: 12px 20px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .action-btn:hover {
          background: #0056b3;
        }
        
        .action-btn:focus {
          outline: 2px solid #80bdff;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
};

export default Inicio;
