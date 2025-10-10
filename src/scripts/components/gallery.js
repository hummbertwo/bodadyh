// ========================================
// COMPONENTE GALERÍA DE IMÁGENES
// ========================================

class ImageGallery {
  constructor(containerSelector = '.galeria-grid') {
    this.container = document.querySelector(containerSelector);
    this.images = [];
    this.currentIndex = 0;
    this.isModalOpen = false;
    
    this.init();
  }

  /**
   * Inicializa la galería
   */
  init() {
    if (!this.container) {
      console.warn('Contenedor de galería no encontrado');
      return;
    }

    this.loadImages();
    this.setupEvents();
  }

  /**
   * Carga las imágenes de la galería
   */
  loadImages() {
    const imageElements = this.container.querySelectorAll('img');
    this.images = Array.from(imageElements).map((img, index) => ({
      src: img.src,
      alt: img.alt,
      index: index
    }));
  }

  /**
   * Configura los eventos de la galería
   */
  setupEvents() {
    // Agregar click a cada imagen
    this.container.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        const index = Array.from(this.container.children).indexOf(e.target);
        this.openModal(index);
      }
    });

    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isModalOpen) {
        this.closeModal();
      }
    });
  }

  /**
   * Abre el modal de la galería
   * @param {number} index - Índice de la imagen
   */
  openModal(index) {
    this.currentIndex = index;
    this.isModalOpen = true;
    this.createModal();
    this.showImage(index);
  }

  /**
   * Cierra el modal
   */
  closeModal() {
    const modal = document.getElementById('gallery-modal');
    if (modal) {
      modal.remove();
      this.isModalOpen = false;
    }
  }

  /**
   * Crea el modal de la galería
   */
  createModal() {
    const modal = document.createElement('div');
    modal.id = 'gallery-modal';
    modal.className = 'gallery-modal';
    modal.innerHTML = `
      <div class="gallery-modal-content">
        <span class="gallery-close">&times;</span>
        <img class="gallery-modal-image" src="" alt="">
        <div class="gallery-controls">
          <button class="gallery-prev">‹</button>
          <span class="gallery-counter"></span>
          <button class="gallery-next">›</button>
        </div>
      </div>
    `;

    // Agregar estilos inline para el modal
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    const content = modal.querySelector('.gallery-modal-content');
    content.style.cssText = `
      position: relative;
      max-width: 90%;
      max-height: 90%;
      text-align: center;
    `;

    const image = modal.querySelector('.gallery-modal-image');
    image.style.cssText = `
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
    `;

    const controls = modal.querySelector('.gallery-controls');
    controls.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      align-items: center;
      gap: 20px;
    `;

    // Eventos del modal
    modal.querySelector('.gallery-close').addEventListener('click', () => {
      this.closeModal();
    });

    modal.querySelector('.gallery-prev').addEventListener('click', () => {
      this.previousImage();
    });

    modal.querySelector('.gallery-next').addEventListener('click', () => {
      this.nextImage();
    });

    // Cerrar al hacer click fuera de la imagen
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });

    document.body.appendChild(modal);
  }

  /**
   * Muestra una imagen específica en el modal
   * @param {number} index - Índice de la imagen
   */
  showImage(index) {
    const modal = document.getElementById('gallery-modal');
    if (!modal) return;

    const image = modal.querySelector('.gallery-modal-image');
    const counter = modal.querySelector('.gallery-counter');
    
    if (this.images[index]) {
      image.src = this.images[index].src;
      image.alt = this.images[index].alt;
      counter.textContent = `${index + 1} / ${this.images.length}`;
    }
  }

  /**
   * Muestra la imagen anterior
   */
  previousImage() {
    this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.images.length - 1;
    this.showImage(this.currentIndex);
  }

  /**
   * Muestra la imagen siguiente
   */
  nextImage() {
    this.currentIndex = this.currentIndex < this.images.length - 1 ? this.currentIndex + 1 : 0;
    this.showImage(this.currentIndex);
  }

  /**
   * Agrega una nueva imagen a la galería
   * @param {string} src - URL de la imagen
   * @param {string} alt - Texto alternativo
   */
  addImage(src, alt = '') {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.style.cssText = `
      width: 100%;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
      transition: transform 0.3s ease;
      cursor: pointer;
    `;
    
    img.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.05)';
    });
    
    img.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });

    this.container.appendChild(img);
    this.loadImages(); // Recargar lista de imágenes
  }

  /**
   * Obtiene información de la galería
   * @returns {Object} - Información de la galería
   */
  getInfo() {
    return {
      totalImages: this.images.length,
      currentIndex: this.currentIndex,
      isModalOpen: this.isModalOpen
    };
  }
}

// Exportar para uso global
window.ImageGallery = ImageGallery;
