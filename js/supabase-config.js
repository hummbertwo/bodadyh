// ==========================
// CONFIGURACIÓN GLOBAL SUPABASE
// ==========================
const SUPABASE_CONFIG = {
  URL: "https://sqkluttgalypumizrrnd.supabase.co",
  KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxa2x1dHRnYWx5cHVtaXpycm5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjQzODksImV4cCI6MjA3NTM0MDM4OX0.HjgeLkD1gmEV3psPA-jlkfmJlsJR5904vF4gieaPZnI",
  HEADERS: {
    "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxa2x1dHRnYWx5cHVtaXpycm5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjQzODksImV4cCI6MjA3NTM0MDM4OX0.HjgeLkD1gmEV3psPA-jlkfmJlsJR5904vF4gieaPZnI",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxa2x1dHRnYWx5cHVtaXpycm5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjQzODksImV4cCI6MjA3NTM0MDM4OX0.HjgeLkD1gmEV3psPA-jlkfmJlsJR5904vF4gieaPZnI",
    "Content-Type": "application/json"
  }
};

// ==========================
// FUNCIONES UTILITARIAS PARA SUPABASE
// ==========================
class SupabaseClient {
  constructor(config) {
    this.config = config;
  }

  async fetchData(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.config.URL}${endpoint}`, {
        method: options.method || 'GET',
        headers: { ...this.config.HEADERS, ...options.headers },
        body: options.body ? JSON.stringify(options.body) : undefined
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en Supabase request:', error);
      throw error;
    }
  }

  async saveConfirmation(data) {
    return this.fetchData('/rest/v1/confirmaciones', {
      method: 'POST',
      body: data,
      headers: { ...this.config.HEADERS, "Prefer": "return=representation" }
    });
  }

  async getConfirmations() {
    return this.fetchData('/rest/v1/confirmaciones?order=timestamp.desc');
  }
}

// Instancia global
const supabase = new SupabaseClient(SUPABASE_CONFIG);
