// ==========================
// CONFIGURACIÓN SUPABASE PARA LISTA DE CONFIRMACIONES (usando configuración centralizada)
// ==========================
async function cargarConfirmaciones() {
  try {
    const data = await supabase.getConfirmations();

    // Validar datos recibidos
    if (!Array.isArray(data)) {
      throw new Error('Formato de datos inválido');
    }

    // Filtrar solo "si" y eliminar duplicados
    const filtrados = [];
    const vistos = new Set();

    data.forEach(row => {
      // Validar estructura de cada fila
      if (!row || typeof row !== 'object') return;
      if (!row.codigo || !row.nombre || !row.timestamp) return;
      
      const key = `${row.codigo}-${row.nombre}`;
      if (!vistos.has(key) && row.asistencia === "si") {
        filtrados.push(row);
        vistos.add(key);
      }
    });

    const contenedor = document.getElementById("lista-confirmaciones");
    if (!contenedor) {
      throw new Error('Contenedor de lista no encontrado');
    }

    contenedor.innerHTML = "";

    if (filtrados.length === 0) {
      contenedor.innerHTML = '<div class="card"><div class="info"><span>No hay confirmaciones aún</span></div></div>';
      return;
    }

    filtrados.forEach((row, idx) => {
      const card = document.createElement("div");
      card.className = "card fade-in";
      card.style.animationDelay = `${idx * 0.05}s`;
      
      // Escapar datos para seguridad
      const codigoEscapado = escapeHtml(row.codigo);
      const nombreEscapado = escapeHtml(row.nombre);
      const fechaFormateada = new Date(row.timestamp).toLocaleString();
      
      card.innerHTML = `
        <div class="info">
          <span><strong>Código:</strong> ${codigoEscapado}</span>
          <span><strong>Nombre:</strong> ${nombreEscapado}</span>
          <span><strong>Fecha:</strong> ${fechaFormateada}</span>
        </div>
        <div class="status">✅ Asiste</div>
      `;
      contenedor.appendChild(card);
    });

  } catch (error) {
    console.error("Error cargando confirmaciones:", error);
    const contenedor = document.getElementById("lista-confirmaciones");
    if (contenedor) {
      contenedor.innerHTML = '<div class="card"><div class="info"><span style="color: red;">Error cargando datos</span></div></div>';
    }
  }
}

// Función para escapar HTML (seguridad)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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
