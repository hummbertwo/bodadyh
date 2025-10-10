// ========================================
// COMPONENTE MANEJO DE FORMULARIOS
// ========================================

class FormHandler {
  constructor() {
    this.elements = this.getElements();
    this.codigoActual = null;
    this.invitados = window.invitados || {};
    
    this.init();
  }

  /**
   * Obtiene los elementos DOM del formulario
   * @returns {Object} - Elementos del formulario
   */
  getElements() {
    const elements = {
      codigoInput: document.getElementById("codigo"),
      verificarBtn: document.getElementById("verificar-btn"),
      listaDiv: document.getElementById("lista-div"),
      listaInvitadosDiv: document.getElementById("lista-invitados"),
      confirmarBtn: document.getElementById("confirmar-btn"),
      resultadoDiv: document.getElementById("resultado-div"),
      mensaje: document.getElementById("mensaje")
    };

    return Utils.validateElements(elements);
  }

  /**
   * Inicializa el manejador de formularios
   */
  init() {
    if (Object.keys(this.elements).length === 0) {
      console.error('No se encontraron elementos del formulario');
      return;
    }

    this.setupEvents();
  }

  /**
   * Configura los eventos del formulario
   */
  setupEvents() {
    // Evento de verificación de código
    if (this.elements.verificarBtn) {
      this.elements.verificarBtn.addEventListener("click", () => {
        this.handleCodeVerification();
      });
    }

    // Evento de confirmación
    if (this.elements.confirmarBtn) {
      this.elements.confirmarBtn.addEventListener("click", () => {
        this.handleConfirmation();
      });
    }

    // Enter en el input de código
    if (this.elements.codigoInput) {
      this.elements.codigoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          this.handleCodeVerification();
        }
      });
    }
  }

  /**
   * Maneja la verificación del código
   */
  handleCodeVerification() {
    try {
      const codigo = this.elements.codigoInput.value.trim();
      
      // Validar código
      if (!codigo) {
        Utils.showMessage("Por favor ingresa un código");
        return;
      }

      const lista = this.invitados[codigo];

      this.clearForm();
      this.hideResult();

      if (!lista) {
        Utils.showMessage("Código incorrecto. Verifica con los organizadores.");
        return;
      }

      this.codigoActual = codigo;
      this.showGuestList(lista);
      
    } catch (error) {
      console.error('Error verificando código:', error);
      Utils.showMessage("Error interno. Intenta nuevamente.");
    }
  }

  /**
   * Muestra la lista de invitados
   * @param {Array} lista - Lista de nombres
   */
  showGuestList(lista) {
    if (this.elements.verificarBtn) {
      this.elements.verificarBtn.style.display = "none";
    }
    
    if (this.elements.listaDiv) {
      this.elements.listaDiv.classList.remove("hidden");
    }

    // Crear elementos de forma más segura
    lista.forEach((nombre, index) => {
      const guestDiv = document.createElement("div");
      guestDiv.className = "guest";
      guestDiv.innerHTML = `
        <label style="font-weight:bold;">${Utils.escapeHtml(nombre)}</label>
        <div style="margin-top:5px;">
          <label style="margin-right:15px;">
            <input type="radio" name="asistencia_${index}" value="si" required> ✅ Sí
          </label>
          <label>
            <input type="radio" name="asistencia_${index}" value="no"> ❌ No
          </label>
        </div>
      `;
      
      if (this.elements.listaInvitadosDiv) {
        this.elements.listaInvitadosDiv.appendChild(guestDiv);
      }
    });
  }

  /**
   * Maneja la confirmación de asistencia
   */
  async handleConfirmation() {
    try {
      if (!this.codigoActual) {
        Utils.showMessage("No hay código válido");
        return;
      }

      const lista = this.invitados[this.codigoActual];
      const respuestas = this.collectResponses(lista);
      
      this.showResult(respuestas);
      await this.saveConfirmations(respuestas);
      
    } catch (error) {
      console.error('Error en confirmación:', error);
      Utils.showMessage("Error interno. Intenta nuevamente.");
    }
  }

  /**
   * Recolecta las respuestas del formulario
   * @param {Array} lista - Lista de nombres
   * @returns {Array} - Respuestas recolectadas
   */
  collectResponses(lista) {
    return lista.map((nombre, index) => {
      const opcion = document.querySelector(`input[name="asistencia_${index}"]:checked`);
      return { 
        nombre, 
        asistencia: opcion ? opcion.value : "no_responde" 
      };
    });
  }

  /**
   * Muestra el resultado de la confirmación
   * @param {Array} respuestas - Respuestas del formulario
   */
  showResult(respuestas) {
    const todosNo = respuestas.every(r => r.asistencia === "no");
    
    if (this.elements.listaDiv) {
      this.elements.listaDiv.classList.add("hidden");
    }
    
    if (this.elements.resultadoDiv) {
      this.elements.resultadoDiv.classList.remove("hidden");
    }

    if (todosNo) {
      if (this.elements.mensaje) {
        this.elements.mensaje.innerText = `Qué lástima, nadie asistirá 😢`;
      }
      this.launchEmojis("😢");
    } else {
      const nombresSi = respuestas.filter(r => r.asistencia === "si").map(r => r.nombre);
      if (this.elements.mensaje) {
        this.elements.mensaje.innerText = `Gracias ${nombresSi.join(", ")} por confirmar! 🎉`;
      }
      this.launchConfetti();
    }
  }

  /**
   * Guarda las confirmaciones en Supabase
   * @param {Array} respuestas - Respuestas a guardar
   */
  async saveConfirmations(respuestas) {
    const confirmations = respuestas.map(r => ({
      codigo: this.codigoActual,
      nombre: r.nombre,
      asistencia: r.asistencia
    }));

    try {
      await Supabase.saveMultipleConfirmations(confirmations);
    } catch (error) {
      console.error("Error guardando confirmaciones:", error);
      // No mostrar error al usuario ya que la confirmación visual ya se mostró
    }
  }

  /**
   * Limpia el formulario
   */
  clearForm() {
    if (this.elements.listaInvitadosDiv) {
      this.elements.listaInvitadosDiv.innerHTML = "";
    }
  }

  /**
   * Oculta el resultado
   */
  hideResult() {
    if (this.elements.resultadoDiv) {
      this.elements.resultadoDiv.classList.add("hidden");
    }
    
    if (this.elements.mensaje) {
      this.elements.mensaje.innerText = "";
    }
  }

  /**
   * Lanza confeti
   */
  launchConfetti() {
    if (typeof confetti !== 'undefined') {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      function fire(particleRatio, opts) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio)
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }

  /**
   * Lanza emojis animados
   * @param {string} emoji - Emoji a mostrar
   */
  launchEmojis(emoji = "😢") {
    for (let i = 0; i < 30; i++) {
      const span = document.createElement("span");
      span.textContent = emoji;
      span.style.cssText = `
        position: fixed;
        font-size: ${24 + Math.random() * 24}px;
        z-index: 9999;
        left: ${Math.random() * 90}vw;
        bottom: -50px;
        pointer-events: none;
        transition: transform 5s linear, opacity 5s linear;
        opacity: 1;
      `;

      document.body.appendChild(span);

      // Animación
      const finalY = -100 - Math.random() * 200;
      const rotate = Math.random() * 360;
      requestAnimationFrame(() => {
        span.style.transform = `translateY(${finalY}px) rotate(${rotate}deg)`;
        span.style.opacity = 0;
      });

      // Eliminar después de 5s
      setTimeout(() => span.remove(), 5000);
    }
  }

  /**
   * Resetea el formulario
   */
  reset() {
    this.codigoActual = null;
    this.clearForm();
    this.hideResult();
    
    if (this.elements.verificarBtn) {
      this.elements.verificarBtn.style.display = "block";
    }
    
    if (this.elements.listaDiv) {
      this.elements.listaDiv.classList.add("hidden");
    }
  }
}

// Exportar para uso global
window.FormHandler = FormHandler;
