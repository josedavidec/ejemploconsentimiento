-- Habilitar Row Level Security (RLS)
ALTER TABLE IF EXISTS public.clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.usuarios DISABLE ROW LEVEL SECURITY;

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

-- Función para calcular progreso automáticamente
CREATE OR REPLACE FUNCTION calcular_progreso()
RETURNS TRIGGER AS $$
BEGIN
    NEW.progreso = LEAST(
        ROUND(
            (DATE_PART('day', CURRENT_DATE - NEW.fecha_inicio))
            / NEW.dias_sanitizacion::NUMERIC * 100
        )::INTEGER,
        100
    );
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para calcular progreso automáticamente
DROP TRIGGER IF EXISTS trigger_calcular_progreso ON public.clientes;
CREATE TRIGGER trigger_calcular_progreso
    BEFORE INSERT OR UPDATE ON public.clientes
    FOR EACH ROW
    EXECUTE FUNCTION calcular_progreso();

-- Insertar datos de ejemplo
INSERT INTO public.clientes (nombre, email, telefono, estado, fecha_inicio, dias_sanitizacion)
VALUES 
  ('Empresa ABC S.A.', 'contacto@empresaabc.com', '+34 91 123 4567', 'Activo', '2024-01-15', 45),
  ('Tech Solutions Ltd.', 'info@techsolutions.com', '+34 93 987 6543', 'En Proceso', '2024-02-10', 60),
  ('Consultoría Digital', 'admin@consultoriadigital.es', '+34 95 456 7890', 'Activo', '2023-12-01', 30),
  ('StartUp Innovadora', 'hello@startupinnovadora.com', '+34 96 789 0123', 'Vencido', '2023-10-15', 90)
ON CONFLICT DO NOTHING;

-- Habilitar RLS para seguridad
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS (por ahora permisivas para desarrollo)
DROP POLICY IF EXISTS "Los usuarios pueden ver sus propios datos" ON public.usuarios;
CREATE POLICY "Los usuarios pueden ver sus propios datos"
  ON public.usuarios FOR ALL
  USING (auth.uid() = auth_id);

DROP POLICY IF EXISTS "Los usuarios autenticados pueden gestionar clientes" ON public.clientes;
CREATE POLICY "Los usuarios autenticados pueden gestionar clientes"
  ON public.clientes FOR ALL
  USING (auth.role() = 'authenticated');
