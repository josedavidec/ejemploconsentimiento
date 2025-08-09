import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, checkSupabaseConnection } from '../lib/supabase';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Verificar sesión al iniciar la aplicación
  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('🔐 Inicializando autenticación...');
        
        // Obtener sesión actual - sin timeout, dejamos que Supabase maneje los tiempos
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('❌ Error al obtener la sesión:', error);
          setIsAuthenticated(false);
        } else if (session?.user) {
          console.log('✅ Sesión encontrada:', session.user.email);
          setUser(session.user);
          setIsAuthenticated(true);
          // Cargar perfil en segundo plano, no bloquear la UI
          loadUserProfile(session.user.id).catch(console.warn);
        } else {
          console.log('ℹ️ No hay sesión activa');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('❌ Error al verificar la sesión:', error);
        if (mounted) {
          setIsAuthenticated(false);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Ejecutar inmediatamente sin demora
    initializeAuth();

    // Escuchar cambios en la autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          // Cargar perfil en segundo plano
          loadUserProfile(session.user.id).catch(console.warn);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setUserProfile(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  // Cargar perfil del usuario desde la tabla usuarios
  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error al cargar perfil:', error.message);
        return;
      }

      setUserProfile(data);
    } catch (error) {
      console.error('Error al cargar perfil del usuario:', error.message);
    }
  };

  // Función para crear perfil de usuario en nuestra tabla
  const createUserProfile = async (user, additionalData = {}) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .insert({
          auth_id: user.id,
          email: user.email,
          nombre:
            additionalData.nombre ||
            user.user_metadata?.nombre ||
            user.email.split("@")[0],
          telefono: additionalData.telefono || null, // <-- agrega esto
          rol: "admin",
          activo: true,
        })
        .select()
        .single();

      if (error) {
        console.error('Error al crear perfil:', error.message);
        return null;
      }

      setUserProfile(data);
      return data;
    } catch (error) {
      console.error('Error al crear perfil del usuario:', error.message);
      return null;
    }
  };

  // Función para iniciar sesión
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Error de login:', error.message);
        return { success: false, error: error.message };
      }

      // El estado se actualiza automáticamente por onAuthStateChange
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error al iniciar sesión:', error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Función para registrar nuevo usuario (solo admin)
  const signUp = async (email, password, userData = {}) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });

      if (error) {
        console.error('Error de registro:', error.message);
        return { success: false, error: error.message };
      }

      // Crear perfil en nuestra tabla
      if (data.user) {
        await createUserProfile(data.user, userData);
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error al cerrar sesión:', error.message);
        return { success: false, error: error.message };
      }

      // El estado se limpia automáticamente por onAuthStateChange
      return { success: true };
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Función para verificar credenciales (compatibility con el código anterior)
  const authenticate = async (username, password) => {
    // Asumimos que username es el email
    return await login(username, password);
  };

  // Valor del contexto que se pasará a los componentes hijos
  const value = {
    isAuthenticated,
    isLoading,
    user,
    userProfile,
    login,
    signUp,
    logout,
    authenticate,
    createUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
