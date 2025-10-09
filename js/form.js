// ==========================
// CONFIGURACIÓN SUPABASE
// ==========================
const SUPABASE_URL = "https://sqkluttgalypumizrrnd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxa2x1dHRnYWx5cHVtaXpycm5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjQzODksImV4cCI6MjA3NTM0MDM4OX0.HjgeLkD1gmEV3psPA-jlkfmJlsJR5904vF4gieaPZnI";

// ==========================
// ELEMENTOS DEL DOM
// ==========================
const codigoInput = document.getElementById("codigo");
const verificarBtn = document.getElementById("verificar-btn");
const listaDiv = document.getElementById("lista-div");
const listaInvitadosDiv = document.getElementById("lista-invitados");
const confirmarBtn = document.getElementById("confirmar-btn");
const resultadoDiv = document.getElementById("resultado-div");
const mensaje = document.getElementById("mensaje");

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
    span.style.fontSize = "48px";
    span.style.zIndex = 9999;
    span.style.left = `${Math.random() * 100}vw`;
    span.style.bottom = "-50px";
    span.style.animation = `floatUp ${3 + Math.random() * 2}s ease-out forwards`;
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 5000);
  }
}

// ==========================
// VERIFICAR CÓDIGO
// ==========================
verificarBtn.addEventListener("click", () => {
  const codigo = codigoInput.value.trim();
  const lista = invitados[codigo]; // lista.js

  listaInvitadosDiv.innerHTML = "";
  resultadoDiv.classList.add("hidden");
  mensaje.innerText = "";

  if (!lista) {
    alert("Código incorrecto. Verifica con los organizadores.");
    return;
  }

  codigoActual = codigo;
  verificarBtn.style.display = "none";
  listaDiv.classList.remove("hidden");

  lista.forEach((nombre, index) => {
    listaInvitadosDiv.innerHTML += `
      <div class="guest">
        <label style="font-weight:bold;">${nombre}</label>
        <div style="margin-top:5px;">
          <label style="margin-right:15px;">
            <input type="radio" name="asistencia_${index}" value="si" required> ✅ Sí
          </label>
          <label>
            <input type="radio" name="asistencia_${index}" value="no"> ❌ No
          </label>
        </div>
      </div>
    `;
  });
});

// ==========================
// CONFIRMAR ASISTENCIA
// ==========================
confirmarBtn.addEventListener("click", async () => {
  if (!codigoActual) return;

  const lista = invitados[codigoActual];
  const respuestas = lista.map((nombre, index) => {
    const opcion = document.querySelector(`input[name="asistencia_${index}"]:checked`);
    return { nombre, asistencia: opcion ? opcion.value : "no_responde" };
  });

  const todosNo = respuestas.every(r => r.asistencia === "no");
  listaDiv.classList.add("hidden");
  resultadoDiv.classList.remove("hidden");

  if (todosNo) {
    mensaje.innerText = `Qué lástima, nadie asistirá 😢`;
    lanzarEmojis("😢");
  } else {
    const nombresSi = respuestas.filter(r => r.asistencia === "si").map(r => r.nombre);
    mensaje.innerText = `Gracias ${nombresSi.join(", ")} por confirmar! 🎉`;
    lanzarConfeti();
  }

  // ==========================
  // GUARDAR EN SUPABASE
  // ==========================
  for (let r of respuestas) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/confirmaciones`, {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          "Prefer": "return=representation"
        },
        body: JSON.stringify({
          codigo: codigoActual,
          nombre: r.nombre,
          asistencia: r.asistencia
        })
      });
    } catch (error) {
      console.error("Error guardando en Supabase:", error);
    }
  }
});
