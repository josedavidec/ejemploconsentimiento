import React, { useState } from 'react';

const Usuarios = () => {
  const [users] = useState([
    { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', rol: 'Admin', activo: true },
    { id: 2, nombre: 'María García', email: 'maria@email.com', rol: 'Usuario', activo: true },
    { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', rol: 'Usuario', activo: false },
    { id: 4, nombre: 'Ana Martínez', email: 'ana@email.com', rol: 'Moderador', activo: true },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('todos');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'todos' || user.rol.toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="section-container">
      <h1>👥 Usuarios</h1>
      
      <div className="users-header">
        <p>Gestión completa de usuarios del sistema</p>
        
        <div className="users-actions">
          <button className="btn-primary">
            + Agregar Usuario
          </button>
        </div>
      </div>

      <div className="users-filters">
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
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="todos">Todos los roles</option>
            <option value="admin">Admin</option>
            <option value="moderador">Moderador</option>
            <option value="usuario">Usuario</option>
          </select>
        </div>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.rol.toLowerCase()}`}>
                    {user.rol}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.activo ? 'active' : 'inactive'}`}>
                    {user.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="btn-edit" title="Editar">
                      ✏️
                    </button>
                    <button className="btn-delete" title="Eliminar">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="no-results">
            <p>No se encontraron usuarios con los filtros aplicados.</p>
          </div>
        )}
      </div>

      <div className="users-summary">
        <p>
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </p>
      </div>

      <style jsx>{`
        .section-container {
          padding: 20px;
        }
        
        .users-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .users-header p {
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
        
        .users-filters {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .filter-group {
          flex: 1;
          min-width: 200px;
        }
        
        .search-input, .filter-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .search-input:focus, .filter-select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
        }
        
        .users-table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow-x: auto;
          margin-bottom: 20px;
        }
        
        .users-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .users-table th,
        .users-table td {
          padding: 12px 16px;
          text-align: left;
          border-bottom: 1px solid #e9ecef;
        }
        
        .users-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #495057;
        }
        
        .users-table tbody tr:hover {
          background: #f8f9fa;
        }
        
        .role-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          text-transform: uppercase;
        }
        
        .role-admin {
          background: #dc3545;
          color: white;
        }
        
        .role-moderador {
          background: #fd7e14;
          color: white;
        }
        
        .role-usuario {
          background: #6c757d;
          color: white;
        }
        
        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }
        
        .status-badge.inactive {
          background: #f8d7da;
          color: #721c24;
        }
        
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        
        .btn-edit, .btn-delete {
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
        
        .users-summary {
          text-align: center;
          color: #666;
          font-size: 14px;
        }
        
        .users-summary p {
          margin: 0;
        }
        
        @media (max-width: 768px) {
          .users-filters {
            flex-direction: column;
          }
          
          .filter-group {
            min-width: unset;
          }
          
          .users-table {
            font-size: 12px;
          }
          
          .users-table th,
          .users-table td {
            padding: 8px 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Usuarios;
