#!/usr/bin/env node

/**
 * Utilidades para gestión de variables de entorno
 * 
 * Uso:
 * - node scripts/env-utils.js generate-password
 * - node scripts/env-utils.js check-env
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const ENV_FILE = '.env';
const ENV_EXAMPLE_FILE = '.env.example';

/**
 * Genera una contraseña segura aleatoria
 */
function generateSecurePassword(length = 16) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, charset.length);
    password += charset[randomIndex];
  }
  
  return password;
}

/**
 * Verifica si existe el archivo .env
 */
function checkEnvFile() {
  const envPath = path.resolve(ENV_FILE);
  const envExamplePath = path.resolve(ENV_EXAMPLE_FILE);
  
  console.log('🔍 Verificando configuración de variables de entorno...\n');
  
  if (fs.existsSync(envPath)) {
    console.log('✅ Archivo .env encontrado');
    
    // Leer y mostrar las variables configuradas (sin mostrar valores sensibles)
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    
    console.log('\n📝 Variables configuradas:');
    lines.forEach(line => {
      const [key] = line.split('=');
      if (key) {
        const isPassword = key.toLowerCase().includes('password');
        console.log(`   ${key} = ${isPassword ? '***' : '✓'}`);
      }
    });
    
  } else {
    console.log('❌ Archivo .env no encontrado');
    
    if (fs.existsSync(envExamplePath)) {
      console.log('💡 Archivo .env.example encontrado');
      console.log('   Para crear tu archivo .env, ejecuta:');
      console.log('   cp .env.example .env');
    } else {
      console.log('❌ Archivo .env.example tampoco encontrado');
    }
  }
}

/**
 * Crea un archivo .env básico con valores seguros
 */
function createEnvFile() {
  const envPath = path.resolve(ENV_FILE);
  
  if (fs.existsSync(envPath)) {
    console.log('⚠️  El archivo .env ya existe. No se sobrescribirá.');
    return;
  }
  
  const securePassword = generateSecurePassword(20);
  
  const envContent = `# Credenciales del Administrador
VITE_ADMIN_USERNAME=admin
VITE_ADMIN_PASSWORD=${securePassword}
VITE_ADMIN_ROLE=admin
VITE_ADMIN_DISPLAY_NAME=Administrador del Sistema

# Configuración de la aplicación
VITE_APP_NAME=Sistema de Consentimiento
VITE_APP_VERSION=1.0.0
`;

  fs.writeFileSync(envPath, envContent);
  console.log('✅ Archivo .env creado exitosamente');
  console.log(`🔐 Contraseña generada: ${securePassword}`);
  console.log('⚠️  Guarda esta contraseña en un lugar seguro');
}

/**
 * Función principal
 */
function main() {
  const command = process.argv[2];
  
  switch (command) {
    case 'generate-password':
      const length = parseInt(process.argv[3]) || 16;
      const password = generateSecurePassword(length);
      console.log('🔐 Contraseña segura generada:');
      console.log(password);
      console.log(`\n💡 Longitud: ${length} caracteres`);
      console.log('⚠️  Guarda esta contraseña en un lugar seguro');
      break;
      
    case 'check-env':
      checkEnvFile();
      break;
      
    case 'create-env':
      createEnvFile();
      break;
      
    case 'help':
    case '--help':
    case '-h':
      console.log('🛠️  Utilidades para variables de entorno\n');
      console.log('Comandos disponibles:');
      console.log('  generate-password [length]  Genera una contraseña segura');
      console.log('  check-env                   Verifica la configuración actual');
      console.log('  create-env                  Crea un archivo .env con valores seguros');
      console.log('  help                        Muestra esta ayuda');
      console.log('\nEjemplos:');
      console.log('  node scripts/env-utils.js generate-password 20');
      console.log('  node scripts/env-utils.js check-env');
      console.log('  node scripts/env-utils.js create-env');
      break;
      
    default:
      console.log('❌ Comando no reconocido. Usa "help" para ver los comandos disponibles.');
      break;
  }
}

// Ejecutar solo si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
