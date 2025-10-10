// ========================================
// UTILIDADES GENERALES
// ========================================

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text - Texto a escapar
 * @returns {string} - Texto escapado
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Valida si un elemento DOM existe
 * @param {HTMLElement} element - Elemento a validar
 * @param {string} name - Nombre del elemento para errores
 * @returns {boolean} - True si existe
 */
function validateElement(element, name) {
  if (!element) {
    console.error(`Elemento '${name}' no encontrado`);
    return false;
  }
  return true;
}

/**
 * Valida múltiples elementos DOM
 * @param {Object} elements - Objeto con elementos
 * @returns {Object} - Elementos válidos
 */
function validateElements(elements) {
  const validElements = {};
  const missingElements = [];
  
  Object.entries(elements).forEach(([key, element]) => {
    if (element) {
      validElements[key] = element;
    } else {
      missingElements.push(key);
    }
  });
  
  if (missingElements.length > 0) {
    console.error('Elementos DOM faltantes:', missingElements);
  }
  
  return validElements;
}

/**
 * Debounce function para optimizar eventos
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} - Función debounced
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function para limitar frecuencia de ejecución
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite de tiempo en ms
 * @returns {Function} - Función throttled
 */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Formatea fecha para mostrar
 * @param {Date|string} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Muestra mensaje de error de forma consistente
 * @param {string} message - Mensaje de error
 * @param {string} type - Tipo de mensaje (error, warning, success)
 */
function showMessage(message, type = 'error') {
  // Por ahora usamos alert, pero se puede mejorar con UI
  alert(message);
  
  // Log para debugging
  console[type](`[${type.toUpperCase()}] ${message}`);
}

/**
 * Genera ID único
 * @returns {string} - ID único
 */
function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Verifica si el dispositivo es móvil
 * @returns {boolean} - True si es móvil
 */
function isMobile() {
  return window.innerWidth <= 768;
}

/**
 * Verifica si el dispositivo es tablet
 * @returns {boolean} - True si es tablet
 */
function isTablet() {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
}

/**
 * Verifica si el dispositivo es desktop
 * @returns {boolean} - True si es desktop
 */
function isDesktop() {
  return window.innerWidth > 1024;
}

// Exportar utilidades para uso global
window.Utils = {
  escapeHtml,
  validateElement,
  validateElements,
  debounce,
  throttle,
  formatDate,
  showMessage,
  generateId,
  isMobile,
  isTablet,
  isDesktop
};
