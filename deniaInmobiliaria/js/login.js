document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const loginBtn = document.getElementById('login-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita que la página se recargue

            const email = emailInput.value;
            const password = passwordInput.value;

            // Validación simple
            if (email && password) {
                
                // 1. Feedback visual (Cargando...)
                const originalText = loginBtn.innerText;
                loginBtn.innerText = "Verificando credenciales...";
                loginBtn.style.opacity = "0.7";
                loginBtn.disabled = true;

                // 2. Extraer nombre del email para personalizar el Dashboard
                // Ej: juan.perez@empresa.com -> "Juan Perez"
                let userName = email.split('@')[0];
                userName = userName.replace('.', ' '); // Reemplazar puntos por espacios
                // Capitalizar primera letra
                userName = userName.charAt(0).toUpperCase() + userName.slice(1);

                // 3. Simular petición al servidor (1.5 segundos)
                setTimeout(() => {
                    
                    // Guardar datos en LocalStorage para usarlos en el dashboard
                    localStorage.setItem('deniaUser', userName);
                    
                    // Si no tiene plan definido, le damos uno por defecto para demo
                    if (!localStorage.getItem('deniaPlan')) {
                        localStorage.setItem('deniaPlan', 'inicial'); 
                    }

                    // 4. Éxito visual
                    loginBtn.innerText = "¡Acceso Concedido!";
                    loginBtn.style.background = "#00ff88"; // Verde éxito

                    // 5. Redirección
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 500);

                }, 1500);

            } else {
                // Error visual si faltan datos (aunque el 'required' del HTML ya lo cubre)
                alert("Por favor completa todos los campos.");
            }
        });
    }
});