// ==========================
// CONFIGURACIÓN SUPABASE (usando configuración centralizada)
// ==========================
// La configuración ahora se carga desde supabase-config.js

// ==========================
// ELEMENTOS DEL DOM (con validación)
// ==========================
const elements = {
  codigoInput: document.getElementById("codigo"),
  verificarBtn: document.getElementById("verificar-btn"),
  listaDiv: document.getElementById("lista-div"),
  listaInvitadosDiv: document.getElementById("lista-invitados"),
  confirmarBtn: document.getElementById("confirmar-btn"),
  resultadoDiv: document.getElementById("resultado-div"),
  mensaje: document.getElementById("mensaje")
};

// Validar que todos los elementos existen
const missingElements = Object.entries(elements)
  .filter(([key, element]) => !element)
  .map(([key]) => key);

if (missingElements.length > 0) {
  console.error('Elementos DOM faltantes:', missingElements);
  throw new Error(`Elementos requeridos no encontrados: ${missingElements.join(', ')}`);
}

let codigoActual = null;

// ==========================
// ANIMACIONES
// ==========================
function lanzarConfeti() {
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

function lanzarEmojis(emoji = "😢") {
  for (let i = 0; i < 30; i++) {
    const span = document.createElement("span");
    span.textContent = emoji;
    span.style.position = "fixed";
    span.style.fontSize = `${24 + Math.random() * 24}px`; // tamaño variable
    span.style.zIndex = 9999;
    span.style.left = `${Math.random() * 90}vw`;
    span.style.bottom = `-50px`;
    span.style.pointerEvents = "none";
    span.style.transition = "transform 5s linear, opacity 5s linear";
    span.style.opacity = 1;

    document.body.appendChild(span);

    // Animación
    const finalY = -100 - Math.random() * 200; // sube más arriba
    const rotate = Math.random() * 360;
    requestAnimationFrame(() => {
      span.style.transform = `translateY(${finalY}px) rotate(${rotate}deg)`;
      span.style.opacity = 0;
    });

    // Eliminar después de 5s
    setTimeout(() => span.remove(), 5000);
  }
}

// ==========================
// VERIFICAR CÓDIGO (con mejor manejo de errores)
// ==========================
elements.verificarBtn.addEventListener("click", () => {
  try {
    const codigo = elements.codigoInput.value.trim();
    
    // Validar código
    if (!codigo) {
      showError("Por favor ingresa un código");
      return;
    }

    const lista = invitados[codigo]; // lista.js

    elements.listaInvitadosDiv.innerHTML = "";
    elements.resultadoDiv.classList.add("hidden");
    elements.mensaje.innerText = "";

    if (!lista) {
      showError("Código incorrecto. Verifica con los organizadores.");
      return;
    }

    codigoActual = codigo;
    elements.verificarBtn.style.display = "none";
    elements.listaDiv.classList.remove("hidden");

    // Crear elementos de forma más segura
    lista.forEach((nombre, index) => {
      const guestDiv = document.createElement("div");
      guestDiv.className = "guest";
      guestDiv.innerHTML = `
        <label style="font-weight:bold;">${escapeHtml(nombre)}</label>
        <div style="margin-top:5px;">
          <label style="margin-right:15px;">
            <input type="radio" name="asistencia_${index}" value="si" required> ✅ Sí
          </label>
          <label>
            <input type="radio" name="asistencia_${index}" value="no"> ❌ No
          </label>
        </div>
      `;
      elements.listaInvitadosDiv.appendChild(guestDiv);
    });
  } catch (error) {
    console.error('Error verificando código:', error);
    showError("Error interno. Intenta nuevamente.");
  }
});

// Función para mostrar errores de forma consistente
function showError(message) {
  alert(message); // Por ahora mantenemos alert, pero se puede mejorar con UI
}

// ==========================
// CONFIRMAR ASISTENCIA (optimizado)
// ==========================
elements.confirmarBtn.addEventListener("click", async () => {
  try {
    if (!codigoActual) {
      showError("No hay código válido");
      return;
    }

    const lista = invitados[codigoActual];
    const respuestas = lista.map((nombre, index) => {
      const opcion = document.querySelector(`input[name="asistencia_${index}"]:checked`);
      return { nombre, asistencia: opcion ? opcion.value : null }; // null si no seleccionó
    });

    // Validación: todos deben seleccionar sí o no
    const sinSeleccion = respuestas.find(r => r.asistencia === null);
    if (sinSeleccion) {
      showError("Por favor, selecciona Sí o No para todos los invitados.");
      return;
    }

    const todosNo = respuestas.every(r => r.asistencia === "no");
    elements.listaDiv.classList.add("hidden");
    elements.resultadoDiv.classList.remove("hidden");

    if (todosNo) {
      elements.mensaje.innerText = `Qué lástima, nadie asistirá 😢`;
      lanzarEmojis("😢");
    } else {
      const nombresSi = respuestas.filter(r => r.asistencia === "si").map(r => r.nombre);
      elements.mensaje.innerText = `Gracias ${nombresSi.join(", ")} por confirmar! 🎉`;
      lanzarConfeti();
    }

    // ==========================
    // GUARDAR EN SUPABASE (optimizado)
    // ==========================
    const savePromises = respuestas.map(r => 
      supabase.saveConfirmation({
        codigo: codigoActual,
        nombre: r.nombre,
        asistencia: r.asistencia
      })
    );

    try {
      await Promise.all(savePromises);
      console.log("Todas las confirmaciones guardadas exitosamente");
    } catch (error) {
      console.error("Error guardando confirmaciones:", error);
      // No mostrar error al usuario ya que la confirmación visual ya se mostró
    }

  } catch (error) {
    console.error('Error en confirmación:', error);
    showError("Error interno. Intenta nuevamente.");
  }
});

// Función para escapar HTML (seguridad)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
