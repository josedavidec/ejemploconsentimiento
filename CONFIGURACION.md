# Configuración del Sistema

## Variables de Entorno

Este proyecto utiliza variables de entorno para manejar las credenciales del administrador y otras configuraciones sensibles.

### Configuración Inicial

1. Copia el archivo `.env.example` y renómbralo a `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edita el archivo `.env` con tus credenciales:
   ```env
   # Credenciales del Administrador
   VITE_ADMIN_USERNAME=tu_usuario_admin
   VITE_ADMIN_PASSWORD=tu_contraseña_segura
   VITE_ADMIN_ROLE=admin
   VITE_ADMIN_DISPLAY_NAME=Nombre del Administrador

   # Configuración de la aplicación
   VITE_APP_NAME=Sistema de Consentimiento
   VITE_APP_VERSION=1.0.0
   ```

### Variables de Entorno Disponibles

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_ADMIN_USERNAME` | Nombre de usuario del administrador | `admin` |
| `VITE_ADMIN_PASSWORD` | Contraseña del administrador | `admin` |
| `VITE_ADMIN_ROLE` | Rol del administrador | `admin` |
| `VITE_ADMIN_DISPLAY_NAME` | Nombre para mostrar del administrador | `Administrador` |
| `VITE_APP_NAME` | Nombre de la aplicación | `Sistema de Consentimiento` |
| `VITE_APP_VERSION` | Versión de la aplicación | `1.0.0` |

### Seguridad

⚠️ **IMPORTANTE**: 
- El archivo `.env` está incluido en `.gitignore` para evitar que se suba al repositorio.
- Nunca compartas tu archivo `.env` en repositorios públicos.
- Usa contraseñas seguras para el administrador.
- En producción, considera usar un sistema de gestión de secretos más robusto.

### Desarrollo

Para desarrollo local, puedes usar las credenciales por defecto:
- Usuario: `admin`
- Contraseña: `admin123`

### Scripts de Utilidades

El proyecto incluye scripts útiles para gestionar las variables de entorno:

```bash
# Verificar configuración actual
npm run env:check

# Crear archivo .env con contraseña segura automática
npm run env:create

# Generar una nueva contraseña segura
npm run env:generate-password

# Configuración inicial completa
npm run setup
```

### Instalación y Ejecución

```bash
# Configuración inicial (recomendado para nuevos desarrolladores)
npm run setup

# O paso a paso:
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
npm run env:check  # Verificar configuración
npm run env:create # Crear .env si no existe

# 3. Ejecutar en modo desarrollo
npm run dev

# Construir para producción
npm run build
```

## Acceso de Administrador

Una vez configurado, puedes acceder al sistema con las credenciales configuradas en tu archivo `.env`.

La interfaz de administración te permitirá:
- Gestionar usuarios
- Ver y exportar datos
- Configurar el sistema
- Monitorear la actividad
