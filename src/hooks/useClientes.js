import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener todos los clientes
  const fetchClientes = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setClientes(data || []);
    } catch (err) {
      console.error('Error al obtener clientes:', err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Crear nuevo cliente
  const createCliente = async (clienteData) => {
    try {
      setError(null);

      // Calcular progreso inicial
      const fechaInicio = new Date().toISOString().split('T')[0];
      const progresoInicial = calcularProgreso(fechaInicio, clienteData.dias_sanitizacion);

      const { data, error: createError } = await supabase
        .from('clientes')
        .insert([{
          ...clienteData,
          fecha_inicio: fechaInicio,
          progreso: progresoInicial,
          activo: true
        }])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      // Agregar el nuevo cliente al estado local
      setClientes(prev => [data, ...prev]);
      
      return { success: true, data };
    } catch (err) {
      console.error('Error al crear cliente:', err.message);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Actualizar cliente existente
  const updateCliente = async (id, clienteData) => {
    try {
      setError(null);

      const { data, error: updateError } = await supabase
        .from('clientes')
        .update(clienteData)
        .eq('id', id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Actualizar el cliente en el estado local
      setClientes(prev => prev.map(cliente => 
        cliente.id === id ? data : cliente
      ));

      return { success: true, data };
    } catch (err) {
      console.error('Error al actualizar cliente:', err.message);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Eliminar cliente (soft delete)
  const deleteCliente = async (id) => {
    try {
      setError(null);

      const { error: deleteError } = await supabase
        .from('clientes')
        .update({ activo: false })
        .eq('id', id);

      if (deleteError) {
        throw deleteError;
      }

      // Remover el cliente del estado local
      setClientes(prev => prev.filter(cliente => cliente.id !== id));

      return { success: true };
    } catch (err) {
      console.error('Error al eliminar cliente:', err.message);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Actualizar progreso de todos los clientes
  const updateProgreso = async () => {
    try {
      // Esta función se ejecuta automáticamente por el trigger en la base de datos
      // Pero podemos forzar una actualización refrescando los datos
      await fetchClientes();
    } catch (err) {
      console.error('Error al actualizar progreso:', err.message);
    }
  };

  // Obtener cliente por ID
  const getClienteById = (id) => {
    return clientes.find(cliente => cliente.id === id);
  };

  // Filtrar clientes
  const filterClientes = (searchTerm = '', estadoFilter = 'todos') => {
    return clientes.filter(cliente => {
      const matchesSearch = 
        cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEstado = 
        estadoFilter === 'todos' || 
        cliente.estado.toLowerCase() === estadoFilter.toLowerCase();

      return matchesSearch && matchesEstado;
    });
  };

  // Obtener estadísticas de clientes
  const getEstadisticas = () => {
    const total = clientes.length;
    const activos = clientes.filter(c => c.estado === 'Activo').length;
    const enProceso = clientes.filter(c => c.estado === 'En Proceso').length;
    const vencidos = clientes.filter(c => c.estado === 'Vencido').length;

    return {
      total,
      activos,
      enProceso,
      vencidos,
      porcentajeActivos: total > 0 ? Math.round((activos / total) * 100) : 0
    };
  };

  // Funciones de utilidad
  const calcularProgreso = (fechaInicio, diasSanitizacion) => {
    const inicio = new Date(fechaInicio);
    const ahora = new Date();
    const diasTranscurridos = Math.floor((ahora - inicio) / (1000 * 60 * 60 * 24));
    const progreso = Math.min((diasTranscurridos / diasSanitizacion) * 100, 100);
    return Math.round(progreso);
  };

  const getDiasRestantes = (fechaInicio, diasSanitizacion) => {
    const inicio = new Date(fechaInicio);
    const ahora = new Date();
    const diasTranscurridos = Math.floor((ahora - inicio) / (1000 * 60 * 60 * 24));
    const diasRestantes = diasSanitizacion - diasTranscurridos;
    return Math.max(diasRestantes, 0);
  };

  const getProgressColor = (progreso, estado) => {
    if (estado === 'Vencido') return '#dc3545';
    if (progreso >= 90) return '#ffc107';
    if (progreso >= 70) return '#fd7e14';
    return '#28a745';
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchClientes();

    // Configurar tiempo real (opcional)
    const subscription = supabase
      .channel('clientes_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'clientes'
      }, (payload) => {
        console.log('Cliente actualizado en tiempo real:', payload);
        // Recargar datos cuando hay cambios
        fetchClientes();
      })
      .subscribe();

    // Actualizar progreso cada hora (más eficiente que cada minuto)
    const progressInterval = setInterval(updateProgreso, 60 * 60 * 1000); // 1 hora

    return () => {
      subscription.unsubscribe();
      clearInterval(progressInterval);
    };
  }, []);

  return {
    // Estado
    clientes,
    isLoading,
    error,
    
    // Acciones CRUD
    fetchClientes,
    createCliente,
    updateCliente,
    deleteCliente,
    
    // Utilidades
    getClienteById,
    filterClientes,
    getEstadisticas,
    updateProgreso,
    calcularProgreso,
    getDiasRestantes,
    getProgressColor
  };
};
