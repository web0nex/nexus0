document.addEventListener("DOMContentLoaded", () => {

    // =============================================
    // NAVBAR: Scroll effect + Active links
    // =============================================
    const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", () => {
        navbar.classList.toggle("scrolled", window.scrollY > 40);
    });


    // =============================================
    // HAMBURGER MENU
    // =============================================
    const hamburger = document.getElementById("hamburger");
    const mobileMenu = document.getElementById("mobile-menu");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        mobileMenu.classList.toggle("open");
    });

    // Cerrar menú al hacer click en un link del menú móvil
    document.querySelectorAll(".mobile-link").forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            mobileMenu.classList.remove("open");
        });
    });


    // =============================================
    // SMOOTH SCROLL CON OFFSET
    // =============================================
    function smoothScrollTo(targetId) {
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        const navHeight = navbar.offsetHeight;
        const extraOffset = 20;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navHeight - extraOffset;

        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }

    document.querySelectorAll(".scroll-link").forEach(link => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            if (href && href.startsWith("#")) {
                e.preventDefault();
                smoothScrollTo(href);
            }
        });
    });


    // =============================================
    // CARRUSEL INFINITO (REUTILIZABLE)
    // =============================================
    function setupInfiniteCarousel(trackId, prevBtnId, nextBtnId, cardSelector) {
        const track = document.getElementById(trackId);
        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);

        if (!track || !prevBtn || !nextBtn) return;

        const originalCards = Array.from(track.querySelectorAll(cardSelector));
        const cardCount = originalCards.length;

        // Clonar tarjetas para efecto infinito
        [originalCards, originalCards].forEach(group => {
            group.forEach(card => {
                const clone = card.cloneNode(true);
                clone.classList.remove("active", "focused");
                track.appendChild(clone);
            });
        });

        const allCards = Array.from(track.querySelectorAll(cardSelector));
        let currentIndex = cardCount;
        let isJumping = false;
        let scrollTimeout;

        function setFocus(index) {
            allCards.forEach((card, i) => {
                card.classList.toggle("focused", i === index);
            });
        }

        function updateFocusByScroll() {
            if (isJumping) return;
            const trackCenter = track.getBoundingClientRect().left + track.offsetWidth / 2;
            let closestDist = Infinity;
            let newIndex = currentIndex;

            allCards.forEach((card, i) => {
                const cardCenter = card.getBoundingClientRect().left + card.offsetWidth / 2;
                const dist = Math.abs(trackCenter - cardCenter);
                if (dist < closestDist) { closestDist = dist; newIndex = i; }
            });

            if (currentIndex !== newIndex) {
                currentIndex = newIndex;
                setFocus(currentIndex);
            }
        }

        function jumpToMiddle() {
            if (currentIndex < cardCount || currentIndex >= cardCount * 2) {
                isJumping = true;
                track.style.scrollBehavior = "auto";
                track.style.scrollSnapType = "none";
                allCards.forEach(c => c.style.transition = "none");

                if (currentIndex < cardCount) currentIndex += cardCount;
                else if (currentIndex >= cardCount * 2) currentIndex -= cardCount;

                const card = allCards[currentIndex];
                track.scrollLeft = card.offsetLeft - (track.clientWidth / 2) + (card.offsetWidth / 2);
                setFocus(currentIndex);

                void track.offsetWidth;
                track.style.scrollBehavior = "smooth";
                track.style.scrollSnapType = "x mandatory";
                allCards.forEach(c => c.style.transition = "");
                setTimeout(() => { isJumping = false; }, 50);
            }
        }

        function scrollToCard(index) {
            if (isJumping) return;
            const card = allCards[index];
            track.scrollTo({
                left: card.offsetLeft - (track.clientWidth / 2) + (card.offsetWidth / 2),
                behavior: "smooth"
            });
        }

        nextBtn.addEventListener("click", () => {
            if (isJumping || currentIndex >= allCards.length - 1) return;
            currentIndex++;
            setFocus(currentIndex);
            scrollToCard(currentIndex);
        });

        prevBtn.addEventListener("click", () => {
            if (isJumping || currentIndex <= 0) return;
            currentIndex--;
            setFocus(currentIndex);
            scrollToCard(currentIndex);
        });

        track.addEventListener("scroll", () => {
            window.requestAnimationFrame(updateFocusByScroll);
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(jumpToMiddle, 100);
        });

        window.addEventListener("resize", () => {
            if (isJumping) return;
            const card = allCards[currentIndex];
            track.scrollLeft = card.offsetLeft - (track.clientWidth / 2) + (card.offsetWidth / 2);
        });

        // Init
        setTimeout(() => {
            isJumping = true;
            track.style.scrollBehavior = "auto";
            track.style.scrollSnapType = "none";
            allCards.forEach(c => c.style.transition = "none");

            const card = allCards[currentIndex];
            track.scrollLeft = card.offsetLeft - (track.clientWidth / 2) + (card.offsetWidth / 2);
            setFocus(currentIndex);

            void track.offsetWidth;
            track.style.scrollBehavior = "smooth";
            track.style.scrollSnapType = "x mandatory";
            allCards.forEach(c => c.style.transition = "");
            setTimeout(() => { isJumping = false; }, 100);
        }, 100);
    }

    setupInfiniteCarousel("projects-track", "prev-btn-projects", "next-btn-projects", ".project-card");


    // =============================================
    // SCROLL REVEAL
    // =============================================
    const reveals = document.querySelectorAll(".reveal");

    function revealOnScroll() {
        const windowHeight = window.innerHeight;
        reveals.forEach(el => {
            if (el.getBoundingClientRect().top < windowHeight - 80) {
                el.classList.add("active");
            }
        });
    }
    window.addEventListener("scroll", revealOnScroll, { passive: true });
    revealOnScroll();


    // =============================================
    // FAQ ACCORDION
    // =============================================
    document.querySelectorAll(".faq-item").forEach(item => {
        const btn = item.querySelector(".faq-question");
        btn.addEventListener("click", () => {
            const isOpen = item.classList.contains("open");
            // Cerrar todos los abiertos
            document.querySelectorAll(".faq-item.open").forEach(open => open.classList.remove("open"));
            // Abrir el clickeado si no estaba abierto
            if (!isOpen) item.classList.add("open");
        });
    });


    // =============================================
    // MODAL DE COTIZACIÓN
    // =============================================
    const modal = document.getElementById("modal");
    const closeModal = document.getElementById("close-modal");
    const form = document.getElementById("quote-form");
    const selectTipo = document.getElementById("cliente-tipo");
    const grupoDinamico = document.getElementById("grupo-dinamico");
    const labelDinamico = document.getElementById("label-dinamico");
    const inputDinamico = document.getElementById("cliente-dinamico");

    function openModal(selectedPlan = null) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        if (selectedPlan) {
            const selectPresupuesto = document.getElementById("cliente-presupuesto");
            for (let opt of selectPresupuesto.options) {
                if (opt.value.toLowerCase().includes(selectedPlan.toLowerCase().split(" ")[1])) { selectPresupuesto.value = opt.value; break; }
            }
        }
    }

    function closeModalFn() {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    }

    // Botones que abren el modal
    const modalTriggers = ["btn-cotizar", "btn-cotizar-2", "btn-nav-cotizar", "btn-mobile-cotizar", "btn-cotizar-works"];
    modalTriggers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("click", () => openModal());
    });

    // Botones de pricing que abren el modal con plan preseleccionado
    document.querySelectorAll(".pricing-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const plan = btn.dataset.plan;
            openModal(plan);
        });
    });

    closeModal.addEventListener("click", closeModalFn);
    modal.addEventListener("click", e => { if (e.target === modal) closeModalFn(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") closeModalFn(); });

    // Campo dinámico según tipo de servicio
    const dynamicFields = {
        "Landing Page": { label: "¿Cuál es el objetivo principal?", placeholder: "Ej: Captar leads, vender un curso, presentar un evento..." },
        "Tienda Online": { label: "¿Qué tipo de productos vas a vender?", placeholder: "Ej: Ropa, tecnología, alimentos, servicios digitales..." },
        "Web Institucional": { label: "¿Qué secciones necesitás?", placeholder: "Ej: Inicio, Nosotros, Servicios, Galería, Contacto..." },
        "Sistema a medida": { label: "¿Qué problema querés resolver?", placeholder: "Ej: Gestión de turnos, inventario, panel de empleados..." }
    };

    selectTipo.addEventListener("change", e => {
        const field = dynamicFields[e.target.value];
        if (field) {
            labelDinamico.innerText = field.label;
            inputDinamico.placeholder = field.placeholder;
            inputDinamico.required = true;
            grupoDinamico.classList.remove("hidden");
            grupoDinamico.classList.add("show-dynamic");
        }
    });

    // Submit del formulario → WhatsApp
    form.addEventListener("submit", e => {
        e.preventDefault();
        const nombre = document.getElementById("cliente-nombre").value.trim();
        const marca = document.getElementById("cliente-marca").value.trim();
        const tipo = document.getElementById("cliente-tipo").value;
        const detalleTipo = inputDinamico.value.trim();
        const presupuesto = document.getElementById("cliente-presupuesto").value;
        const detalles = document.getElementById("cliente-detalles").value.trim();

        const telefono = "5491122429945";

        let msg = `👋 Hola Ezequiel, mi nombre es *${nombre}*`;
        if (marca) msg += ` y represento a *${marca}*`;
        msg += `.\n\n`;
        msg += `💻 Me interesa cotizar: *${tipo}*\n`;
        if (detalleTipo) msg += `📌 ${detalleTipo}\n`;
        msg += `💰 Plan de interés: *${presupuesto}*\n`;
        if (detalles) msg += `\n📝 Detalle adicional:\n_${detalles}_\n`;
        msg += `\n¿Cuándo podemos hablar?`;

        window.open(`https://wa.me/${telefono}?text=${encodeURIComponent(msg)}`, "_blank");
        closeModalFn();
        form.reset();
        grupoDinamico.classList.add("hidden");
        grupoDinamico.classList.remove("show-dynamic");
    });


    // =============================================
    // ANIMACIÓN HOVER 3D EN BROWSER MOCKUP
    // =============================================
    const browserMockup = document.querySelector(".browser-mockup");
    const heroVisual = document.querySelector(".hero-visual");

    if (browserMockup && heroVisual) {
        heroVisual.addEventListener("mousemove", e => {
            const rect = heroVisual.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            browserMockup.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) scale(1.02)`;
        });
        heroVisual.addEventListener("mouseleave", () => {
            browserMockup.style.transform = "perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1)";
        });
        browserMockup.style.transition = "transform 0.15s ease";
    }

});
