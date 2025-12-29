document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. RECUPERAR DATOS DEL CLIENTE ---
    const userPlan = localStorage.getItem('deniaPlan') || 'gratis';
    const userName = localStorage.getItem('deniaUser') || 'Agente';
    const addonPrice = parseInt(localStorage.getItem('deniaAddonPrice') || '0');
    const hasPhotoPack = addonPrice > 0;

    // Actualizar nombre
    document.getElementById('user-display-name').innerText = userName;

    // --- 2. GESTIÓN DE PERMISOS ---
    const PLAN_PERMISSIONS = {
        'gratis': ['panel-config', 'panel-metrics'],
        'inicial': ['panel-config', 'panel-metrics', 'panel-properties'],
        'desarrollo': ['panel-config', 'panel-metrics', 'panel-properties', 'panel-calendar', 'panel-catalog'],
        'medida': 'all'
    };

    let allowedPanels = PLAN_PERMISSIONS[userPlan] || PLAN_PERMISSIONS['gratis'];

    // Si pagó pack de fotos, se le habilita el catálogo sí o sí
    if (hasPhotoPack && Array.isArray(allowedPanels)) {
        if (!allowedPanels.includes('panel-catalog')) {
            allowedPanels.push('panel-catalog');
        }
    }

    // --- 3. ACTUALIZAR SIDEBAR ---
    const planBadge = document.getElementById('user-plan-badge');
    const addonStatus = document.getElementById('addon-status');

    planBadge.innerText = userPlan.toUpperCase();
    
    // Colores badge
    if(userPlan === 'desarrollo') planBadge.style.background = '#8a2be2';
    else if(userPlan === 'inicial') planBadge.style.background = '#00f0ff';
    
    if (hasPhotoPack) {
        addonStatus.style.display = 'block';
    }

    // --- 4. BLOQUEO DE MENÚ ---
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        const target = item.dataset.target;
        if (!target) return;

        let isLocked = true;
        if (allowedPanels === 'all' || allowedPanels.includes(target)) {
            isLocked = false;
        }

        if (isLocked) {
            item.classList.add('locked');
            item.addEventListener('click', (e) => {
                e.preventDefault();
                showToast("🔒 Función no disponible en tu plan.");
            });
        } else {
            item.classList.remove('locked');
            // Quitar candado visual
            const lock = item.querySelector('.lock-icon');
            if(lock) lock.style.display = 'none';

            item.addEventListener('click', (e) => {
                e.preventDefault();
                navigateToPanel(target, item);
            });
        }
    });

    // --- 5. NAVEGACIÓN ENTRE PANELES ---
    function navigateToPanel(panelId, activeItem) {
        // Actualizar menú activo
        menuItems.forEach(i => i.classList.remove('active'));
        activeItem.classList.add('active');

        // Mostrar panel correcto
        document.querySelectorAll('.panel-section').forEach(p => p.classList.add('hidden-panel'));
        
        const targetPanel = document.getElementById(panelId);
        if (targetPanel) {
            targetPanel.classList.remove('hidden-panel');
            targetPanel.classList.add('active');
        }

        // Cambiar título (limpiando emojis)
        const cleanTitle = activeItem.innerText.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, "").trim();
        document.getElementById('section-title').innerText = cleanTitle;

        // En móvil, cerrar menú al elegir
        if (window.innerWidth <= 900) {
            toggleSidebar(false);
        }
    }

    // --- 6. MENÚ FLOTANTE MÓVIL ---
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');

    function toggleSidebar(show) {
        if (show) {
            sidebar.classList.add('active');
        } else {
            sidebar.classList.remove('active');
        }
    }

    if(menuBtn) menuBtn.addEventListener('click', () => toggleSidebar(true));
    if(overlay) overlay.addEventListener('click', () => toggleSidebar(false));

    // --- 7. CARGA DE ARCHIVOS ---
    const fileInput = document.getElementById('file-input');
    const dropZone = document.getElementById('drop-zone');
    const fileList = document.getElementById('file-list-container');

    if(dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
        
        // Drag logic opcional aquí...
    }

    function handleFiles(files) {
        Array.from(files).forEach(file => {
            const div = document.createElement('div');
            div.className = 'file-item'; // Asegúrate de tener estilo para esto o usa inline
            div.style.cssText = "background:rgba(255,255,255,0.05); padding:10px; margin-top:10px; border-radius:8px; display:flex; align-items:center; gap:10px;";
            div.innerHTML = `
                <span>📄</span>
                <span style="color:white; font-size:0.9rem;">${file.name}</span>
                <span style="margin-left:auto; color:#00ff88; font-size:0.8rem;">Listo</span>
            `;
            fileList.appendChild(div);
        });
        if(files.length > 0) {
            document.getElementById('upload-title').innerText = "Archivos Listos para Procesar";
        }
    }

    // --- 8. GUARDAR CONFIGURACIÓN ---
    const configForm = document.getElementById('bot-config-form');
    if(configForm) {
        configForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = configForm.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            
            btn.innerText = "Guardando...";
            btn.disabled = true;

            // Simular guardado
            setTimeout(() => {
                btn.innerText = "¡Configuración Guardada!";
                showToast("✅ IA Actualizada Exitosamente");
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }

    // Toast Utility
    window.showToast = function(message) {
        const toast = document.createElement('div');
        toast.style.cssText = "position:fixed; bottom:20px; right:20px; background:#00ff88; color:#000; padding:15px 25px; border-radius:8px; font-weight:bold; z-index:9999; box-shadow:0 5px 15px rgba(0,0,0,0.3);";
        toast.innerText = message;
        document.getElementById('toast-container').appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
});