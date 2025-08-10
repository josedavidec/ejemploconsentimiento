import React, { useState } from "react";
import { useClientes } from "../../hooks/useClientes";
import { Helmet } from "react-helmet-async";

const Clientes = () => {
  // Hook personalizado para gestionar clientes
  const {
    clientes,
    isLoading,
    error,
    createCliente,
    updateCliente,
    deleteCliente,
    filterClientes,
    getProgressColor,
    getDiasRestantes,
  } = useClientes();

  // Estados para UI
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("add"); // 'add' o 'edit'
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    estado: "Activo",
    dias_sanitizacion: 30,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrar clientes usando el hook
  const filteredClientes = filterClientes(searchTerm, filterEstado);

  // Funciones del modal
  const openModal = (type, cliente = null) => {
    setModalType(type);
    setSelectedCliente(cliente);
    if (cliente) {
      setFormData({
        nombre: cliente.nombre,
        email: cliente.email,
        telefono: cliente.telefono,
        estado: cliente.estado,
        dias_sanitizacion: cliente.dias_sanitizacion,
      });
    } else {
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        estado: "Activo",
        dias_sanitizacion: 30,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCliente(null);
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      estado: "Activo",
      dias_sanitizacion: 30,
    });
    setIsSubmitting(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let result;

      if (modalType === "add") {
        result = await createCliente(formData);
      } else {
        result = await updateCliente(selectedCliente.id, formData);
      }

      if (result.success) {
        closeModal();
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error("Error en handleSubmit:", err);
      alert("Error inesperado. Por favor, intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cliente) => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${cliente.nombre}?`)) {
      const result = await deleteCliente(cliente.id);
      if (!result.success) {
        alert(`Error al eliminar: ${result.error}`);
      }
    }
  };

  return (
    <div className="section-container">
      <Helmet>
        <title>Gestión de Clientes</title>
      </Helmet>
      <h1>👥 Clientes</h1>

      <div className="clientes-header">
        <p>Gestión completa de clientes y procesos de sanitización</p>

        <div className="clientes-actions">
          <button className="btn-primary" onClick={() => openModal("add")}>
            + Agregar Cliente
          </button>
        </div>
      </div>

      <div className="clientes-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="en proceso">En Proceso</option>
            <option value="vencido">Vencido</option>
          </select>
        </div>
      </div>

      <div className="clientes-table-container">
        <table className="clientes-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Estado</th>
              <th>Progreso Sanitización</th>
              <th>Días Restantes</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  Cargando clientes...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "40px",
                    color: "#dc3545",
                  }}
                >
                  Error: {error}
                </td>
              </tr>
            ) : filteredClientes.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  style={{ textAlign: "center", padding: "40px" }}
                >
                  No se encontraron clientes
                </td>
              </tr>
            ) : (
              filteredClientes.map((cliente) => {
                const diasRestantes = getDiasRestantes(
                  cliente.fecha_inicio,
                  cliente.dias_sanitizacion
                );

                return (
                  <tr key={cliente.id}>
                    <td>{cliente.id.split("-")[0]}</td>
                    <td>{cliente.nombre}</td>
                    <td>{cliente.email}</td>
                    <td>{cliente.telefono}</td>
                    <td>
                      <span
                        className={`status-badge ${cliente.estado
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {cliente.estado}
                      </span>
                    </td>
                    <td>
                      <div className="progress-container">
                        <div className="progress-bar-container">
                          <div
                            className="progress-bar"
                            style={{
                              width: `${cliente.progreso}%`,
                              backgroundColor: getProgressColor(
                                cliente.progreso,
                                cliente.estado
                              ),
                            }}
                          ></div>
                        </div>
                        <span className="progress-text">
                          {cliente.progreso}%
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`days-remaining ${
                          diasRestantes <= 7
                            ? "urgent"
                            : diasRestantes <= 15
                            ? "warning"
                            : ""
                        }`}
                      >
                        {diasRestantes} días
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-edit"
                          title="Editar"
                          onClick={() => openModal("edit", cliente)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-delete"
                          title="Eliminar"
                          onClick={() => handleDelete(cliente)}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {filteredClientes.length === 0 && (
          <div className="no-results">
            <p>No se encontraron clientes con los filtros aplicados.</p>
          </div>
        )}
      </div>

      <div className="clientes-summary">
        <p>
          Mostrando {filteredClientes.length} de {clientes.length} clientes
        </p>
      </div>

      {/* Modal para agregar/editar cliente */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {modalType === "add" ? "Agregar Cliente" : "Editar Cliente"}
              </h2>
              <button className="modal-close" onClick={closeModal}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="nombre">Nombre de la empresa:</label>
                <input
                  type="text"
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono">Teléfono:</label>
                <input
                  type="tel"
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="estado">Estado:</label>
                <select
                  id="estado"
                  value={formData.estado}
                  onChange={(e) =>
                    setFormData({ ...formData, estado: e.target.value })
                  }
                  required
                >
                  <option value="Activo">Activo</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Vencido">Vencido</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dias_sanitizacion">Días de sanitización:</label>
                <input
                  type="number"
                  id="dias_sanitizacion"
                  value={formData.dias_sanitizacion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      dias_sanitizacion: parseInt(e.target.value),
                    })
                  }
                  min="1"
                  max="365"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Guardando..."
                    : modalType === "add"
                    ? "Agregar"
                    : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .section-container {
          padding: 20px;
        }

        .clientes-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .clientes-header p {
          margin: 0;
          color: #666;
        }

        .btn-primary {
          background: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-primary:hover {
          background: #0056b3;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-secondary:hover {
          background: #5a6268;
        }

        .clientes-filters {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .filter-group {
          flex: 1;
          min-width: 200px;
        }

        .search-input,
        .filter-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }

        .search-input:focus,
        .filter-select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .clientes-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          overflow-x: auto;
          margin-bottom: 20px;
        }

        .clientes-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1000px;
        }

        .clientes-table th,
        .clientes-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }

        .clientes-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #495057;
        }

        .clientes-table tbody tr:hover {
          background: #f8f9fa;
        }

        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }

        .status-badge.activo {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.en-proceso {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.vencido {
          background: #f8d7da;
          color: #721c24;
        }

        .progress-container {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .progress-bar-container {
          width: 100px;
          height: 8px;
          background-color: #e9ecef;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          transition: width 0.3s ease;
          border-radius: 4px;
        }

        .progress-text {
          font-size: 12px;
          font-weight: 500;
          min-width: 35px;
        }

        .days-remaining {
          font-weight: 500;
          padding: 4px 8px;
          border-radius: 4px;
        }

        .days-remaining.urgent {
          background: #f8d7da;
          color: #721c24;
        }

        .days-remaining.warning {
          background: #fff3cd;
          color: #856404;
        }

        .action-buttons {
          display: flex;
          gap: 8px;
        }

        .btn-edit,
        .btn-delete {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
        }

        .btn-edit:hover {
          background: #e7f3ff;
        }

        .btn-delete:hover {
          background: #ffebee;
        }

        .no-results {
          text-align: center;
          padding: 40px 20px;
          color: #666;
        }

        .clientes-summary {
          text-align: center;
          color: #666;
          font-size: 14px;
        }

        .clientes-summary p {
          margin: 0;
        }

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e9ecef;
        }

        .modal-header h2 {
          margin: 0;
          color: #333;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
        }

        .modal-close:hover {
          color: #333;
        }

        .modal-form {
          padding: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
          box-sizing: border-box;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }

        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid #e9ecef;
        }

        @media (max-width: 768px) {
          .clientes-filters {
            flex-direction: column;
          }

          .filter-group {
            min-width: unset;
          }

          .clientes-table {
            font-size: 12px;
            min-width: 800px;
          }

          .clientes-table th,
          .clientes-table td {
            padding: 8px 10px;
          }

          .progress-bar-container {
            width: 80px;
          }

          .modal-content {
            width: 95%;
          }

          .modal-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default Clientes;
