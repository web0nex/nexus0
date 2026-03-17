document.addEventListener("DOMContentLoaded", () => {
    
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


    // --- LÓGICA DEL MENÚ LATERAL CON OVERLAY ---
    const menuToggle = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebar-overlay");

    function toggleMenu() {
        sidebar.classList.toggle("show");
        overlay.classList.toggle("show");
        
        // Bloquear scroll del fondo en celular cuando el menú está abierto
        if (sidebar.classList.contains("show")) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener("click", toggleMenu);
    }

    // Cerrar al tocar el fondo oscuro (overlay)
    if (overlay) {
        overlay.addEventListener("click", toggleMenu);
    }


    // --- BASE DE DATOS Y RENDERIZADO DE TABLA ---
    const pedidosRecientes = [
        { id: "#ORD-001", cliente: "Marcos G.", fecha: "13 Mar 2026", monto: "$12,500", estado: "Completado", claseEstado: "completado" },
        { id: "#ORD-002", cliente: "Lucía F.", fecha: "13 Mar 2026", monto: "$8,200", estado: "Pendiente", claseEstado: "pendiente" },
        { id: "#ORD-003", cliente: "Agustín R.", fecha: "12 Mar 2026", monto: "$4,100", estado: "Completado", claseEstado: "completado" },
        { id: "#ORD-004", cliente: "Sofía T.", fecha: "10 Mar 2026", monto: "$15,000", estado: "Cancelado", claseEstado: "cancelado" },
        { id: "#ORD-005", cliente: "Diego M.", fecha: "09 Mar 2026", monto: "$3,600", estado: "Completado", claseEstado: "completado" }
    ];

    const tableBody = document.getElementById("table-body");

    function cargarPedidos() {
        tableBody.innerHTML = ""; 

        pedidosRecientes.forEach((pedido, index) => {
            const fila = document.createElement("tr");
            fila.className = "fade-in";
            fila.style.animationDelay = `${0.5 + (index * 0.1)}s`; 

            fila.innerHTML = `
                <td><strong>${pedido.id}</strong></td>
                <td>${pedido.cliente}</td>
                <td>${pedido.fecha}</td>
                <td>${pedido.monto}</td>
                <td><span class="status ${pedido.claseEstado}">${pedido.estado}</span></td>
                <td>
                    <button class="action-btn" onclick="verDetalle('${pedido.id}', '${pedido.cliente}')" title="Ver detalles">
                        <i class='bx bx-show'></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(fila);
        });
    }

    cargarPedidos();

    // --- INTERACTIVIDAD DE BOTONES ---

    window.verDetalle = (id, cliente) => {
        mostrarNotificacion(`Cargando detalles de ${cliente} (${id})`, "bx-package");
    };

    const btnVerTodos = document.getElementById("btn-ver-todos");
    if(btnVerTodos) {
        btnVerTodos.addEventListener("click", () => {
            mostrarNotificacion("Redirigiendo al historial completo...", "bx-history");
        });
    }

    const btnNoti = document.getElementById("btn-noti");
    if(btnNoti) {
        btnNoti.addEventListener("click", () => {
            mostrarNotificacion("Tienes 3 notificaciones nuevas.", "bx-bell");
        });
    }

    const btnProfile = document.getElementById("btn-profile");
    if(btnProfile) {
        btnProfile.addEventListener("click", () => {
            mostrarNotificacion("Abriendo configuración de perfil...", "bx-user");
        });
    }

    const searchInput = document.getElementById("search-input");
    if(searchInput) {
        searchInput.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                if(searchInput.value.trim() !== "") {
                    mostrarNotificacion(`Buscando resultados para: "${searchInput.value}"`, "bx-search");
                    searchInput.value = ""; 
                }
            }
        });
    }

    const menuLinks = document.querySelectorAll(".nav-item");
    menuLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault(); 
            
            menuLinks.forEach(l => l.parentElement.classList.remove("active"));
            this.parentElement.classList.add("active");
            
            const nombreModulo = this.innerText.trim();
            mostrarNotificacion(`Cargando módulo: ${nombreModulo}`, "bx-loader-circle");
            
            // Cerrar menú en móvil tras hacer clic
            if (window.innerWidth <= 900 && sidebar.classList.contains("show")) {
                toggleMenu(); // Reusamos la función para que saque el overlay y el bloqueo de scroll
            }
        });
    });

});