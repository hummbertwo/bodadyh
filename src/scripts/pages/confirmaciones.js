// ========================================
// SCRIPTS ESPECÍFICOS - Página de confirmaciones
// ========================================

class ConfirmationsPage {
  constructor() {
    this.isLoading = false;
    this.init();
  }

  /**
   * Inicializa la página de confirmaciones
   */
  init() {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupPage();
      });
    } else {
      this.setupPage();
    }
  }

  /**
   * Configura la página de confirmaciones
   */
  setupPage() {
    try {
      this.setupEvents();
      this.loadConfirmations();
    } catch (error) {
      console.error('Error inicializando página de confirmaciones:', error);
    }
  }

  /**
   * Configura los eventos de la página
   */
  setupEvents() {
    const recargarBtn = document.getElementById("recargar");
    
    if (recargarBtn) {
      recargarBtn.addEventListener("click", () => {
        this.loadConfirmations();
      });
    }
  }

  /**
   * Carga las confirmaciones desde Supabase
   */
  async loadConfirmations() {
    if (this.isLoading) return;
    
    this.setLoadingState(true);
    
    try {
      const data = await Supabase.getConfirmations();
      
      // Validar datos recibidos
      if (!Array.isArray(data)) {
        throw new Error('Formato de datos inválido');
      }

      // Filtrar confirmaciones
      const confirmaciones = Supabase.filterConfirmations(data, 'si');
      
      this.displayConfirmations(confirmaciones);
      
    } catch (error) {
      console.error("Error cargando confirmaciones:", error);
      this.showErrorState();
    } finally {
      this.setLoadingState(false);
    }
  }

  /**
   * Muestra las confirmaciones en la interfaz
   * @param {Array} confirmaciones - Lista de confirmaciones
   */
  displayConfirmations(confirmaciones) {
    const contenedor = document.getElementById("lista-confirmaciones");
    
    if (!contenedor) {
      console.error('Contenedor de lista no encontrado');
      return;
    }

    contenedor.innerHTML = "";

    if (confirmaciones.length === 0) {
      this.showEmptyState(contenedor);
      return;
    }

    // Crear tarjetas con animación escalonada
    confirmaciones.forEach((row, idx) => {
      const card = this.createConfirmationCard(row, idx);
      contenedor.appendChild(card);
    });
  }

  /**
   * Crea una tarjeta de confirmación
   * @param {Object} row - Datos de la confirmación
   * @param {number} index - Índice para animación
   * @returns {HTMLElement} - Elemento de tarjeta
   */
  createConfirmationCard(row, index) {
    const card = document.createElement("div");
    card.className = "card fade-in";
    card.style.animationDelay = `${index * CONFIG.animations.animationDelay}s`;
    
    // Escapar datos para seguridad
    const codigoEscapado = Utils.escapeHtml(row.codigo);
    const nombreEscapado = Utils.escapeHtml(row.nombre);
    const fechaFormateada = Utils.formatDate(row.timestamp);
    
    card.innerHTML = `
      <div class="info">
        <span><strong>Código:</strong> ${codigoEscapado}</span>
        <span><strong>Nombre:</strong> ${nombreEscapado}</span>
        <span><strong>Fecha:</strong> ${fechaFormateada}</span>
      </div>
      <div class="status">✅ Asiste</div>
    `;
    
    return card;
  }

  /**
   * Muestra estado de carga
   * @param {boolean} loading - Estado de carga
   */
  setLoadingState(loading) {
    this.isLoading = loading;
    const recargarBtn = document.getElementById("recargar");
    
    if (recargarBtn) {
      recargarBtn.disabled = loading;
      recargarBtn.textContent = loading ? "Cargando..." : "Recargar Confirmaciones";
    }
  }

  /**
   * Muestra estado de error
   */
  showErrorState() {
    const contenedor = document.getElementById("lista-confirmaciones");
    
    if (contenedor) {
      contenedor.innerHTML = `
        <div class="card error-state">
          <div class="info">
            <span style="color: var(--color-error);">
              ❌ Error cargando datos. Intenta nuevamente.
            </span>
          </div>
        </div>
      `;
    }
  }

  /**
   * Muestra estado vacío
   * @param {HTMLElement} contenedor - Contenedor donde mostrar
   */
  showEmptyState(contenedor) {
    contenedor.innerHTML = `
      <div class="card empty-state">
        <div class="info">
          <span>📝 No hay confirmaciones aún</span>
        </div>
      </div>
    `;
  }

  /**
   * Actualiza las confirmaciones manualmente
   */
  refresh() {
    this.loadConfirmations();
  }

  /**
   * Obtiene información de la página
   * @returns {Object} - Información de la página
   */
  getInfo() {
    return {
      isLoading: this.isLoading,
      hasConfirmations: document.getElementById("lista-confirmaciones")?.children.length > 0
    };
  }
}

// Inicializar página de confirmaciones
const confirmationsPage = new ConfirmationsPage();

// Exportar para uso global
window.ConfirmationsPage = confirmationsPage;
