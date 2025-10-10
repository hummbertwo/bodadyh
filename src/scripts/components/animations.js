// ========================================
// COMPONENTE ANIMACIONES DE SCROLL
// ========================================

class ScrollAnimations {
  constructor() {
    this.observers = new Map();
    this.init();
  }

  /**
   * Inicializa las animaciones de scroll
   */
  init() {
    this.setupSectionAnimations();
    this.setupElementAnimations();
  }

  /**
   * Configura animaciones para secciones
   */
  setupSectionAnimations() {
    const sections = document.querySelectorAll('section');
    
    if (sections.length === 0) {
      console.warn('No se encontraron secciones para animar');
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { 
      threshold: CONFIG.animations.scrollThreshold 
    });

    sections.forEach(section => observer.observe(section));
    this.observers.set('sections', observer);
  }

  /**
   * Configura animaciones para elementos específicos
   */
  setupElementAnimations() {
    const elementosAnimar = document.querySelectorAll('.animar');
    
    if (elementosAnimar.length === 0) {
      console.warn('No se encontraron elementos .animar');
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('focus-in-contract-bck');
          observer.unobserve(entry.target); // Solo una vez
        }
      });
    }, {
      threshold: CONFIG.animations.scrollThreshold
    });

    elementosAnimar.forEach(elemento => observer.observe(elemento));
    this.observers.set('elements', observer);
  }

  /**
   * Agrega animación a un elemento específico
   * @param {HTMLElement} element - Elemento a animar
   * @param {string} animationClass - Clase de animación
   * @param {number} threshold - Umbral de intersección
   */
  addElementAnimation(element, animationClass = 'fade-in', threshold = 0.6) {
    if (!element) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animationClass);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold });

    observer.observe(element);
    return observer;
  }

  /**
   * Anima elementos con delay escalonado
   * @param {NodeList|Array} elements - Elementos a animar
   * @param {string} animationClass - Clase de animación
   * @param {number} delay - Delay entre elementos en ms
   */
  staggerAnimation(elements, animationClass = 'fade-in', delay = 100) {
    Array.from(elements).forEach((element, index) => {
      setTimeout(() => {
        element.classList.add(animationClass);
      }, index * delay);
    });
  }

  /**
   * Crea una animación de entrada personalizada
   * @param {HTMLElement} element - Elemento a animar
   * @param {Object} options - Opciones de animación
   */
  createCustomAnimation(element, options = {}) {
    const defaults = {
      duration: 600,
      delay: 0,
      easing: 'ease-out',
      from: { opacity: 0, transform: 'translateY(20px)' },
      to: { opacity: 1, transform: 'translateY(0)' }
    };

    const config = { ...defaults, ...options };

    element.style.transition = `all ${config.duration}ms ${config.easing}`;
    element.style.transitionDelay = `${config.delay}ms`;
    
    // Aplicar estado inicial
    Object.assign(element.style, config.from);
    
    // Trigger reflow
    element.offsetHeight;
    
    // Aplicar estado final
    setTimeout(() => {
      Object.assign(element.style, config.to);
    }, config.delay);
  }

  /**
   * Anima elementos cuando entran en viewport
   * @param {string} selector - Selector de elementos
   * @param {Object} options - Opciones de animación
   */
  animateOnScroll(selector, options = {}) {
    const elements = document.querySelectorAll(selector);
    
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.createCustomAnimation(entry.target, options);
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: options.threshold || 0.6 
    });

    elements.forEach(element => observer.observe(element));
    return observer;
  }

  /**
   * Destruye todos los observers
   */
  destroy() {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
  }

  /**
   * Obtiene información de los observers activos
   * @returns {Object} - Información de observers
   */
  getInfo() {
    return {
      activeObservers: this.observers.size,
      observerTypes: Array.from(this.observers.keys())
    };
  }
}

// Exportar para uso global
window.ScrollAnimations = ScrollAnimations;
