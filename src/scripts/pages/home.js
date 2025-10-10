// ========================================
// SCRIPTS ESPECÍFICOS - Página principal
// ========================================

class HomePage {
  constructor() {
    this.components = {};
    this.init();
  }

  /**
   * Inicializa la página principal
   */
  init() {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupComponents();
      });
    } else {
      this.setupComponents();
    }
  }

  /**
   * Configura todos los componentes de la página
   */
  setupComponents() {
    try {
      // Inicializar animaciones de scroll
      this.components.scrollAnimations = new ScrollAnimations();
      
      // Inicializar reproductor de audio
      this.components.audioPlayer = new AudioPlayer();
      
      // Inicializar contador regresivo
      this.components.countdown = new CountdownTimer();
      
      // Inicializar galería de imágenes
      this.components.gallery = new ImageGallery();
      
      // Inicializar manejador de formularios
      this.components.formHandler = new FormHandler();
      
      console.log('Página principal inicializada correctamente');
      
    } catch (error) {
      console.error('Error inicializando página principal:', error);
    }
  }

  /**
   * Obtiene información de todos los componentes
   * @returns {Object} - Información de componentes
   */
  getComponentsInfo() {
    const info = {};
    
    Object.entries(this.components).forEach(([name, component]) => {
      if (component && typeof component.getInfo === 'function') {
        info[name] = component.getInfo();
      } else {
        info[name] = { status: 'active' };
      }
    });
    
    return info;
  }

  /**
   * Destruye todos los componentes
   */
  destroy() {
    Object.values(this.components).forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    this.components = {};
  }
}

// Inicializar página principal
const homePage = new HomePage();

// Exportar para uso global
window.HomePage = homePage;
