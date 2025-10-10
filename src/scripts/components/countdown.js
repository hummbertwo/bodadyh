// ========================================
// COMPONENTE CONTADOR REGRESIVO
// ========================================

class CountdownTimer {
  constructor() {
    this.targetDate = new Date(CONFIG.wedding.date).getTime();
    this.countdownInterval = null;
    this.elements = this.getElements();
    
    this.init();
  }

  /**
   * Obtiene los elementos DOM del countdown
   * @returns {Object} - Elementos del countdown
   */
  getElements() {
    return {
      days: document.getElementById("days"),
      hours: document.getElementById("hours"),
      minutes: document.getElementById("minutes"),
      seconds: document.getElementById("seconds")
    };
  }

  /**
   * Inicializa el contador
   */
  init() {
    // Validar que los elementos existen
    const elementsExist = Object.values(this.elements).every(el => el !== null);
    
    if (!elementsExist) {
      console.warn('Elementos del countdown no encontrados');
      return;
    }

    // Iniciar countdown
    this.start();
  }

  /**
   * Inicia el contador regresivo
   */
  start() {
    this.updateCountdown(); // Ejecuta la primera vez inmediatamente
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
    }, 1000);
  }

  /**
   * Detiene el contador
   */
  stop() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  /**
   * Actualiza el contador
   */
  updateCountdown() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    // Si ya pasó la fecha, detener el countdown
    if (distance < 0) {
      this.stop();
      this.setExpiredState();
      return;
    }

    const timeValues = this.calculateTimeValues(distance);
    this.updateDisplay(timeValues);
  }

  /**
   * Calcula los valores de tiempo
   * @param {number} distance - Distancia en milisegundos
   * @returns {Object} - Valores de tiempo calculados
   */
  calculateTimeValues(distance) {
    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000)
    };
  }

  /**
   * Actualiza la visualización del contador
   * @param {Object} timeValues - Valores de tiempo
   */
  updateDisplay(timeValues) {
    Object.entries(timeValues).forEach(([unit, value]) => {
      const element = this.elements[unit];
      if (element) {
        element.textContent = value.toString().padStart(2, '0');
      }
    });
  }

  /**
   * Establece el estado cuando el evento ha pasado
   */
  setExpiredState() {
    Object.values(this.elements).forEach(element => {
      if (element) {
        element.textContent = "00";
      }
    });
    
    // Opcional: mostrar mensaje de que el evento ya pasó
    console.log('¡El evento ya ha pasado!');
  }

  /**
   * Obtiene el tiempo restante
   * @returns {Object} - Tiempo restante en diferentes unidades
   */
  getTimeRemaining() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;
    
    if (distance < 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    
    return this.calculateTimeValues(distance);
  }

  /**
   * Verifica si el evento ya pasó
   * @returns {boolean} - True si ya pasó
   */
  isExpired() {
    return this.targetDate < new Date().getTime();
  }

  /**
   * Destruye el contador y limpia recursos
   */
  destroy() {
    this.stop();
    this.elements = null;
  }
}

// Exportar para uso global
window.CountdownTimer = CountdownTimer;
