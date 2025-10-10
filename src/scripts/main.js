// ========================================
// ARCHIVO PRINCIPAL JS - Carga todos los módulos
// ========================================

// ========================================
// CARGA DE MÓDULOS CORE
// ========================================
// Los módulos core se cargan primero para estar disponibles globalmente

// ========================================
// CARGA DE COMPONENTES
// ========================================
// Los componentes se cargan después de los módulos core

// ========================================
// CARGA DE PÁGINAS ESPECÍFICAS
// ========================================
// Las páginas específicas se cargan al final

// ========================================
// INICIALIZACIÓN GLOBAL
// ========================================

/**
 * Inicializa la aplicación según la página actual
 */
function initializeApp() {
  try {
    // Detectar qué página estamos cargando
    const currentPage = detectCurrentPage();
    
    console.log(`Inicializando aplicación para página: ${currentPage}`);
    
    // Inicializar componentes globales comunes
    initializeGlobalComponents();
    
    // Inicializar página específica
    initializePageSpecific(currentPage);
    
    console.log('Aplicación inicializada correctamente');
    
  } catch (error) {
    console.error('Error inicializando aplicación:', error);
  }
}

/**
 * Detecta la página actual basada en la URL o elementos DOM
 * @returns {string} - Nombre de la página actual
 */
function detectCurrentPage() {
  const path = window.location.pathname;
  const filename = path.split('/').pop().split('.')[0];
  
  // Detectar por elementos específicos
  if (document.getElementById('lista-confirmaciones')) {
    return 'confirmaciones';
  }
  
  if (document.getElementById('countdown')) {
    return 'home';
  }
  
  // Detectar por nombre de archivo
  switch (filename) {
    case 'confirmaciones':
    case 'lista':
      return 'confirmaciones';
    case 'index':
    case '':
    default:
      return 'home';
  }
}

/**
 * Inicializa componentes globales disponibles en todas las páginas
 */
function initializeGlobalComponents() {
  // Los componentes globales se inicializan automáticamente
  // cuando se cargan sus clases correspondientes
}

/**
 * Inicializa componentes específicos de cada página
 * @param {string} page - Nombre de la página
 */
function initializePageSpecific(page) {
  switch (page) {
    case 'home':
      // La página home se inicializa automáticamente
      // cuando se carga home.js
      break;
      
    case 'confirmaciones':
      // La página de confirmaciones se inicializa automáticamente
      // cuando se carga confirmaciones.js
      break;
      
    default:
      console.warn(`Página no reconocida: ${page}`);
  }
}

/**
 * Maneja errores globales de la aplicación
 * @param {Error} error - Error capturado
 * @param {string} source - Fuente del error
 */
function handleGlobalError(error, source = 'unknown') {
  console.error(`Error en ${source}:`, error);
  
  // Mostrar mensaje de error al usuario si es crítico
  if (error.name === 'TypeError' && error.message.includes('Cannot read property')) {
    Utils.showMessage('Error interno de la aplicación', 'error');
  }
}

/**
 * Configuración de desarrollo
 */
function setupDevelopmentMode() {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Habilitar logs adicionales en desarrollo
    window.DEBUG = true;
    
    // Exponer utilidades globalmente para debugging
    window.debug = {
      CONFIG,
      Utils,
      Supabase,
      getComponentsInfo: () => {
        const info = {};
        if (window.HomePage) info.home = window.HomePage.getComponentsInfo();
        if (window.ConfirmationsPage) info.confirmations = window.ConfirmationsPage.getInfo();
        return info;
      }
    };
    
    console.log('Modo desarrollo activado');
  }
}

// ========================================
// EVENTOS GLOBALES
// ========================================

// Manejar errores no capturados
window.addEventListener('error', (event) => {
  handleGlobalError(event.error, 'global');
});

// Manejar promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
  handleGlobalError(event.reason, 'promise');
});

// ========================================
// INICIALIZACIÓN
// ========================================

// Configurar modo desarrollo
setupDevelopmentMode();

// Inicializar aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Exportar función de inicialización para uso manual
window.initializeApp = initializeApp;
