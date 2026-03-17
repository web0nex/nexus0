document.addEventListener("DOMContentLoaded", () => {
    
    // --- NAVEGACIÓN SUAVE EXACTA (SMOOTH SCROLL) ---
    const scrollLinks = document.querySelectorAll('.scroll-link');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetId === '#proyectos') {
                const headerOffset = -20; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            } else if (targetId === '#casos-exito') {
                const headerOffset = -60; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            } else if (targetId === '#proceso') {
                const headerOffset = 60; 
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

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