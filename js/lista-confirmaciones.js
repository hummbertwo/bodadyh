// ==========================
// CONFIGURACIÓN SUPABASE PARA LISTA DE CONFIRMACIONES
// ==========================
const SUPABASE_URL = "https://sqkluttgalypumizrrnd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNxa2x1dHRnYWx5cHVtaXpycm5kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3NjQzODksImV4cCI6MjA3NTM0MDM4OX0.HjgeLkD1gmEV3psPA-jlkfmJlsJR5904vF4gieaPZnI";

// ==========================
// FUNCIÓN PARA CARGAR CONFIRMACIONES
// ==========================
async function cargarConfirmaciones() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/confirmaciones?order=timestamp.desc`, {
      method: "GET",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    // Filtrar solo "si" y eliminar duplicados
    const filtrados = [];
    const vistos = new Set();

    data.forEach(row => {
      const key = `${row.codigo}-${row.nombre}`;
      if (!vistos.has(key) && row.asistencia === "si") {
        filtrados.push(row);
        vistos.add(key);
      }
    });

    const contenedor = document.getElementById("lista-confirmaciones");
    contenedor.innerHTML = "";

    filtrados.forEach((row, idx) => {
      const card = document.createElement("div");
      card.className = "card fade-in";
      card.style.animationDelay = `${idx * 0.05}s`;
      card.innerHTML = `
        <div class="info">
          <span><strong>Código:</strong> ${row.codigo}</span>
          <span><strong>Nombre:</strong> ${row.nombre}</span>
          <span><strong>Fecha:</strong> ${new Date(row.timestamp).toLocaleString()}</span>
        </div>
        <div class="status">✅ Asiste</div>
      `;
      contenedor.appendChild(card);
    });

  } catch (error) {
    console.error("Error cargando confirmaciones:", error);
  }
}

// ==========================
// INICIALIZACIÓN
// ==========================
document.addEventListener('DOMContentLoaded', () => {
  // Cargar al inicio
  cargarConfirmaciones();

  // Botón recargar
  document.getElementById("recargar").addEventListener("click", cargarConfirmaciones);
});
