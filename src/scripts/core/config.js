// ========================================
// CONFIGURACIÓN GLOBAL DEL PROYECTO
// ========================================

const CONFIG = {
  // Configuración de la boda
  wedding: {
    date: "2026-02-01T08:00:00",
    bride: "Daniela",
    groom: "Humberto",
    ceremony: {
      location: "Iglesia Templo Santo Domingo Savio",
      time: "3:00pm",
      address: "https://maps.app.goo.gl/mxoMxy9c2A38BK9NA"
    },
    reception: {
      location: "Salón Elite Eventos Black",
      time: "7:30pm",
      address: "https://maps.app.goo.gl/cmQbFhKMeAZL4BSg7"
    }
  },
  
  // Configuración de Supabase
  supabase: {
    url: "https://sqkluttgalypumizrrnd.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxa2x1dHRnYWx5cHVtaXpycm5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjQzODksImV4cCI6MjA3NTM0MDM4OX0.HjgeLkD1gmEV3psPA-jlkfmJlsJR5904vF4gieaPZnI",
    headers: {
      "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxa2x1dHRnYWx5cHVtaXpycm5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjQzODksImV4cCI6MjA3NTM0MDM4OX0.HjgeLkD1gmEV3psPA-jlkfmJlsJR5904vF4gieaPZnI",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxa2x1dHRnYWx5cHVtaXpycm5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjQzODksImV4cCI6MjA3NTM0MDM4OX0.HjgeLkD1gmEV3psPA-jlkfmJlsJR5904vF4gieaPZnI",
      "Content-Type": "application/json"
    }
  },
  
  // Configuración de animaciones
  animations: {
    scrollThreshold: 0.6,
    fadeInDuration: 0.6,
    animationDelay: 0.05
  },
  
  // Configuración de audio
  audio: {
    autoplay: true,
    volume: 0.7,
    loop: true
  }
};

// Exportar configuración para uso en otros módulos
window.CONFIG = CONFIG;
