// ===============================
// Confirmación de Asistencia
// ===============================
const sheetsBestURL = "https://api.sheetbest.com/sheets/fa954cbf-04cd-4db7-8c35-e2c8d13432a2";
let codigoActual = null;
let invitados = [];

function verificarCodigo() {
  const input = document.getElementById("codigo").value.trim().toUpperCase();
  const lista = codigos[input];
  const invitadosDiv = document.getElementById("invitadosLista");
  const resultado = document.getElementById("resultado");

  resultado.classList.add("hidden");
  resultado.innerHTML = "";
  invitadosDiv.innerHTML = "";

  if (lista) {
    codigoActual = input;
    invitados = lista;

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

    document.getElementById("formulario").classList.remove("hidden");
  } else {
    alert("Código no válido. Verifica con los organizadores.");
    document.getElementById("formulario").classList.add("hidden");
  }
}

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
          nombreQueAsiste = nombre.split(" ")[0];
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
    for (let registro of registros) {
      await fetch(sheetsBestURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registro)
      });
    }

    document.getElementById("formulario").classList.add("hidden");
    resultado.classList.remove("hidden");

    if (contadorAsisten > 0) {
      const saludo = nombreQueAsiste
        ? `¡Gracias, ${nombreQueAsiste}!`
        : `¡Gracias por confirmar!`;

      // Cambia esta URL al enlace que quieras mostrar en "Más información"
      const linkMasInfo = "https://www.facebook.com/reel/1469677640358847"; 

      resultado.innerHTML = `
        <h3>${saludo}</h3>
        <p>Se registraron ${contadorAsisten} persona(s) que asistirán con el código <strong>${codigoActual}</strong>.</p>
        <button id="btnMasInfo" style="margin-top:15px; padding: 10px 20px; font-size: 16px; cursor:pointer;">
          Más información
        </button>
      `;

      document.getElementById("btnMasInfo").addEventListener("click", () => {
        window.open(linkMasInfo, "_blank");
      });

      // Confeti si al menos 1 asistente
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });

    } else {
      resultado.innerHTML = `
        <h3>¡Qué Mamon@!</h3>
        <p>Nadie asistirá con el código <strong>${codigoActual}</strong>.</p>
      `;

      launchEmojiParticles("🖕🏼");
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
