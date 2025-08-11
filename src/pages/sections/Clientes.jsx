import React, { useState } from "react";
import { useClientes } from "../../hooks/useClientes";
import { Helmet } from "react-helmet-async";
import "./Clientes.css";

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

  // Filtro para mostrar solo próximos a vencer (<= 15 días)
  const [showVencimiento, setShowVencimiento] = useState(false);

  // Filtrar clientes usando el hook
  let filteredClientes = filterClientes(searchTerm, filterEstado);
  if (showVencimiento) {
    filteredClientes = filteredClientes.filter(cliente => {
      const dias = getDiasRestantes(cliente.fecha_inicio, cliente.dias_sanitizacion);
      return dias <= 15;
    });
  }

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
            ➕ Agregar Cliente
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

        <div className="filter-group">
          <button
            className={`btn-secondary${showVencimiento ? ' active' : ''}`}
            style={{ minWidth: 180 }}
            onClick={() => setShowVencimiento(v => !v)}
            type="button"
          >
            {showVencimiento ? 'Ver todos los clientes' : 'Ver próximos a vencer'}
          </button>
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

                // Badge visual para próximos a vencer
                const badgeVencimiento = diasRestantes <= 15 ? (
                  <span className={`badge-vencimiento ${diasRestantes <= 7 ? 'rojo' : 'amarillo'}`} title="Próximo a vencer">
                    {diasRestantes <= 7 ? '⚠️ Muy próximo' : '⏳ Pronto'}
                  </span>
                ) : null;
                return (
                  <tr key={cliente.id}>
                    <td>{cliente.id.split("-")[0]}</td>
                    <td>{cliente.nombre} {badgeVencimiento}</td>
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

    </div>
  );
};

export default Clientes;
