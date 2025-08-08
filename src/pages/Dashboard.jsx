import React from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar";
import "./Dashboard.css";

export default function Dashboard() {
  const location = useLocation();
  
  // Si está en /dashboard exactamente, redirigir a /dashboard/inicio
  if (location.pathname === '/dashboard') {
    return <Navigate to="/dashboard/inicio" replace />;
  }
  
  return (
    <div className="dashboard-container">
      <Sidebar />
      <main className="dashboard-content">
        {/* Outlet renderizará las páginas de las rutas anidadas */}
        <Outlet />
      </main>
    </div>
  );
}
