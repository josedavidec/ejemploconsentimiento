import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Sidebar.css";
import logo from "../assets/logo.png";

// Configuración de rutas del sidebar con slugs personalizados
const links = [
  { key: "inicio", label: "Inicio", path: "/dashboard/inicio", icon: "🏠" },
  {
    key: "clientes",
    label: "Clientes",
    path: "/dashboard/clientes",
    icon: "🧾",
  },
  {
    key: "configuracion",
    label: "Configuración",
    path: "/dashboard/configuracion",
    icon: "⚙️",
  },
  {
    key: "usuarios",
    label: "Usuarios",
    path: "/dashboard/usuarios",
    icon: "👥",
  },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
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
            <small>
              ¡Hola, {user.displayName || user.username || user.email}!
            </small>
          </div>
        )}
      </div>

      {/* Navegación */}
      <nav className="sidebar-nav">
        {links.map(({ key, label, path, icon }) => (
          <Link
            key={key}
            to={path}
            className={
              location.pathname === path ? "nav-link active" : "nav-link"
            }
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
          <span className="logout-label">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
