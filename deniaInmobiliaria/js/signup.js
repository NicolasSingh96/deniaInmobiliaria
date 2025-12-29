document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. CONFIGURACIÓN INICIAL ---
    const BASE_PLANS = {
        'gratis': 0,
        'inicial': 15000,
        'desarrollo': 30000,
        'medida': 0
    };

    // Recuperamos el plan que eligió en la Landing Page (index.html)
    // Si no eligió ninguno, por defecto ponemos 'inicial'
    const selectedPlanKey = localStorage.getItem('deniaPlan') || 'inicial';
    let basePrice = BASE_PLANS[selectedPlanKey] || 0;

    // Actualizamos los textos visuales del resumen
    const planNameDisplay = document.getElementById('plan-name-display');
    const basePriceDisplay = document.getElementById('base-price-display');
    
    if(planNameDisplay) planNameDisplay.innerText = selectedPlanKey.charAt(0).toUpperCase() + selectedPlanKey.slice(1);
    if(basePriceDisplay) basePriceDisplay.innerText = `$${basePrice.toLocaleString()}`;

    // --- 2. LÓGICA DE PASOS (WIZARD) ---
    const steps = document.querySelectorAll('.form-step');
    const bubbles = document.querySelectorAll('.step-bubble');
    const progressLine = document.getElementById('progress-line');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    let currentStep = 0;

    function updateStep() {
        // Mostrar el paso actual
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === currentStep);
        });

        // Actualizar burbujas y barra de progreso
        bubbles.forEach((bubble, index) => {
            if (index < currentStep) {
                bubble.classList.add('completed');
                bubble.classList.remove('active');
                bubble.innerText = '✓';
            } else if (index === currentStep) {
                bubble.classList.add('active');
                bubble.classList.remove('completed');
                bubble.innerText = index + 1;
            } else {
                bubble.classList.remove('active', 'completed');
                bubble.innerText = index + 1;
            }
        });

        const percentage = (currentStep / (steps.length - 1)) * 100;
        progressLine.style.width = `${percentage}%`;

        // Botones
        prevBtn.disabled = currentStep === 0;
        if (currentStep === steps.length - 1) {
            nextBtn.innerText = 'Pagar y Finalizar';
            nextBtn.classList.add('btn-success'); // Opcional: clase para color verde
        } else {
            nextBtn.innerText = 'Siguiente';
            nextBtn.classList.remove('btn-success');
        }
    }

    // --- 3. CÁLCULO DE PRECIOS EN TIEMPO REAL ---
    window.updateTotal = function() {
        const selectedOption = document.querySelector('input[name="pack_fotos"]:checked');
        const addonPrice = selectedOption ? parseInt(selectedOption.value) : 0;
        const total = basePrice + addonPrice;

        document.getElementById('addon-price-display').innerText = `+$${addonPrice.toLocaleString()}`;
        document.getElementById('total-price-display').innerText = `$${total.toLocaleString()}`;
    };

    window.updateTotal(); // Ejecutar al cargar

    // --- 4. NAVEGACIÓN Y ENVÍO ---
    nextBtn.addEventListener('click', () => {
        if (!validateStep(currentStep)) return;

        if (currentStep < steps.length - 1) {
            currentStep++;
            updateStep();
        } else {
            // ESTO ES LO IMPORTANTE: AL FINALIZAR EL ÚLTIMO PASO
            submitForm();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            updateStep();
        }
    });

    function validateStep(stepIndex) {
        const currentStepEl = steps[stepIndex];
        const inputs = currentStepEl.querySelectorAll('input[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                input.style.borderColor = '#ff4d4d';
            } else {
                input.style.borderColor = 'rgba(255,255,255,0.1)';
            }
        });
        return isValid;
    }

    // --- 5. PROCESO FINAL (GUARDADO Y REDIRECCIÓN) ---
    function submitForm() {
        const originalText = nextBtn.innerText;
        nextBtn.innerText = 'Procesando pago...';
        nextBtn.disabled = true;
        nextBtn.style.background = '#333';

        // 1. Capturar Datos Clave
        const nombreUsuario = document.getElementById('nombre').value;
        const packSeleccionado = document.querySelector('input[name="pack_fotos"]:checked');
        const addonPrice = packSeleccionado ? packSeleccionado.value : '0';

        // 2. Simular espera de API (2 segundos)
        setTimeout(() => {
            
            // 3. GUARDAR EN MEMORIA (Para que el Dashboard lo lea)
            // Guardamos el nombre para decirle "Hola Juan"
            localStorage.setItem('deniaUser', nombreUsuario); 
            
            // Guardamos el precio del pack. Si es > 0, el dashboard sabrá que compró fotos.
            localStorage.setItem('deniaAddonPrice', addonPrice);

            // El plan (deniaPlan) ya estaba guardado desde el index, lo mantenemos.

            // 4. Feedback Visual
            nextBtn.innerText = '¡Pago Exitoso!';
            nextBtn.style.background = '#00ff88';
            nextBtn.style.color = '#000';

            // 5. REDIRECCIÓN AL DASHBOARD
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);

        }, 2000);
    }

    // --- 6. VISUAL DE TARJETA DE CRÉDITO ---
    const cardInput = document.getElementById('card-number');
    const cardDisplay = document.querySelector('.card-number-display');
    const holderInput = document.getElementById('card-holder');
    const holderDisplay = document.querySelector('.card-holder-display');
    const expiryInput = document.getElementById('card-expiry');
    const expiryDisplay = document.querySelector('.card-expiry-display');

    if(cardInput) {
        cardInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '').substring(0,16);
            val = val != '' ? val.match(/.{1,4}/g).join(' ') : '';
            e.target.value = val;
            cardDisplay.innerText = val || '•••• •••• •••• ••••';
        });
    }
    if(holderInput) {
        holderInput.addEventListener('input', (e) => {
            holderDisplay.innerText = e.target.value.toUpperCase() || 'NOMBRE TITULAR';
        });
    }
    if(expiryInput) {
        expiryInput.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '').substring(0,4);
            if(val.length >= 2) val = val.substring(0,2) + '/' + val.substring(2);
            e.target.value = val;
            expiryDisplay.innerText = val || 'MM/AA';
        });
    }
});