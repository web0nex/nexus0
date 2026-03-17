document.addEventListener("DOMContentLoaded", () => {
    const TASA_DOLAR = 1487; 

    const productos = [
        // TECLADOS
        { id: 1, nombre: "Teclado Mecánico K600", categoria: "teclados", precioUSD: 89, imagen: "img/teclado-1.png" },
        { id: 2, nombre: "Teclado Custom RGB", categoria: "teclados", precioUSD: 189, imagen: "img/teclado-2.png" },
        { id: 3, nombre: "Teclado TKL Pro Red", categoria: "teclados", precioUSD: 129, imagen: "img/teclado-3.png" },
        { id: 4, nombre: "Teclado 60% Wireless", categoria: "teclados", precioUSD: 75, imagen: "img/teclado-4.png" },
        
        // AURICULARES
        { id: 5, nombre: "Auriculares Void Pro", categoria: "auriculares", precioUSD: 135, imagen: "img/auriculares-1.png" },
        { id: 6, nombre: "Auriculares Studio X", categoria: "auriculares", precioUSD: 99, imagen: "img/auriculares-2.png" },
        { id: 7, nombre: "Auriculares 7.1 Surround", categoria: "auriculares", precioUSD: 85, imagen: "img/auriculares-3.png" },
        { id: 8, nombre: "Auriculares Pro Wireless", categoria: "auriculares", precioUSD: 160, imagen: "img/auriculares-4.png" },
        
        // MOUSE
        { id: 9, nombre: "Mouse Óptico G-Pro", categoria: "ratones", precioUSD: 65, imagen: "img/mouse-1.png" },
        { id: 10, nombre: "Mouse Superlight X", categoria: "ratones", precioUSD: 145, imagen: "img/mouse-2.png" },
        { id: 11, nombre: "Mouse Ergo Wireless", categoria: "ratones", precioUSD: 45, imagen: "img/mouse-3.png" },
        { id: 12, nombre: "Mouse MMO 12-Botones", categoria: "ratones", precioUSD: 79, imagen: "img/mouse-4.png" },

        // MOUSEPADS
        { id: 13, nombre: "Mousepad XXL Glide", categoria: "mousepads", precioUSD: 29, imagen: "img/mousepad-1.png" },
        { id: 14, nombre: "Mousepad RGB Extended", categoria: "mousepads", precioUSD: 49, imagen: "img/mousepad-2.png" },
        { id: 15, nombre: "Mousepad Speed Medium", categoria: "mousepads", precioUSD: 15, imagen: "img/mousepad-3.png" },
        { id: 16, nombre: "Glass Pad Premium", categoria: "mousepads", precioUSD: 89, imagen: "img/mousepad-4.png" }
    ];

    let carrito = JSON.parse(localStorage.getItem("neonCart")) || [];

    const productsContainer = document.getElementById("products-container");
    const cartCount = document.getElementById("cart-count");
    const cartItemsContainer = document.getElementById("cart-items");
    const totalUsdEl = document.getElementById("total-usd");
    const totalArsEl = document.getElementById("total-ars");

    // 1. Renderizar Productos
    function renderProductos(filtro = "todos") {
        productsContainer.innerHTML = "";
        
        const productosFiltrados = filtro === "todos" 
            ? productos 
            : productos.filter(p => p.categoria === filtro);

        productosFiltrados.forEach((prod, index) => {
            const precioARS = prod.precioUSD * TASA_DOLAR;
            
            const card = document.createElement("div");
            card.className = "product-card fade-in";
            // Aceleramos un poco la animación para que en celular no se sienta lento
            card.style.animationDelay = `${index * 0.03}s`;

            card.innerHTML = `
                <div class="product-img">
                    <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy">
                </div>
                <div class="product-cat">${prod.categoria}</div>
                <h3 class="product-title">${prod.nombre}</h3>
                <div class="product-prices">
                    <span class="price-usd">U$D ${prod.precioUSD.toFixed(2)}</span>
                    <span class="price-ars">$ ${precioARS.toLocaleString('es-AR')} ARS</span>
                </div>
                <button class="add-btn" onclick="agregarAlCarrito(${prod.id})">
                    <i class='bx bx-cart-add'></i> <span class="btn-text">Agregar</span>
                </button>
            `;
            productsContainer.appendChild(card);
        });
    }

    // 2. Filtros de Categoría con autoscroll en móvil
    const catBtns = document.querySelectorAll(".cat-btn");
    const navCategories = document.querySelector(".nav-categories");

    catBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            catBtns.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            renderProductos(e.target.dataset.cat);

            // Centrar suavemente el botón seleccionado en celular
            if (window.innerWidth <= 768) {
                const scrollLeft = e.target.offsetLeft - (navCategories.offsetWidth / 2) + (e.target.offsetWidth / 2);
                navCategories.scrollTo({ left: scrollLeft, behavior: 'smooth' });
            }
        });
    });

    // 3. Lógica del Carrito
    window.agregarAlCarrito = (id) => {
        const producto = productos.find(p => p.id === id);
        carrito.push(producto);
        guardarCarrito();
        actualizarUI();
        
        cartCount.classList.remove("pulse");
        void cartCount.offsetWidth; 
        cartCount.classList.add("pulse");
    };

    window.eliminarDelCarrito = (index) => {
        carrito.splice(index, 1);
        guardarCarrito();
        actualizarUI();
    };

    function guardarCarrito() {
        localStorage.setItem("neonCart", JSON.stringify(carrito));
    }

    function actualizarUI() {
        cartCount.innerText = carrito.length;
        cartItemsContainer.innerHTML = "";
        
        let totalUSD = 0;

        carrito.forEach((prod, index) => {
            totalUSD += prod.precioUSD;
            const item = document.createElement("div");
            item.className = "cart-item fade-in";
            
            item.innerHTML = `
                <img src="${prod.imagen}" alt="${prod.nombre}" class="cart-item-img">
                <div class="item-details">
                    <h4>${prod.nombre}</h4>
                    <p>U$D ${prod.precioUSD}</p>
                </div>
                <button class="remove-btn" onclick="eliminarDelCarrito(${index})"><i class='bx bx-trash'></i></button>
            `;
            cartItemsContainer.appendChild(item);
        });

        const totalARS = totalUSD * TASA_DOLAR;
        totalUsdEl.innerText = `U$D ${totalUSD.toFixed(2)}`;
        totalArsEl.innerText = `$ ${totalARS.toLocaleString('es-AR')}`;
    }

    // 4. Abrir y Cerrar Carrito Lateral
    const cartBtn = document.getElementById("cart-btn");
    const closeCartBtn = document.getElementById("close-cart");
    const cartSidebar = document.getElementById("cart-sidebar");
    const cartOverlay = document.getElementById("cart-overlay");

    function toggleCart() {
        cartSidebar.classList.toggle("active");
        cartOverlay.classList.toggle("active");
    }

    cartBtn.addEventListener("click", toggleCart);
    closeCartBtn.addEventListener("click", toggleCart);
    cartOverlay.addEventListener("click", toggleCart);

    renderProductos();
    actualizarUI();
});