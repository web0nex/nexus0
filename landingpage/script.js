document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Animaciones al hacer Scroll (Intersection Observer)
    // Esto hace que los elementos aparezcan elegantemente a medida que bajas
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOptions = {
        threshold: 0.15, // Se activa cuando el 15% del elemento es visible
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Dejar de observar una vez que ya apareció para que no parpadee
                observer.unobserve(entry.target); 
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 2. Lógica del Toggle de Precios Mensual/Anual
    const toggleSwitch = document.getElementById('pricing-toggle');
    const labelMonthly = document.getElementById('label-monthly');
    const labelYearly = document.getElementById('label-yearly');
    const amounts = document.querySelectorAll('.amount');

    toggleSwitch.addEventListener('change', function() {
        if (this.checked) {
            // Modo Anual
            labelYearly.classList.add('active');
            labelMonthly.classList.remove('active');
            
            amounts.forEach(amount => {
                amount.style.opacity = 0;
                setTimeout(() => {
                    amount.innerText = amount.getAttribute('data-yearly');
                    amount.style.opacity = 1;
                }, 200);
            });
        } else {
            // Modo Mensual
            labelMonthly.classList.add('active');
            labelYearly.classList.remove('active');
            
            amounts.forEach(amount => {
                amount.style.opacity = 0;
                setTimeout(() => {
                    amount.innerText = amount.getAttribute('data-monthly');
                    amount.style.opacity = 1;
                }, 200);
            });
        }
    });

    // Transición suave para los números
    amounts.forEach(amount => {
        amount.style.transition = 'opacity 0.2s ease-in-out';
    });

    // 3. Efecto de clic en botones
    const primaryBtns = document.querySelectorAll('.btn-primary');
    primaryBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const originalText = this.innerText;
            this.innerText = 'Cargando...';
            this.style.opacity = '0.8';
            setTimeout(() => {
                this.innerText = originalText;
                this.style.opacity = '1';
            }, 1000);
        });
    });
});