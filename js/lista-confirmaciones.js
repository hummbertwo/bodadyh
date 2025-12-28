        // --- CONFIGURACIÓN ---
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzB3WEF6_3qwimCwIKkl_g2C6x97FRjPAHkHDMXJoAMklt_AbETL8Ls9pQ-PtpJXPMiEA/exec'; 
        const ADMIN_PASS = 'admin123'; 

        let fullData = [];

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

        async function loadAdminData() {
            if (!SCRIPT_URL || SCRIPT_URL === '') return;

            const icon = document.getElementById('refresh-icon');
            const tbody = document.getElementById('table-body');
            const mCards = document.getElementById('mobile-cards');
            
            icon.classList.add('fa-spin');
            const loadingHtml = `
                <div class="p-10 text-center col-span-full">
                    <div class="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                    <p class="text-gray-400 font-bold animate-pulse-slow text-sm">Cargando lista...</p>
                </div>`;
            
            tbody.innerHTML = `<tr><td colspan="4">${loadingHtml}</td></tr>`;
            mCards.innerHTML = loadingHtml;

            try {
                const separator = SCRIPT_URL.includes('?') ? '&' : '?';
                const fetchUrl = `${SCRIPT_URL}${separator}action=read`;
                
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
                } else {
                    notify("Error en respuesta", "error");
                }
            } catch (err) {
                console.error(err);
                notify("Error de conexión", "error");
            } finally {
                icon.classList.remove('fa-spin');
            }
        }

        function renderDashboard(data) {
            const tbody = document.getElementById('table-body');
            const mCards = document.getElementById('mobile-cards');
            const noData = document.getElementById('no-data');
            
            tbody.innerHTML = '';
            mCards.innerHTML = '';

            if (!data || data.length === 0) {
                noData.classList.remove('hidden');
                updateStats(0,0,0,0);
                return;
            } else {
                noData.classList.add('hidden');
            }

            let si = 0;
            let no = 0;
            const grupos = new Set();

            data.forEach(item => {
                const rawAsistencia = String(item.asistencia || "").toLowerCase().trim();
                const isSi = rawAsistencia === 'si' || rawAsistencia === 'sí' || rawAsistencia === 'confirmado';
                
                if (isSi) si++; else no++;
                if (item.codigo) grupos.add(item.codigo);

                let fechaDisplay = '---';
                let horaDisplay = '';
                if (item.fecha) {
                    const f = new Date(item.fecha);
                    if (!isNaN(f)) {
                        fechaDisplay = f.toLocaleDateString();
                        horaDisplay = f.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                    }
                }

                // Desktop Row
                const tr = document.createElement('tr');
                tr.className = "hover:bg-indigo-50/50 transition duration-150 group";
                tr.innerHTML = `
                    <td class="px-6 py-4">
                        <span class="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-200">
                            ${item.codigo || 'S/C'}
                        </span>
                    </td>
                    <td class="px-6 py-4 font-bold text-gray-700">${item.nombre || 'Sin nombre'}</td>
                    <td class="px-6 py-4 text-center">
                        <span class="${isSi ? 'text-green-700 bg-green-100 border-green-200' : 'text-red-700 bg-red-100 border-red-200'} px-4 py-1.5 rounded-full text-[11px] font-black border uppercase tracking-tighter">
                            ${isSi ? 'Asistirá' : 'No asistirá'}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-xs font-medium text-gray-400">
                        ${fechaDisplay} <span class="text-[10px] opacity-60 ml-1">${horaDisplay}</span>
                    </td>
                `;
                tbody.appendChild(tr);

                // Mobile Card
                const card = document.createElement('div');
                card.className = "p-5 border-b border-gray-100 bg-white/40 last:border-0";
                card.innerHTML = `
                    <div class="flex flex-col gap-3">
                        <div class="flex justify-between items-center">
                             <span class="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                ${item.codigo || 'SIN CÓDIGO'}
                            </span>
                             <span class="${isSi ? 'text-green-600' : 'text-red-600'} text-xs font-black uppercase tracking-tighter">
                                <i class="fa-solid ${isSi ? 'fa-circle-check' : 'fa-circle-xmark'} mr-1"></i>
                                ${isSi ? 'CONFIRMADO' : 'DECLINADO'}
                            </span>
                        </div>
                        <div>
                            <h4 class="font-bold text-gray-800 text-base leading-tight">${item.nombre || 'Invitado'}</h4>
                            <p class="text-[10px] text-gray-400 font-medium mt-1 uppercase tracking-wide">
                                <i class="fa-regular fa-calendar-check mr-1"></i>${fechaDisplay} a las ${horaDisplay}
                            </p>
                        </div>
                    </div>
                `;
                mCards.appendChild(card);
            });

            updateStats(data.length, si, no, grupos.size);
        }

        function updateStats(total, si, no, grupos) {
            document.getElementById('stat-total').innerText = total;
            document.getElementById('stat-si').innerText = si;
            document.getElementById('stat-no').innerText = no;
            document.getElementById('stat-grupos').innerText = grupos;
        }

        function filterTable() {
            const query = document.getElementById('search-input').value.toLowerCase();
            const filtered = fullData.filter(item => 
                (item.nombre && item.nombre.toLowerCase().includes(query)) || 
                (item.codigo && item.codigo.toLowerCase().includes(query))
            );
            renderDashboard(filtered);
        }

        document.getElementById('admin-pass-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkAdmin();
        });