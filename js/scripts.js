// ===============================
// Fade-in Animation on Scroll
// ===============================
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.3 });

sections.forEach(section => observer.observe(section));

// Efecto scroll para elementos con clase .animar
const elementosAnimar = document.querySelectorAll('.animar');

const observerAnimacion = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('focus-in-contract-bck');
      observerAnimacion.unobserve(entry.target); // Solo una vez
    }
  });
}, {
  threshold: 0.3
});

elementosAnimar.forEach(elemento => observerAnimacion.observe(elemento));


// ===============================
// Audio Play/Pause Functionality
// ===============================
const audio = document.getElementById('weddingSong');
const btn = document.getElementById('audioPlayBtn');
const icon = document.getElementById('iconPlayPause');

const playIconPath = "M8 5v14l11-7z"; // Play icon
const pauseIconPath = "M6 19h4V5H6v14zm8-14v14h4V5h-4z"; // Pause icon

let isPlaying = false;

// Auto-play on load if allowed
window.onload = () => {
  audio.play().then(() => {
    icon.querySelector('path').setAttribute('d', pauseIconPath);
    btn.title = "Pausar canción";
    isPlaying = true;
  }).catch(() => {
    console.log("Autoplay bloqueado, esperando interacción.");
  });
};

// Play audio on user interaction (except button)
document.addEventListener('click', (e) => {
  if (!isPlaying && !btn.contains(e.target)) {
    audio.play().then(() => {
      icon.querySelector('path').setAttribute('d', pauseIconPath);
      btn.title = "Pausar canción";
      isPlaying = true;
    }).catch(() => {
      console.log("Reproducción aún bloqueada.");
    });
  }
});

// Toggle play/pause with button
btn.addEventListener('click', () => {
  if (!isPlaying) {
    audio.play();
    icon.querySelector('path').setAttribute('d', pauseIconPath);
    btn.title = "Pausar canción";
    isPlaying = true;
  } else {
    audio.pause();
    icon.querySelector('path').setAttribute('d', playIconPath);
    btn.title = "Reproducir canción";
    isPlaying = false;
  }
});

// Reset icon when audio ends
audio.addEventListener('ended', () => {
  icon.querySelector('path').setAttribute('d', playIconPath);
  btn.title = "Reproducir canción";
  isPlaying = false;
});


// ===============================
// Countdown Timer
// ===============================
const targetDate = new Date("2026-02-01T08:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = targetDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = days.toString().padStart(2, '0');
  document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
  document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
  document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
}

setInterval(updateCountdown, 1000);
updateCountdown(); // ejecuta la primera vez inmediatamente


// ===============================
// Confirmación de Asistencia
// ===============================
const sheetsBestURL = "https://api.sheetbest.com/sheets/9ca1ebfc-c2e0-4a0c-89dc-35a8a46da598";

const codigos = {
  "ELITE": 1,
  "DELUXE": 2,
  "GOLD": 3,
  "PLATINUM": 4,
  "DIAMOND": 5,
  "ROYAL": 6
};

let codigoActual = null;
let entradasDisponibles = 0;

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
    entradasDisponibles = entradas;
    formulario.classList.remove("hidden");
    mensaje.textContent = `Este código tiene asignadas ${entradas} entrada(s).`;
  } else {
    formulario.classList.add("hidden");
    alert("Código no válido. Verifica con los organizadores.");
  }
}

async function confirmar() {
  const nombre = document.getElementById("nombre").value.trim();
  const cantidad = parseInt(document.getElementById("cantidad").value.trim(), 10);
  const resultado = document.getElementById("resultado");

  if (!nombre) {
    alert("Por favor, ingresa tu nombre.");
    return;
  }

  if (!cantidad || cantidad < 1 || cantidad > entradasDisponibles) {
    alert(`Por favor, ingresa un número válido de personas (máx. ${entradasDisponibles}).`);
    return;
  }

  try {
    await fetch(sheetsBestURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        codigo: codigoActual,
        nombre: nombre,
        cantidad: cantidad,
        timestamp: new Date().toISOString()
      })
    });

    resultado.innerHTML = `
      <h3>¡Gracias por confirmar, ${nombre}!</h3>
      <p>Se registraron <strong>${cantidad}</strong> persona(s) con el código <strong>${codigoActual}</strong>.</p>
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