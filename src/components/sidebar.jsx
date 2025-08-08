import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";
import logo from "../assets/logo.svg";

// Configuración de rutas del sidebar con slugs personalizados
const links = [
  { key: "inicio", label: "Inicio", path: "/dashboard/inicio", icon: "🏠" },
  { key: "clientes", label: "Clientes", path: "/dashboard/clientes", icon: "👥" },
  { key: "configuracion", label: "Configuración", path: "/dashboard/configuracion", icon: "⚙️" },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
  };

  return (
    <aside className="dashboard-sidebar">
      {/* Logo y header */}
      <div className="sidebar-header">
        <img src={logo} alt="logo" className="sidebar-logo" />
        <hr className="sidebar-divider" />
        <h2>Panel</h2>
        {user && (
          <div className="user-welcome">
            <small>¡Hola, {user.displayName || user.username}!</small>
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className="sidebar-nav">
        {links.map(({ key, label, path, icon }) => (
          <Link
            key={key}
            to={path}
            className={location.pathname === path ? "nav-link active" : "nav-link"}
            aria-current={location.pathname === path ? "page" : undefined}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </Link>
        ))}
      </nav>

      {/* Botón de logout */}
      <div className="sidebar-footer">
        <button 
          onClick={handleLogout}
          className="logout-btn"
          title="Cerrar sesión"
        >
          <span className="logout-icon">🚪</span>
          <span className="logout-label">Cerrar sesión</span>
        </button>
      </div>

      <style jsx>{`
        .sidebar-header {
          padding: 15px;
        }
        
        .sidebar-logo {
          width: 100%;
          max-width: 120px;
          height: auto;
          display: block;
          margin: 0 auto 15px;
        }
        
        .user-welcome {
          text-align: center;
          margin-top: 10px;
        }
        
        .user-welcome small {
          color: #666;
          font-size: 12px;
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          color: #333;
          text-decoration: none;
          transition: all 0.2s ease;
          border-radius: 8px;
          margin: 4px 15px;
        }
        
        .nav-link:hover {
          background-color: #f8f9fa;
          color: #007bff;
        }
        
        .nav-link.active {
          background-color: #007bff;
          color: white;
        }
        
        .nav-icon {
          font-size: 18px;
          width: 20px;
          text-align: center;
        }
        
        .nav-label {
          font-weight: 500;
        }
        
        .sidebar-footer {
          margin-top: auto;
          padding: 15px;
          border-top: 1px solid #e9ecef;
        }
        
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 20px;
          background: none;
          border: none;
          color: #dc3545;
          cursor: pointer;
          border-radius: 8px;
          transition: all 0.2s ease;
          font-size: 14px;
        }
        
        .logout-btn:hover {
          background-color: #f8f9fa;
          color: #c82333;
        }
        
        .logout-icon {
          font-size: 18px;
          width: 20px;
          text-align: center;
        }
        
        .logout-label {
          font-weight: 500;
        }
      `}</style>
    </aside>
  );
}
