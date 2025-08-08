import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Inicializando Supabase con:', {
  url: supabaseUrl ? 'Configurado' : 'NO CONFIGURADO',
  key: supabaseAnonKey ? 'Configurado' : 'NO CONFIGURADO'
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Variables de entorno faltantes:', {
    VITE_SUPABASE_URL: supabaseUrl,
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? '[OCULTA]' : 'NO DEFINIDA'
  });
  throw new Error(
    'Las variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY son requeridas. ' +
    'Por favor, copia el archivo .env.example a .env y configura tus credenciales de Supabase.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window?.localStorage,
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Función para verificar la conectividad
export const checkSupabaseConnection = async () => {
  try {
    console.log('Verificando conexión a Supabase...');
    
    // Verificar autenticación (esto es lo que realmente importa)
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error de conexión a Supabase:', error);
      return false;
    }
    
    console.log('✅ Conexión a Supabase exitosa');
    console.log('✅ Auth API funcionando correctamente');
    
    // Opcional: probar también la API REST
    try {
      await supabase.from('usuarios').select('count').limit(1);
      console.log('✅ API REST funcionando correctamente');
    } catch (dbError) {
      console.warn('⚠️ Auth funciona, pero hay problemas con la API REST:', dbError.message);
    }
    
    return true;
  } catch (error) {
    console.error('❌ Error fatal de conexión a Supabase:', error);
    return false;
  }
}
