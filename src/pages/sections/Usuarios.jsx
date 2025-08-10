import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import "./Usuarios.css";
import { Helmet } from "react-helmet-async";

export default function Usuarios() {
  const { signUp } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    email: "",
    password: "",
    telefono: "",
  });

  const cargarUsuarios = async () => {
    const { data, error } = await supabase.from("usuarios").select("*");
    if (!error) setUsuarios(data);
  };

  const crearUsuario = async () => {
    const { success, error } = await signUp(
      nuevoUsuario.email,
      nuevoUsuario.password,
      { nombre: nuevoUsuario.nombre, telefono: nuevoUsuario.telefono }
    );
    if (success) {
      setNuevoUsuario({ nombre: "", email: "", password: "", telefono: "" });
      cargarUsuarios();
    } else {
      alert(error);
    }
  };

  const borrarUsuario = async (id) => {
    await supabase.from("usuarios").delete().eq("id", id);
    cargarUsuarios();
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  return (
    <div className="usuarios-container">
      <Helmet>
        <title>Gestión de Usuarios</title>
      </Helmet>
      <h2>Usuarios</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          crearUsuario();
        }}
        style={{ display: "flex", gap: 8, marginBottom: 16 }}
      >
        <label htmlFor="nombre" className="sr-only">
          Nombre
        </label>
        <input
          id="nombre"
          name="nombre"
          placeholder="Nombre"
          autoComplete="name"
          value={nuevoUsuario.nombre}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
          }
          required
        />

        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          name="email"
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={nuevoUsuario.email}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })
          }
          required
        />

        <label htmlFor="password" className="sr-only">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          placeholder="Contraseña"
          type="password"
          autoComplete="new-password"
          value={nuevoUsuario.password}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
          }
          required
        />

        <label htmlFor="telefono" className="sr-only">
          Teléfono
        </label>
        <input
          id="telefono"
          name="telefono"
          placeholder="Teléfono"
          type="tel"
          autoComplete="tel"
          value={nuevoUsuario.telefono}
          onChange={(e) =>
            setNuevoUsuario({ ...nuevoUsuario, telefono: e.target.value })
          }
          required
        />
        <button type="submit">Agregar</button>
      </form>

      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>{u.telefono}</td>
              <td>
                <button onClick={() => borrarUsuario(u.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
