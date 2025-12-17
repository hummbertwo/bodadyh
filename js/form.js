// ==========================
// CONFIGURACIÓN GOOGLE APPS SCRIPT
// ==========================
const APPS_SCRIPT_URL =
  "hhttps://script.google.com/macros/s/AKfycbws0etyxiwL5zwQmMh_G2zrJB1cIw4urhZUE0XZRp-zebOLdsuSIRFoxPLzhq6L8cb7Cw/exec";

async function confirmarAsistenciaGoogle(codigo, respuestas) {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ codigo, respuestas })
  });
  return await res.json();
}

// ==========================
// ELEMENTOS DEL DOM
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
    span.style.fontSize = `${24 + Math.random() * 24}px`;
    span.style.zIndex = 9999;
    span.style.left = `${Math.random() * 90}vw`;
    span.style.bottom = `-50px`;
    span.style.pointerEvents = "none";
    span.style.transition = "transform 5s linear, opacity 5s linear";
    span.style.opacity = 1;

    document.body.appendChild(span);

    const finalY = -100 - Math.random() * 200;
    const rotate = Math.random() * 360;

    requestAnimationFrame(() => {
      span.style.transform = `translateY(${finalY}px) rotate(${rotate}deg)`;
      span.style.opacity = 0;
    });

    setTimeout(() => span.remove(), 5000);
  }
}

// ==========================
// UTILIDADES
// ==========================
function showError(message) {
  alert(message);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ==========================
// VERIFICAR CÓDIGO
// ==========================
elements.verificarBtn.addEventListener("click", () => {
  const codigo = elements.codigoInput.value.trim();

  if (!codigo) {
    showError("Por favor ingresa un código");
    return;
  }

  const lista = invitados[codigo]; // lista.js

  if (!lista) {
    showError("Código incorrecto. Verifica con los organizadores.");
    return;
  }

  codigoActual = codigo;
  elements.verificarBtn.style.display = "none";
  elements.listaDiv.classList.remove("hidden");
  elements.resultadoDiv.classList.add("hidden");
  elements.listaInvitadosDiv.innerHTML = "";

  lista.forEach((nombre, index) => {
    const guestDiv = document.createElement("div");
    guestDiv.className = "guest";
    guestDiv.innerHTML = `
      <label style="font-weight:bold;">${escapeHtml(nombre)}</label>
      <div style="margin-top:5px;">
        <label>
          <input type="radio" name="asistencia_${index}" value="si"> ✅ Sí
        </label>
        <label style="margin-left:15px;">
          <input type="radio" name="asistencia_${index}" value="no"> ❌ No
        </label>
      </div>
    `;
    elements.listaInvitadosDiv.appendChild(guestDiv);
  });
});

// ==========================
// CONFIRMAR ASISTENCIA
// ==========================
elements.confirmarBtn.addEventListener("click", async () => {
  if (!codigoActual) {
    showError("No hay código válido");
    return;
  }

  const lista = invitados[codigoActual];
  const respuestas = lista.map((nombre, index) => {
    const opcion = document.querySelector(
      `input[name="asistencia_${index}"]:checked`
    );
    return { nombre, asistencia: opcion ? opcion.value : null };
  });

  if (respuestas.some(r => r.asistencia === null)) {
    showError("Selecciona Sí o No para todos los invitados.");
    return;
  }

  elements.listaDiv.classList.add("hidden");
  elements.resultadoDiv.classList.remove("hidden");

  const todosNo = respuestas.every(r => r.asistencia === "no");

  if (todosNo) {
    elements.mensaje.innerText = "Qué lástima, nadie asistirá 😢";
    lanzarEmojis("😢");
  } else {
    const nombresSi = respuestas
      .filter(r => r.asistencia === "si")
      .map(r => r.nombre);
    elements.mensaje.innerText =
      `Gracias ${nombresSi.join(", ")} por confirmar 🎉`;
    lanzarConfeti();
  }

// ==========================
// GUARDAR EN GOOGLE SHEETS
// ==========================
try {
  const result = await confirmarAsistenciaGoogle(codigoActual, respuestas);

  if (!result.ok && result.reason === "YA_CONFIRMADO") {
    elements.mensaje.innerText =
      "⚠️ Este código ya fue confirmado anteriormente.";
    return;
  }
} catch (error) {
  console.error("Error enviando a Google Sheets:", error);
}
});
