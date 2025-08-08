-- SCHEMA SIMPLIFICADO PARA EVITAR ERRORES
-- Ejecutar este archivo si el schema.sql da problemas

-- Crear tabla de usuarios (administradores)
CREATE TABLE IF NOT EXISTS public.usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nombre TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'admin',
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Crear tabla de clientes
CREATE TABLE IF NOT EXISTS public.clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT,
  estado TEXT NOT NULL DEFAULT 'Activo',
  fecha_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  dias_sanitizacion INTEGER NOT NULL DEFAULT 30,
  progreso INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES public.usuarios(id)
);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
DROP TRIGGER IF EXISTS update_usuarios_updated_at ON public.usuarios;
CREATE TRIGGER update_usuarios_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_clientes_updated_at ON public.clientes;
CREATE TRIGGER update_clientes_updated_at
    BEFORE UPDATE ON public.clientes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo
INSERT INTO public.clientes (nombre, email, telefono, estado, fecha_inicio, dias_sanitizacion, progreso)
VALUES 
  ('Empresa ABC S.A.', 'contacto@empresaabc.com', '+34 91 123 4567', 'Activo', '2024-01-15', 45, 75),
  ('Tech Solutions Ltd.', 'info@techsolutions.com', '+34 93 987 6543', 'En Proceso', '2024-02-10', 60, 45),
  ('Consultoría Digital', 'admin@consultoriadigital.es', '+34 95 456 7890', 'Activo', '2023-12-01', 30, 90),
  ('StartUp Innovadora', 'hello@startupinnovadora.com', '+34 96 789 0123', 'Vencido', '2023-10-15', 90, 100)
ON CONFLICT DO NOTHING;

-- Configurar Row Level Security (RLS) - Políticas permisivas para desarrollo
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Política permisiva para usuarios (desarrollo)
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.usuarios;
CREATE POLICY "Enable all operations for authenticated users"
  ON public.usuarios FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Política permisiva para clientes (desarrollo)
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON public.clientes;
CREATE POLICY "Enable all operations for authenticated users"
  ON public.clientes FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
