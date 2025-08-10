import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

const Configuracion = () => {
  const [settings, setSettings] = useState({
    siteName: "Mi Aplicación",
    language: "es",
    theme: "light",
    notifications: {
      email: true,
      push: false,
      sms: true,
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
    },
    system: {
      maintenanceMode: false,
      debugMode: false,
      cacheEnabled: true,
    },
  });

  const [activeTab, setActiveTab] = useState("general");
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]:
        typeof prev[section] === "object"
          ? { ...prev[section], [field]: value }
          : value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Aquí harías la llamada al backend para guardar
    console.log("Guardando configuración:", settings);
    setHasChanges(false);
    alert("Configuración guardada exitosamente");
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de que quieres resetear la configuración?")) {
      // Resetear a valores por defecto
      setSettings({
        siteName: "Mi Aplicación",
        language: "es",
        theme: "light",
        notifications: {
          email: true,
          push: false,
          sms: true,
        },
        security: {
          twoFactor: false,
          sessionTimeout: 30,
          passwordExpiry: 90,
        },
        system: {
          maintenanceMode: false,
          debugMode: false,
          cacheEnabled: true,
        },
      });
      setHasChanges(false);
    }
  };

  const tabs = [
    { id: "general", label: "General", icon: "⚙️" },
    { id: "notifications", label: "Notificaciones", icon: "🔔" },
    { id: "security", label: "Seguridad", icon: "🔒" },
    { id: "system", label: "Sistema", icon: "💻" },
  ];

  return (
    <div className="section-container">
      <Helmet>
        <title>Configuración</title>
      </Helmet>
      <h1>⚙️ Configuración</h1>

      <div className="config-header">
        <p>Personaliza y ajusta la configuración del sistema</p>
        {hasChanges && (
          <div className="changes-indicator">⚠️ Hay cambios sin guardar</div>
        )}
      </div>

      <div className="config-layout">
        <div className="config-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="config-content">
          {activeTab === "general" && (
            <div className="config-section">
              <h3>Configuración General</h3>

              <div className="form-group">
                <label htmlFor="siteName">Nombre del Sitio</label>
                <input
                  id="siteName"
                  type="text"
                  value={settings.siteName}
                  onChange={(e) =>
                    handleInputChange("siteName", null, e.target.value)
                  }
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="language">Idioma</label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) =>
                    handleInputChange("language", null, e.target.value)
                  }
                  className="form-select"
                >
                  <option value="es">Español</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="theme">Tema</label>
                <select
                  id="theme"
                  value={settings.theme}
                  onChange={(e) =>
                    handleInputChange("theme", null, e.target.value)
                  }
                  className="form-select"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Oscuro</option>
                  <option value="auto">Automático</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="config-section">
              <h3>Configuración de Notificaciones</h3>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.email}
                    onChange={(e) =>
                      handleInputChange(
                        "notifications",
                        "email",
                        e.target.checked
                      )
                    }
                  />
                  <span className="checkmark"></span>
                  Notificaciones por Email
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.push}
                    onChange={(e) =>
                      handleInputChange(
                        "notifications",
                        "push",
                        e.target.checked
                      )
                    }
                  />
                  <span className="checkmark"></span>
                  Notificaciones Push
                </label>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.notifications.sms}
                    onChange={(e) =>
                      handleInputChange(
                        "notifications",
                        "sms",
                        e.target.checked
                      )
                    }
                  />
                  <span className="checkmark"></span>
                  Notificaciones SMS
                </label>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="config-section">
              <h3>Configuración de Seguridad</h3>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactor}
                    onChange={(e) =>
                      handleInputChange(
                        "security",
                        "twoFactor",
                        e.target.checked
                      )
                    }
                  />
                  <span className="checkmark"></span>
                  Autenticación de Dos Factores
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="sessionTimeout">
                  Tiempo de sesión (minutos)
                </label>
                <input
                  id="sessionTimeout"
                  type="number"
                  min="5"
                  max="480"
                  value={settings.security.sessionTimeout}
                  onChange={(e) =>
                    handleInputChange(
                      "security",
                      "sessionTimeout",
                      parseInt(e.target.value)
                    )
                  }
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="passwordExpiry">
                  Expiración de contraseña (días)
                </label>
                <input
                  id="passwordExpiry"
                  type="number"
                  min="30"
                  max="365"
                  value={settings.security.passwordExpiry}
                  onChange={(e) =>
                    handleInputChange(
                      "security",
                      "passwordExpiry",
                      parseInt(e.target.value)
                    )
                  }
                  className="form-input"
                />
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="config-section">
              <h3>Configuración del Sistema</h3>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.system.maintenanceMode}
                    onChange={(e) =>
                      handleInputChange(
                        "system",
                        "maintenanceMode",
                        e.target.checked
                      )
                    }
                  />
                  <span className="checkmark"></span>
                  Modo Mantenimiento
                </label>
                <small>Activar para realizar mantenimiento del sistema</small>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.system.debugMode}
                    onChange={(e) =>
                      handleInputChange("system", "debugMode", e.target.checked)
                    }
                  />
                  <span className="checkmark"></span>
                  Modo Debug
                </label>
                <small>Solo para desarrollo - no usar en producción</small>
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={settings.system.cacheEnabled}
                    onChange={(e) =>
                      handleInputChange(
                        "system",
                        "cacheEnabled",
                        e.target.checked
                      )
                    }
                  />
                  <span className="checkmark"></span>
                  Cache Habilitado
                </label>
                <small>Mejora el rendimiento del sistema</small>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="config-actions">
        <button
          className="btn-secondary"
          onClick={handleReset}
          disabled={!hasChanges}
        >
          Resetear
        </button>
        <button
          className="btn-primary"
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Guardar Cambios
        </button>
      </div>

      <style jsx>{`
        .section-container {
          padding: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .config-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .config-header p {
          margin: 0;
          color: #666;
        }

        .changes-indicator {
          background: #fff3cd;
          color: #856404;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          border: 1px solid #ffeaa7;
        }

        .config-layout {
          display: flex;
          gap: 30px;
          margin-bottom: 30px;
        }

        .config-tabs {
          flex: 0 0 200px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 16px;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          text-align: left;
        }

        .tab-button:hover {
          background: #f8f9fa;
        }

        .tab-button.active {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .tab-icon {
          font-size: 16px;
        }

        .config-content {
          flex: 1;
          background: white;
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .config-section h3 {
          margin: 0 0 25px 0;
          color: #333;
          font-size: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        .form-input,
        .form-select {
          width: 100%;
          max-width: 300px;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-input:focus,
        .form-select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .checkbox-group {
          position: relative;
        }

        .checkbox-label {
          display: flex !important;
          align-items: center;
          cursor: pointer;
          margin-bottom: 8px !important;
        }

        .checkbox-label input[type="checkbox"] {
          margin-right: 12px;
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .checkbox-group small {
          display: block;
          color: #666;
          font-size: 12px;
          margin-left: 30px;
          margin-top: -8px;
        }

        .config-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
        }

        .btn-primary,
        .btn-secondary {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #007bff;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #0056b3;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #545b62;
        }

        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .config-layout {
            flex-direction: column;
            gap: 20px;
          }

          .config-tabs {
            flex: none;
            flex-direction: row;
            overflow-x: auto;
          }

          .tab-button {
            flex: 0 0 auto;
            white-space: nowrap;
          }

          .config-content {
            padding: 20px;
          }

          .form-input,
          .form-select {
            max-width: 100%;
          }

          .config-actions {
            flex-direction: column-reverse;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default Configuracion;
