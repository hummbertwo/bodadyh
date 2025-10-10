// ========================================
// CLIENTE SUPABASE OPTIMIZADO
// ========================================

class SupabaseClient {
  constructor(config) {
    this.config = config;
    this.baseUrl = config.url;
    this.headers = config.headers;
  }

  /**
   * Realiza petición HTTP a Supabase
   * @param {string} endpoint - Endpoint de la API
   * @param {Object} options - Opciones de la petición
   * @returns {Promise<Object>} - Respuesta de la API
   */
  async request(endpoint, options = {}) {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const requestOptions = {
        method: options.method || 'GET',
        headers: { ...this.headers, ...options.headers },
        body: options.body ? JSON.stringify(options.body) : undefined
      };

      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error en Supabase request:', error);
      throw error;
    }
  }

  /**
   * Guarda confirmación de asistencia
   * @param {Object} data - Datos de la confirmación
   * @returns {Promise<Object>} - Respuesta de la API
   */
  async saveConfirmation(data) {
    return this.request('/rest/v1/confirmaciones', {
      method: 'POST',
      body: data,
      headers: {
        ...this.headers,
        "Prefer": "return=representation"
      }
    });
  }

  /**
   * Obtiene todas las confirmaciones
   * @returns {Promise<Array>} - Lista de confirmaciones
   */
  async getConfirmations() {
    return this.request('/rest/v1/confirmaciones?order=timestamp.desc');
  }

  /**
   * Guarda múltiples confirmaciones en paralelo
   * @param {Array} confirmations - Array de confirmaciones
   * @returns {Promise<Array>} - Respuestas de la API
   */
  async saveMultipleConfirmations(confirmations) {
    const promises = confirmations.map(confirmation => 
      this.saveConfirmation(confirmation)
    );
    
    try {
      const results = await Promise.all(promises);
      console.log('Todas las confirmaciones guardadas exitosamente');
      return results;
    } catch (error) {
      console.error('Error guardando confirmaciones:', error);
      throw error;
    }
  }

  /**
   * Filtra confirmaciones por asistencia
   * @param {Array} confirmations - Lista de confirmaciones
   * @param {string} asistencia - Tipo de asistencia ('si', 'no')
   * @returns {Array} - Confirmaciones filtradas
   */
  filterConfirmations(confirmations, asistencia = 'si') {
    if (!Array.isArray(confirmations)) {
      return [];
    }

    const filtrados = [];
    const vistos = new Set();

    confirmations.forEach(row => {
      // Validar estructura de cada fila
      if (!row || typeof row !== 'object') return;
      if (!row.codigo || !row.nombre || !row.timestamp) return;
      
      const key = `${row.codigo}-${row.nombre}`;
      if (!vistos.has(key) && row.asistencia === asistencia) {
        filtrados.push(row);
        vistos.add(key);
      }
    });

    return filtrados;
  }
}

// Crear instancia global usando la configuración
const supabaseClient = new SupabaseClient(CONFIG.supabase);

// Exportar para uso global
window.Supabase = supabaseClient;
