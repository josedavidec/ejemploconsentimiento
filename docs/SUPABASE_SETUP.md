# 🚀 Configuración de Supabase

Esta guía te ayudará a configurar Supabase para tu proyecto de gestión de consentimientos.

## 📋 Prerrequisitos

- Cuenta en [supabase.com](https://supabase.com)
- Node.js y npm instalados
- Proyecto React funcionando

## 🔧 Paso 1: Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y crea una cuenta
2. Haz clic en "New Project"
3. Configura tu proyecto:
   - **Name**: `ejemplo-consentimiento`
   - **Database Password**: Usa una contraseña fuerte y guárdala
   - **Region**: `Europe (eu-central-1)` (más cercana a España)
4. Haz clic en "Create new project"

## 🗄️ Paso 2: Ejecutar el script SQL

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Copia y pega el contenido del archivo `database/schema.sql`
3. Haz clic en "Run" para ejecutar el script
4. Verifica que las tablas se crearon correctamente en la pestaña **Table Editor**

## 🔑 Paso 3: Obtener las credenciales

1. Ve a **Settings** > **API**
2. Copia los siguientes valores:
   - **Project URL** 
   - **anon public** key

## ⚙️ Paso 4: Configurar variables de entorno

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita el archivo `.env` con tus credenciales:
```env
# Configuración de Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key_aqui

# Configuración de la aplicación
VITE_APP_NAME=Sistema de Consentimiento
VITE_APP_VERSION=1.0.0

# Credenciales del primer administrador
VITE_ADMIN_EMAIL=admin@ejemplo.com
VITE_ADMIN_PASSWORD=tu_password_aqui
VITE_ADMIN_DISPLAY_NAME=Administrador del Sistema
```

## 👤 Paso 5: Crear el primer usuario administrador

### Opción A: Desde la consola de Supabase
1. Ve a **Authentication** > **Users**
2. Haz clic en "Add user"
3. Ingresa el email y contraseña del admin
4. En **User Metadata** agrega:
```json
{
  "nombre": "Administrador del Sistema",
  "rol": "admin"
}
```

### Opción B: Desde el código (recomendado)
El sistema creará automáticamente el perfil en la tabla `usuarios` cuando hagas login por primera vez.

## 🧪 Paso 6: Probar la aplicación

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. Abre el navegador en `http://localhost:5173`

3. Intenta hacer login con las credenciales que configuraste

4. Si todo está correcto, deberías ver el dashboard con los datos de ejemplo

## 🔒 Paso 7: Configurar Row Level Security (Producción)

Para producción, te recomendamos configurar políticas de RLS más estrictas:

1. Ve a **Authentication** > **Policies**
2. Revisa las políticas creadas por el script SQL
3. Ajusta según tus necesidades de seguridad

## 🚀 Paso 8: Despliegue

### Variables de entorno en producción:
- **Vercel/Netlify**: Configura las variables en el panel de control
- **Heroku**: Usa `heroku config:set VITE_SUPABASE_URL=...`
- **Docker**: Usa un archivo `.env.production`

## 🛠️ Troubleshooting

### Error: "These credentials do not correspond to a user"
- Verifica que hayas creado el usuario en Supabase Auth
- Confirma que el email y contraseña son correctos

### Error: "Missing environment variables"
- Verifica que el archivo `.env` existe y está en la raíz del proyecto
- Confirma que las variables comienzan con `VITE_`

### Error: "relation does not exist"
- Asegúrate de haber ejecutado el script SQL completo
- Verifica que las tablas existen en el Table Editor

### Error de CORS
- Verifica que tu dominio esté en la lista de dominios permitidos
- En desarrollo, `localhost:5173` debería funcionar automáticamente

## 📚 Recursos adicionales

- [Documentación oficial de Supabase](https://supabase.com/docs)
- [Guía de React + Supabase](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)
- [Configuración de Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

## 🆘 Soporte

Si tienes problemas con la configuración, revisa:
1. Los logs de la consola del navegador
2. Los logs del servidor de desarrollo
3. La pestaña Network en DevTools

¡Tu aplicación ahora está conectada a Supabase! 🎉
