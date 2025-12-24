        // --- CONFIGURACIÓN ---
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzB3WEF6_3qwimCwIKkl_g2C6x97FRjPAHkHDMXJoAMklt_AbETL8Ls9pQ-PtpJXPMiEA/exec'; 
        const ADMIN_PASS = 'admin123'; 

        // --- ESTADO GLOBAL ---
        let fullData = [];

        // --- FUNCIONES DE INTERFAZ ---
        function notify(msg, type = 'success') {
            const toast = document.getElementById('toast');
            toast.innerHTML = type === 'success' 
                ? `<i class="fa-solid fa-circle-check"></i> ${msg}`
                : `<i class="fa-solid fa-circle-exclamation"></i> ${msg}`;
            toast.style.backgroundColor = type === 'success' ? '#10b981' : '#ef4444';
            toast.classList.remove('translate-y-20', 'opacity-0');
            setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 4000);
        }

        function checkAdmin() {
            const pass = document.getElementById('admin-pass-input').value;
            if (pass === ADMIN_PASS) {
                document.getElementById('view-login').classList.add('hidden');
                document.getElementById('nav-admin').classList.remove('hidden');
                document.getElementById('view-admin').classList.remove('hidden');
                loadAdminData();
            } else {
                notify("Contraseña incorrecta", "error");
            }
        }

        // --- GESTIÓN DE DATOS ---
        async function loadAdminData() {
            if (!SCRIPT_URL || SCRIPT_URL.includes('TU_URL_DE_APPS_SCRIPT_AQUI') || SCRIPT_URL === '') {
                notify("Error: URL del Script no configurada.", "error");
                return;
            }

            const icon = document.getElementById('refresh-icon');
            const tbody = document.getElementById('table-body');
            
            icon.classList.add('fa-spin');
            tbody.innerHTML = `
                <tr>
                    <td colspan="4" class="p-20 text-center">
                        <div class="flex flex-col items-center gap-3">
                            <div class="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                            <p class="text-gray-400 font-bold animate-pulse-slow">Sincronizando con Google Sheets...</p>
                        </div>
                    </td>
                </tr>`;

            try {
                const separator = SCRIPT_URL.includes('?') ? '&' : '?';
                const fetchUrl = `${SCRIPT_URL}${separator}action=read`;
                
                // Usamos redirect: 'follow' para manejar las redirecciones de Google Apps Script
                const res = await fetch(fetchUrl, {
                    method: 'GET',
                    mode: 'cors',
                    redirect: 'follow'
                });

                if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
                
                const result = await res.json();

                if (result && result.ok) {
                    fullData = Array.isArray(result.data) ? result.data : [];
                    renderDashboard(fullData);
                    notify("Datos actualizados correctamente");
                } else {
                    console.error("Respuesta del servidor no válida:", result);
                    notify("El servidor no devolvió datos válidos", "error");
                    tbody.innerHTML = '<tr><td colspan="4" class="p-20 text-center text-orange-400 font-bold">Respuesta inesperada del servidor. Verifica el formato en el Script.</td></tr>';
                }
            } catch (err) {
                console.error("Error detallado al cargar:", err);
                notify("Error al conectar con Google Sheets", "error");
                tbody.innerHTML = `
                    <tr>
                        <td colspan="4" class="p-20 text-center">
                            <p class="text-red-500 font-bold mb-2">No se pudo cargar la información</p>
                            <p class="text-gray-400 text-sm">Asegúrate de que el Script esté publicado como "Aplicación Web" con acceso para "Cualquier persona".</p>
                        </td>
                    </tr>`;
            } finally {
                icon.classList.remove('fa-spin');
            }
        }

        function renderDashboard(data) {
            const tbody = document.getElementById('table-body');
            const noData = document.getElementById('no-data');
            tbody.innerHTML = '';

            if (!data || data.length === 0) {
                noData.classList.remove('hidden');
                resetStats();
                return;
            } else {
                noData.classList.add('hidden');
            }

            let si = 0;
            let no = 0;
            const grupos = new Set();

            data.forEach(item => {
                // Normalización de la asistencia (admite 'si', 'SÍ', 'Si', etc.)
                const rawAsistencia = String(item.asistencia || "").toLowerCase().trim();
                const isSi = rawAsistencia === 'si' || rawAsistencia === 'sí' || rawAsistencia === 'confirmado';
                
                if (isSi) si++; else no++;
                if (item.codigo) grupos.add(item.codigo);

                // Procesamiento de fecha
                let fechaDisplay = '---';
                let horaDisplay = '';
                
                if (item.fecha) {
                    const f = new Date(item.fecha);
                    if (!isNaN(f)) {
                        fechaDisplay = f.toLocaleDateString();
                        horaDisplay = f.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    }
                }

                const tr = document.createElement('tr');
                tr.className = "hover:bg-indigo-50/50 transition duration-150 group border-b border-gray-50";
                tr.innerHTML = `
                    <td class="px-6 py-4">
                        <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-200">
                            ${item.codigo || 'GRUPO'}
                        </span>
                    </td>
                    <td class="px-6 py-4 font-bold text-gray-700 group-hover:text-indigo-600 transition">
                        ${item.nombre || 'Invitado sin nombre'}
                    </td>
                    <td class="px-6 py-4 text-center">
                        <span class="inline-flex items-center gap-1.5 ${isSi ? 'text-green-700 bg-green-100 border-green-200' : 'text-red-700 bg-red-100 border-red-200'} px-4 py-1.5 rounded-full text-[11px] font-black border uppercase tracking-tighter">
                            <i class="fa-solid ${isSi ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                            ${isSi ? 'Asistirá' : 'No asistirá'}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-xs font-medium text-gray-400">
                        ${fechaDisplay} <span class="text-[10px] opacity-60 ml-1">${horaDisplay}</span>
                    </td>
                `;
                tbody.appendChild(tr);
            });

            updateStats(data.length, si, no, grupos.size);
        }

        // --- UTILIDADES ---
        function updateStats(total, si, no, grupos) {
            document.getElementById('stat-total').innerText = total;
            document.getElementById('stat-si').innerText = si;
            document.getElementById('stat-no').innerText = no;
            document.getElementById('stat-grupos').innerText = grupos;
        }

        function resetStats() {
            updateStats(0, 0, 0, 0);
        }

        function filterTable() {
            const query = document.getElementById('search-input').value.toLowerCase();
            const filtered = fullData.filter(item => 
                (item.nombre && item.nombre.toLowerCase().includes(query)) || 
                (item.codigo && item.codigo.toLowerCase().includes(query))
            );
            renderDashboard(filtered);
        }

        // Eventos de teclado
        document.getElementById('admin-pass-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkAdmin();
        });