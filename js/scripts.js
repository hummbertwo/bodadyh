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
}, { threshold: 0.6 });

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
  threshold: 0.6
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
