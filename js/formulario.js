// ===============================
// Confirmación de Asistencia
// ===============================
const sheetsBestURL = "https://api.sheetbest.com/sheets/9ca1ebfc-c2e0-4a0c-89dc-35a8a46da598";
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

  invitados.forEach((nombre, index) => {
    const opcion = document.querySelector(`input[name="asistencia_${index}"]:checked`);
    if (!opcion) {
      todosRespondidos = false;
    } else {
      const asistencia = opcion.value;
      if (asistencia === "Sí" && !nombreQueAsiste) {
        nombreQueAsiste = nombre.split(" ")[0]; // primer nombre que asistirá
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

    const saludo = nombreQueAsiste
      ? `¡Gracias, ${nombreQueAsiste}!`
      : `¡Gracias por confirmar!`;

    resultado.innerHTML = `
      <h3>${saludo}</h3>
      <p>Se registraron ${registros.length} persona(s) con el código <strong>${codigoActual}</strong>.</p>
    `;
    resultado.classList.remove("hidden");
    document.getElementById("formulario").classList.add("hidden");

  } catch (error) {
    alert("Error al enviar la confirmación. Intenta de nuevo.");
    console.error(error);
  }
}