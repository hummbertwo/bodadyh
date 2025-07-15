// Fade-in animation on scroll
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));

// Countdown script
const countdown = document.getElementById("countdown");
const targetDate = new Date("2025-11-23T00:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);
  countdown.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Confirmación de asistencia
const sheetsBestURL = "https://api.sheetbest.com/sheets/9ca1ebfc-c2e0-4a0c-89dc-35a8a46da598";

const codigos = {
  "COD1010": 1,
  "COD1020": 2,
  "COD1030": 3,
  "COD1040": 4,
  "COD1050": 5,
  "COD1060": 6
};

let codigoActual = null;

function verificarCodigo() {
  const input = document.getElementById("codigo").value.trim().toUpperCase();
  const entradas = codigos[input];
  const formulario = document.getElementById("formulario");
  const mensaje = document.getElementById("mensajeEntradas");
  const resultado = document.getElementById("resultado");

  resultado.classList.add("hidden");
  resultado.innerHTML = "";

  if (entradas) {
    codigoActual = input;
    formulario.classList.remove("hidden");
    mensaje.textContent = `Este código tiene asignadas ${entradas} entrada(s).`;
  } else {
    formulario.classList.add("hidden");
    alert("Código no válido. Verifica con los organizadores.");
  }
}

async function confirmar() {
  const nombre = document.getElementById("nombre").value.trim();
  if (!nombre) {
    alert("Por favor, ingresa tu nombre.");
    return;
  }

  const entradas = codigos[codigoActual];

  try {
    await fetch(sheetsBestURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        codigo: codigoActual,
        nombre: nombre,
        entradas: entradas,
        timestamp: new Date().toISOString()
      })
    });

    const resultado = document.getElementById("resultado");
    resultado.innerHTML = `
      <h3>¡Gracias por confirmar, ${nombre}!</h3>
      <p>Tu código <strong>${codigoActual}</strong> tiene <strong>${entradas}</strong> entrada(s) asignadas.</p>
      <a href="https://www.facebook.com/reel/1469677640358847" target="_blank">
        <button style="padding:10px 20px; margin-top:10px;">Más Información</button>
      </a>
    `;
    resultado.classList.remove("hidden");
    document.getElementById("formulario").classList.add("hidden");

  } catch (error) {
    alert("Error al enviar la confirmación. Intenta de nuevo.");
    console.error(error);
  }
}
