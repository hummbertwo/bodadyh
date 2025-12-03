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

// Validación de elementos DOM
if (!audio || !btn || !icon) {
  console.warn('Elementos de audio no encontrados');
} else {
  const playIconPath = "M8 5v14l11-7z"; // Play icon
  const pauseIconPath = "M6 19h4V5H6v14zm8-14v14h4V5h-4z"; // Pause icon

  let isPlaying = false;

  // Auto-play on load if allowed
  window.onload = () => {
    audio.play().then(() => {
      const pathElement = icon.querySelector('path');
      if (pathElement) {
        pathElement.setAttribute('d', pauseIconPath);
      }
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
        const pathElement = icon.querySelector('path');
        if (pathElement) {
          pathElement.setAttribute('d', pauseIconPath);
        }
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
      const pathElement = icon.querySelector('path');
      if (pathElement) {
        pathElement.setAttribute('d', pauseIconPath);
      }
      btn.title = "Pausar canción";
      isPlaying = true;
    } else {
      audio.pause();
      const pathElement = icon.querySelector('path');
      if (pathElement) {
        pathElement.setAttribute('d', playIconPath);
      }
      btn.title = "Reproducir canción";
      isPlaying = false;
    }
  });

  // Reset icon when audio ends
  audio.addEventListener('ended', () => {
    const pathElement = icon.querySelector('path');
    if (pathElement) {
      pathElement.setAttribute('d', playIconPath);
    }
    btn.title = "Reproducir canción";
    isPlaying = false;
  });
}


// ===============================
// Countdown Timer (Optimizado)
// ===============================
const targetDate = new Date("2026-02-01T08:00:00").getTime();
let countdownInterval = null;

// Cache de elementos DOM para mejor performance
const countdownElements = {
  days: document.getElementById("days"),
  hours: document.getElementById("hours"),
  minutes: document.getElementById("minutes"),
  seconds: document.getElementById("seconds")
};

// Validar que los elementos existen
const elementsExist = Object.values(countdownElements).every(el => el !== null);

if (elementsExist) {
  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Si ya pasó la fecha, detener el countdown
    if (distance < 0) {
      clearInterval(countdownInterval);
      countdownElements.days.textContent = "00";
      countdownElements.hours.textContent = "00";
      countdownElements.minutes.textContent = "00";
      countdownElements.seconds.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownElements.days.textContent = days.toString().padStart(2, '0');
    countdownElements.hours.textContent = hours.toString().padStart(2, '0');
    countdownElements.minutes.textContent = minutes.toString().padStart(2, '0');
    countdownElements.seconds.textContent = seconds.toString().padStart(2, '0');
  }
 
  // Iniciar countdown solo si los elementos existen
  updateCountdown(); // ejecuta la primera vez inmediatamente
  countdownInterval = setInterval(updateCountdown, 1000);
} else {
  console.warn('Elementos del countdown no encontrados');
}

  const images = Array.from(document.querySelectorAll(".galeria-grid img"));
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  const btnPrev = document.getElementById("prev");
  const btnNext = document.getElementById("next");
  const btnCerrar = document.getElementById("cerrar");

  let indexActual = 0;

  // Abrir el carrusel con la imagen correcta
  images.forEach((img, index) => {
    img.addEventListener("click", () => {
      indexActual = index;
      abrirImagen();
    });
  });

  function abrirImagen() {
    lightboxImg.src = images[indexActual].src;
    lightbox.style.display = "flex";
  }

  function cerrarLightbox() {
    lightbox.style.display = "none";
  }

  // Navegar
  btnNext.addEventListener("click", () => {
    indexActual = (indexActual + 1) % images.length;
    abrirImagen();
  });

  btnPrev.addEventListener("click", () => {
    indexActual = (indexActual - 1 + images.length) % images.length;
    abrirImagen();
  });

  // Cerrar con la X
  btnCerrar.addEventListener("click", cerrarLightbox);

  // Cerrar si hace click fuera de la imagen
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      cerrarLightbox();
    }
  });

  // Cerrar con la tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") cerrarLightbox();
  });




document.addEventListener("DOMContentLoaded", () => {

  const topPart = document.getElementById("top");
  const bottomPart = document.getElementById("bottom");
  const envelope = document.querySelector(".envelope-container");

  // Bloquear scroll al inicio
  document.body.classList.add("no-scroll");

  topPart.addEventListener("click", () => {
    
    // Animación abrir
    topPart.style.transform = "translateY(-100%)";
    bottomPart.style.transform = "translateY(100%)";

    // Esperar animación y quitar overlay
    setTimeout(() => {
      envelope.style.display = "none";

      // Activar scroll
      document.body.classList.remove("no-scroll");
    }, 1400);

  });

});

