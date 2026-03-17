document.addEventListener("DOMContentLoaded", () => {

    // --- NAVEGACIÓN SUAVE CON OFFSET AJUSTABLE ---
    const scrollLinks = document.querySelectorAll('.scroll-link');
    
    function smoothScrollTo(targetId) {
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        let offsetPC = 140;    
        let offsetMovil = 120; 

        if (targetId === '#proyectos') {
            offsetPC = -15;    
            offsetMovil = -15; 
        } 
        else if (targetId === '#casos-exito') {
            offsetPC = -185;    
            offsetMovil = 0; 
        } 
        else if (targetId === '#proceso') {
            offsetPC = 60;     
            offsetMovil = 60;  
        }

        const headerOffset = window.innerWidth <= 768 ? offsetMovil : offsetPC; 
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }

    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            smoothScrollTo(targetId);
        });
    });


    // --- LÓGICA DEL CARRUSEL INFINITO PERFECTO (SIN SALTOS VISIBLES) ---
    const track = document.getElementById("carousel-track");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    if (track && prevBtn && nextBtn) {
        const originalCards = Array.from(track.querySelectorAll(".testi-card"));
        const cardCount = originalCards.length;

        // 1. Clonar tarjetas
        originalCards.forEach(card => {
            let clone = card.cloneNode(true);
            clone.classList.remove('active', 'focused');
            track.appendChild(clone);
        });
        originalCards.forEach(card => {
            let clone = card.cloneNode(true);
            clone.classList.remove('active', 'focused');
            track.appendChild(clone);
        });

        const allCards = Array.from(track.querySelectorAll(".testi-card"));
        let currentIndex = cardCount; 
        let isJumping = false;
        let scrollTimeout;

        function setFocusStrict(index) {
            allCards.forEach((card, i) => {
                if (i === index) {
                    card.classList.add("focused");
                } else {
                    card.classList.remove("focused");
                }
            });
        }

        function updateFocusedCardByScroll() {
            if (isJumping) return;
            const trackCenter = track.getBoundingClientRect().left + track.offsetWidth / 2;
            let closestDistance = Infinity;
            let newIndex = currentIndex;

            allCards.forEach((card, index) => {
                const cardCenter = card.getBoundingClientRect().left + card.offsetWidth / 2;
                const distance = Math.abs(trackCenter - cardCenter);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    newIndex = index;
                }
            });

            if (currentIndex !== newIndex) {
                currentIndex = newIndex;
                setFocusStrict(currentIndex);
            }
        }

        // Función de salto ninja mejorada (Apagamos TODO lo que pelea contra JS antes de saltar)
        function jumpToMiddleIfNecessary() {
            if (currentIndex < cardCount || currentIndex >= cardCount * 2) {
                isJumping = true;
                
                // Desactivamos animaciones y comportamientos magnéticos
                track.style.scrollBehavior = 'auto';
                track.style.scrollSnapType = 'none';
                allCards.forEach(c => c.style.transition = 'none');

                // Calculamos el índice espejo en el set del medio
                if (currentIndex < cardCount) {
                    currentIndex += cardCount;
                } else if (currentIndex >= cardCount * 2) {
                    currentIndex -= cardCount;
                }

                const card = allCards[currentIndex];
                track.scrollLeft = card.offsetLeft - (track.clientWidth / 2) + (card.offsetWidth / 2);
                setFocusStrict(currentIndex);

                // Forzamos al navegador a aplicar el salto invisible YA MISMO
                void track.offsetWidth; 

                // Restauramos las animaciones
                track.style.scrollBehavior = 'smooth';
                track.style.scrollSnapType = 'x mandatory';
                allCards.forEach(c => c.style.transition = '');
                
                setTimeout(() => { isJumping = false; }, 50);
            }
        }

        nextBtn.addEventListener("click", () => {
            if (isJumping) return;
            if (currentIndex < allCards.length - 1) {
                currentIndex++;
                setFocusStrict(currentIndex); 
                const card = allCards[currentIndex];
                track.scrollTo({ left: card.offsetLeft - (track.clientWidth / 2) + (card.offsetWidth / 2), behavior: 'smooth' });
            }
        });

        prevBtn.addEventListener("click", () => {
            if (isJumping) return;
            if (currentIndex > 0) {
                currentIndex--;
                setFocusStrict(currentIndex); 
                const card = allCards[currentIndex];
                track.scrollTo({ left: card.offsetLeft - (track.clientWidth / 2) + (card.offsetWidth / 2), behavior: 'smooth' });
            }
        });

        track.addEventListener("scroll", () => {
            window.requestAnimationFrame(updateFocusedCardByScroll);
            clearTimeout(scrollTimeout);
            // Reducimos el timeout para que el salto ocurra apenas dejes de deslizar
            scrollTimeout = setTimeout(jumpToMiddleIfNecessary, 100);
        });

        window.addEventListener("resize", () => {
            if(isJumping) return;
            const card = allCards[currentIndex];
            track.scrollLeft = card.offsetLeft - (track.clientWidth / 2) + (card.offsetWidth / 2);
        });

        // Inicialización teletransportando al medio sin animaciones
        setTimeout(() => {
            isJumping = true;
            track.style.scrollBehavior = 'auto';
            track.style.scrollSnapType = 'none';
            allCards.forEach(c => c.style.transition = 'none'); 
            
            const card = allCards[currentIndex];
            track.scrollLeft = card.offsetLeft - (track.clientWidth / 2) + (card.offsetWidth / 2);
            setFocusStrict(currentIndex);
            
            void track.offsetWidth; 
            track.style.scrollBehavior = 'smooth';
            track.style.scrollSnapType = 'x mandatory';
            allCards.forEach(c => c.style.transition = ''); 
            setTimeout(() => { isJumping = false; }, 100);
        }, 100); 
    }


    // --- SISTEMA DE NOTIFICACIONES (TOAST) ---
    const toastContainer = document.getElementById("toast-container");

    function mostrarNotificacion(mensaje, icono = "bx-info-circle") {
        const toast = document.createElement("div");
        toast.className = "toast";
        toast.innerHTML = `<i class='bx ${icono}'></i> <span>${mensaje}</span>`;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.classList.add("show"), 10);
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }


    // --- ANIMACIONES AL HACER SCROLL ---
    const reveals = document.querySelectorAll(".reveal");

    function revealOnScroll() {
        for (let i = 0; i < reveals.length; i++) {
            let windowHeight = window.innerHeight;
            let elementTop = reveals[i].getBoundingClientRect().top;
            let elementVisible = 100;

            if (elementTop < windowHeight - elementVisible) {
                reveals[i].classList.add("active");
            }
        }
    }
    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); 


    // --- LÓGICA DEL MODAL Y FORMULARIO ---
    const modal = document.getElementById("modal");
    const btnCotizar1 = document.getElementById("btn-cotizar");
    const btnCotizar2 = document.getElementById("btn-cotizar-2");
    const closeModal = document.getElementById("close-modal");
    const form = document.getElementById("quote-form");
    
    const selectTipo = document.getElementById("cliente-tipo");
    const grupoDinamico = document.getElementById("grupo-dinamico");
    const labelDinamico = document.getElementById("label-dinamico");
    const inputDinamico = document.getElementById("cliente-dinamico");

    if(btnCotizar1) btnCotizar1.addEventListener("click", () => { modal.classList.add("active"); });
    if(btnCotizar2) btnCotizar2.addEventListener("click", () => { modal.classList.add("active"); });
    
    closeModal.addEventListener("click", () => { modal.classList.remove("active"); });
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("active");
    });

    selectTipo.addEventListener("change", (e) => {
        const opcionElegida = e.target.value;
        grupoDinamico.classList.remove("hidden");
        grupoDinamico.classList.add("show-dynamic");

        if (opcionElegida === "Tienda Online") {
            labelDinamico.innerText = "¿Qué tipo de productos vas a vender?";
            inputDinamico.placeholder = "Ej: Ropa, tecnología, servicios digitales...";
            inputDinamico.required = true;
        } else if (opcionElegida === "Landing Page") {
            labelDinamico.innerText = "¿Cuál es el objetivo principal de la página?";
            inputDinamico.placeholder = "Ej: Captar clientes, vender un curso, presentar un evento...";
            inputDinamico.required = true;
        } else if (opcionElegida === "Web Institucional") {
            labelDinamico.innerText = "¿Qué secciones o páginas necesitas?";
            inputDinamico.placeholder = "Ej: Inicio, Nosotros, Servicios, Contacto...";
            inputDinamico.required = true;
        } else if (opcionElegida === "Sistema a medida") {
            labelDinamico.innerText = "¿Qué problema principal quieres resolver?";
            inputDinamico.placeholder = "Ej: Gestionar inventario, reservas, panel de empleados...";
            inputDinamico.required = true;
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault(); 
        const nombre = document.getElementById("cliente-nombre").value;
        const marca = document.getElementById("cliente-marca").value;
        const tipo = document.getElementById("cliente-tipo").value;
        const respuestaDinamica = inputDinamico.value;
        const presupuesto = document.getElementById("cliente-presupuesto").value;
        const detalles = document.getElementById("cliente-detalles").value;
        
        const telefono = "5491122429945"; 

        let mensaje = `👋 Hola Ezequiel, mi nombre es *${nombre}* y represento a la marca/empresa *${marca}*.\n\n`;
        mensaje += `💻 Me interesa cotizar una: *${tipo}*\n`;
        mensaje += `📌 Detalle principal: _${respuestaDinamica}_\n`;
        mensaje += `💰 Presupuesto: *${presupuesto}*\n\n`;
        
        if (detalles.trim() !== "") { mensaje += `📝 Más detalles:\n_${detalles}_\n\n`; }
        mensaje += `¿Cuándo podemos coordinar para charlarlo?`;

        const urlWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(urlWhatsApp, "_blank");

        modal.classList.remove("active");
        form.reset();
        grupoDinamico.classList.add("hidden");
        grupoDinamico.classList.remove("show-dynamic");
    });
});
