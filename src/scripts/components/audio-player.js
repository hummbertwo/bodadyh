// ========================================
// COMPONENTE REPRODUCTOR DE AUDIO
// ========================================

class AudioPlayer {
  constructor() {
    this.audio = document.getElementById('weddingSong');
    this.btn = document.getElementById('audioPlayBtn');
    this.icon = document.getElementById('iconPlayPause');
    this.isPlaying = false;
    
    // Iconos SVG
    this.playIconPath = "M8 5v14l11-7z";
    this.pauseIconPath = "M6 19h4V5H6v14zm8-14v14h4V5h-4z";
    
    this.init();
  }

  /**
   * Inicializa el reproductor de audio
   */
  init() {
    // Validar elementos
    if (!this.audio || !this.btn || !this.icon) {
      console.warn('Elementos de audio no encontrados');
      return;
    }

    // Configurar audio
    this.setupAudio();
    
    // Configurar eventos
    this.setupEvents();
    
    // Intentar autoplay
    this.attemptAutoplay();
  }

  /**
   * Configura las propiedades del audio
   */
  setupAudio() {
    this.audio.volume = CONFIG.audio.volume;
    this.audio.loop = CONFIG.audio.loop;
  }

  /**
   * Configura los event listeners
   */
  setupEvents() {
    // Auto-play en carga si está permitido
    window.addEventListener('load', () => {
      this.attemptAutoplay();
    });

    // Reproducir en interacción del usuario (excepto botón)
    document.addEventListener('click', (e) => {
      if (!this.isPlaying && !this.btn.contains(e.target)) {
        this.play();
      }
    });

    // Toggle play/pause con botón
    this.btn.addEventListener('click', () => {
      this.toggle();
    });

    // Reset cuando termina el audio
    this.audio.addEventListener('ended', () => {
      this.setPlayIcon();
      this.isPlaying = false;
    });

    // Manejar errores de audio
    this.audio.addEventListener('error', (e) => {
      console.error('Error en audio:', e);
      Utils.showMessage('Error reproduciendo audio', 'error');
    });
  }

  /**
   * Intenta reproducir automáticamente
   */
  async attemptAutoplay() {
    if (!CONFIG.audio.autoplay) return;
    
    try {
      await this.audio.play();
      this.setPauseIcon();
      this.isPlaying = true;
    } catch (error) {
      console.log("Autoplay bloqueado, esperando interacción.");
    }
  }

  /**
   * Reproduce el audio
   */
  async play() {
    try {
      await this.audio.play();
      this.setPauseIcon();
      this.isPlaying = true;
    } catch (error) {
      console.log("Reproducción aún bloqueada.");
    }
  }

  /**
   * Pausa el audio
   */
  pause() {
    this.audio.pause();
    this.setPlayIcon();
    this.isPlaying = false;
  }

  /**
   * Alterna entre play/pause
   */
  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  /**
   * Establece el icono de play
   */
  setPlayIcon() {
    const pathElement = this.icon.querySelector('path');
    if (pathElement) {
      pathElement.setAttribute('d', this.playIconPath);
    }
    this.btn.title = "Reproducir canción";
  }

  /**
   * Establece el icono de pause
   */
  setPauseIcon() {
    const pathElement = this.icon.querySelector('path');
    if (pathElement) {
      pathElement.setAttribute('d', this.pauseIconPath);
    }
    this.btn.title = "Pausar canción";
  }

  /**
   * Obtiene el estado del reproductor
   * @returns {Object} - Estado actual
   */
  getState() {
    return {
      isPlaying: this.isPlaying,
      currentTime: this.audio.currentTime,
      duration: this.audio.duration,
      volume: this.audio.volume
    };
  }
}

// Exportar para uso global
window.AudioPlayer = AudioPlayer;
