// ===============================
// Confirmación de Asistencia
// ===============================
const sheetsBestURL = "https://script.google.com/macros/s/AKfycbzOEuy_gOAEqtN0eB0vJbExkYeXj0e4wevKWbMxfHxycwsuncxq9iDKl1tuc8e0UtdNbQ/exec";
let codigoActual = null;
let invitados = [];

// ===============================
// Verificar Código
// ===============================
function verificarCodigo() {
  const input = document.getElementById("codigo").value.trim().toUpperCase();
  const lista = codigos[input]; // Asegúrate de tener definido el objeto 'codigos'
  const invitadosDiv = document.getElementById("invitadosLista");
  const resultado = document.getElementById("resultado");

  // Limpiar mensajes previos
  resultado.classList.add("hidden");
  resultado.innerHTML = "";
  invitadosDiv.innerHTML = "";

  if (!lista) {
    alert("Código no válido. Verifica con los organizadores.");
    return;
  }

  codigoActual = input;
  invitados = lista;

  // OCULTAR botón de verificar código con clase submit
  const btnVerificar = document.querySelector(".submit");
  if (btnVerificar) btnVerificar.style.display = "none";

  // Mostrar lista de invitados
  lista.forEach((nombre, index) => {
    invitadosDiv.innerHTML += `
      <div style="margin: 20px 0;">
        <label style="display:block; font-weight: bold;">${nombre}</label>
        <div style="margin-top: 10px;">
          <label style="margin-right: 15px;">
            <input type="radio" name="asistencia_${index}" value="Sí" required> ✅ Asiste
          </label>
          <label>
            <input type="radio" name="asistencia_${index}" value="No"> ❌ No asiste
          </label>
        </div>
      </div>
    `;
  });

  // Mostrar formulario con botón de confirmar
  document.getElementById("formulario").classList.remove("hidden");
}

// ===============================
// Confirmar asistencia
// ===============================
async function confirmar() {
  const resultado = document.getElementById("resultado");
  const registros = [];

  let todosRespondidos = true;
  let nombreQueAsiste = null;
  let contadorAsisten = 0;

  invitados.forEach((nombre, index) => {
    const opcion = document.querySelector(`input[name="asistencia_${index}"]:checked`);
    if (!opcion) {
      todosRespondidos = false;
    } else {
      const asistencia = opcion.value;

      if (asistencia === "Sí") {
        contadorAsisten++;
        if (!nombreQueAsiste) {
          nombreQueAsiste = nombre.split(" ")[0]; // primer nombre que asistirá
        }
      }

      registros.push({
        codigo: codigoActual,
        nombre: nombre,
        asistencia: asistencia,
        timestamp: new Date().toISOString()
      });
    }
  });

  if (!todosRespondidos) {
    alert("Por favor, responde por todos los invitados.");
    return;
  }

  try {
    // Enviar datos a la API
    for (let registro of registros) {
      await fetch(sheetsBestURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registro)
      });
    }

    // Ocultar formulario
    document.getElementById("formulario").classList.add("hidden");
    resultado.classList.remove("hidden");
    resultado.innerHTML = "";

    if (contadorAsisten > 0) {
      // MENSAJE DE GRACIAS CON NOMBRE
      const saludo = `¡Gracias, ${nombreQueAsiste}!`;
      const linkMasInfo = "https://www.facebook.com/reel/1469677640358847";

      resultado.innerHTML = `
        <h3>${saludo}</h3>
        <p>Nos emociona compartir este momento tan especial contigo.</p>
        <button id="btnMasInfo" style="margin-top:15px; padding:10px 20px; font-size:16px; cursor:pointer;">
          Más Información
        </button>
      `;

      document.getElementById("btnMasInfo").addEventListener("click", () => {
        window.open(linkMasInfo, "_blank");
      });

      // Confeti si hay asistentes
      if (typeof confetti !== "undefined") {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

    } else {
      // MENSAJE ALTERNATIVO CON EMOJIS TRISTES
      resultado.innerHTML = `
        <h3>¡Qué mal!</h3>
        <p>Con el código <strong>${codigoActual}</strong> nadie podrá asistir 😢</p>
      `;
      launchEmojiParticles("😢");
    }

  } catch (error) {
    alert("Error al enviar la confirmación. Intenta de nuevo.");
    console.error(error);
  }
}

// ===============================
// Animación de Emojis Flotantes
// ===============================
function launchEmojiParticles(emoji) {
  for (let i = 0; i < 30; i++) {
    const span = document.createElement("span");
    span.textContent = emoji;
    span.style.position = "fixed";
    span.style.fontSize = "48px";
    span.style.zIndex = 9999;
    span.style.left = `${Math.random() * 100}vw`;
    span.style.bottom = "-50px";
    span.style.animation = `floatUp ${3 + Math.random() * 2}s ease-out forwards`;
    document.body.appendChild(span);

    setTimeout(() => span.remove(), 5000);
  }
}

// ===============================
// Estilos de la Animación (CSS)
// ===============================
const style = document.createElement("style");
style.innerHTML = `
@keyframes floatUp {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-120vh) scale(1.5);
    opacity: 0;
  }
}`;
document.head.appendChild(style);
