/* =========================================
   1. FONDO NEURONAL (CANVAS ANIMADO)
   ========================================= */
const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;

        // Ajuste de tamaño al redimensionar ventana
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        // Configuración de partículas
        const particles = [];
        const particleCount = 60; // Cantidad de nodos
        const connectionDist = 150; // Distancia de conexión
        
        // Configuración "Matrix" (Lluvia de datos)
        const codeDrops = [];
        const codeSymbols = "01{}<>/;var🏠🏢🔑"; // Agregué iconos inmobiliarios sutiles

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5; // Velocidad suave
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = '#00f0ff'; // Cian DenIA
                ctx.fill();
            }
        }

        class CodeDrop {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.text = codeSymbols[Math.floor(Math.random() * codeSymbols.length)];
                this.speed = Math.random() * 1.5 + 0.5;
                this.opacity = Math.random() * 0.3 + 0.05; // Muy sutil
            }
            update() {
                this.y += this.speed;
                if (this.y > height) {
                    this.y = -20;
                    this.x = Math.random() * width;
                }
            }
            draw() {
                ctx.fillStyle = `rgba(0, 240, 255, ${this.opacity})`;
                ctx.font = '12px "Space Grotesk"';
                ctx.fillText(this.text, this.x, this.y);
            }
        }

        // Inicializar arrays
        function init() {
            for (let i = 0; i < particleCount; i++) particles.push(new Particle());
            for (let i = 0; i < 40; i++) codeDrops.push(new CodeDrop());
        }

        // Bucle de animación
        function animate() {
            ctx.clearRect(0, 0, width, height);

            // 1. Dibujar Lluvia
            codeDrops.forEach(drop => { drop.update(); drop.draw(); });

            // 2. Dibujar Red
            particles.forEach((p, index) => {
                p.update();
                p.draw();
                // Conectar líneas
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDist) {
                        const opacity = 1 - (distance / connectionDist);
                        ctx.strokeStyle = `rgba(138, 43, 226, ${opacity * 0.5})`; // Violeta sutil
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(animate);
        }

        init();
        animate();
    }


/* =========================================
   2. TYPEWRITER (ESCRITURA)
   ========================================= */
const typeText = document.getElementById('typewriter-text');
if (typeText) {
    const phrases = ["Convertí tu catálogo o lista de propiedades en un asistente de ventas por Whatsapp..."];
    let phraseIndex = 0; let charIndex = 0; let isDeleting = false;

    function typeWriter() {
        const current = phrases[phraseIndex];
        if(isDeleting) {
            typeText.textContent = current.substring(0, charIndex - 1); charIndex--;
        } else {
            typeText.textContent = current.substring(0, charIndex + 1); charIndex++;
        }
        let speed = isDeleting ? 50 : 100;
        if (!isDeleting && charIndex === current.length) { speed = 2000; isDeleting = true; }
        else if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex+1)%phrases.length; speed = 500; }
        setTimeout(typeWriter, speed);
    }
    document.addEventListener('DOMContentLoaded', typeWriter);
}

/* =========================================
   3. CHATBOT REALISTA (CORREGIDO)
   ========================================= */
const chatBox = document.getElementById('dynamic-chat');
if (chatBox) {
    const chatScenarios = [
        {
            name: "Venta Casa",
            msgs: [
                { role: 'user', text: 'Hola, busco casa en venta, zona norte 🏠' },
                { role: 'bot', text: '¡Hola! Tengo esta propiedad premium recién ingresada 👇' },
                { role: 'bot', type: 'image', url: 'https://images.unsplash.com/photo-1600596542815-27b88e35eab1?w=500&q=80', caption: 'USD 280.000' },
                { role: 'bot', text: '3 Habitaciones, Piscina, 400m². ¿Te envío la ficha PDF?' }
            ]
        },
        {
            name: "Alquiler Casa",
            msgs: [
                { role: 'user', text: 'Busco alquiler anual para familia' },
                { role: 'bot', text: 'Tengo esta opción disponible:' },
                { role: 'bot', type: 'image', url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&q=80', caption: '$850.000 /mes' },
                { role: 'bot', text: 'Barrio Cerrado, seguridad 24hs.' }
            ]
        },
        {
            name: "Alquiler Depto",
            msgs: [
                { role: 'user', text: 'Info de deptos para estudiantes 🎓' },
                { role: 'bot', text: 'Mira este monoambiente cerca de la facultad:' },
                { role: 'bot', type: 'image', url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500&q=80', caption: '$350.000 + Exp' },
                { role: 'bot', text: 'Totalmente amoblado. Requisito: Garantía.' }
            ]
        }
    ];

    let currentScenario = 0;
    let msgIndex = 0;

    function runChat() {
        if(msgIndex >= chatScenarios[currentScenario].msgs.length) {
            setTimeout(() => {
                chatBox.innerHTML = ''; msgIndex = 0;
                currentScenario = (currentScenario + 1) % chatScenarios.length;
                setTimeout(runChat, 1000);
            }, 5000);
            return;
        }
        
        const data = chatScenarios[currentScenario].msgs[msgIndex];
        const div = document.createElement('div');
        div.className = `chat-message ${data.role}`;
        
        // Hora Simulada
        const now = new Date();
        const time = now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0');
        
        // Check azul solo para el usuario
        const checkHtml = data.role === 'user' ? '<span class="double-check"></span>' : '';
        
        // Estructura HTML exacta para que el CSS funcione
        let content = '';
        if(data.type === 'image') {
            content = `<div class="chat-img-wrapper"><img src="${data.url}"></div>`;
            if(data.caption) content += `<div>${data.caption}</div>`;
        } else {
            content = data.text;
        }

        // Inyección con metadatos (Hora + Check)
        div.innerHTML = `${content}<span class="msg-meta">${time} ${checkHtml}</span>`;

        chatBox.appendChild(div);
        chatBox.scrollTop = chatBox.scrollHeight;
        
        msgIndex++;
        setTimeout(runChat, data.type === 'image' ? 1800 : 1500);
    }
    setTimeout(runChat, 1000);
}

/* =========================================
   4. TOGGLE MONEDA
   ========================================= */
const switchInput = document.getElementById('currency-switch');
const labelArs = document.getElementById('label-ars');
const labelUsd = document.getElementById('label-usd');
const prices = document.querySelectorAll('.plan-price');

if(switchInput) {
    switchInput.addEventListener('change', function() {
        const isUsd = this.checked;
        if(isUsd) { labelUsd.classList.add('active'); labelArs.classList.remove('active'); }
        else { labelArs.classList.add('active'); labelUsd.classList.remove('active'); }

        prices.forEach(el => {
            const ars = el.dataset.ars; const usd = el.dataset.usd;
            const amt = el.querySelector('.amount');
            const sym = el.querySelector('.currency-symbol');
            if(amt && ars && usd) {
                amt.style.opacity = 0;
                setTimeout(() => {
                    amt.innerText = isUsd ? usd : ars;
                    sym.innerText = isUsd ? 'USD ' : '$';
                    amt.style.opacity = 1;
                }, 200);
            }
        });
    });
}