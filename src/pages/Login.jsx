import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const { authenticate } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtener la ruta de retorno o usar dashboard por defecto
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      const result = await authenticate(username, password);
      
      if (result.success) {
        // Redirigir a la ruta de origen o al dashboard
        navigate(from, { replace: true });
      } else {
        setError(result.error || "Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setError("Error inesperado al iniciar sesión");
      console.error('Error en login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h1>Iniciar Sesión</h1>
        {error && <div className="login-error">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Iniciando sesión...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default Login;
