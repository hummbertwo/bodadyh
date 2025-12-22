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
}, { threshold: 0.2 });

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
  threshold: 0.2
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
            const envelope = document.getElementById("envelope");
            const isMobile = window.innerWidth < 768;
            let abierto = false;

            if (!isMobile) {
                // LÓGICA DESKTOP: Solo Blur
                document.body.classList.add("is-desktop");
                
                // Esperamos un momento y quitamos el blur
                setTimeout(() => {
                    document.body.classList.add("content-ready");
                    document.body.classList.remove("no-scroll");
                }, 500); // Tiempo que dura el blur antes de desvanecerse
            } else {
                // LÓGICA MOBILE: Sobre
                document.body.classList.add("no-scroll");

                function abrirEnvelope() {
                    if (abierto) return;
                    abierto = true;

                    envelope.classList.add("is-open");

                    setTimeout(() => {
                        document.body.classList.remove("no-scroll");
                    }, 400); 

                    setTimeout(() => {
                        envelope.remove();
                    }, 1200);
                }

                envelope.addEventListener("click", abrirEnvelope);
                setTimeout(abrirEnvelope, 2000);
            }
        });


