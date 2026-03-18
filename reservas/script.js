document.addEventListener('DOMContentLoaded', function() {
    // Lógica visual para la selección de horarios (ahora sí interactúa sin fallos)
    const hourButtons = document.querySelectorAll('.hour-btn');
    
    hourButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Evita recargas si estuviera en un form
            // Remover la clase 'selected' de todos los botones
            hourButtons.forEach(btn => btn.classList.remove('selected'));
            // Añadir la clase 'selected' solo al botón clickeado
            this.classList.add('selected');
        });
    });

    // Efecto visual para el botón de confirmar (sin alertas molestas, solo feedback visual)
    const btnConfirmar = document.getElementById('btn-confirmar');
    if (btnConfirmar) {
        btnConfirmar.addEventListener('click', function() {
            const originalText = this.innerText;
            this.innerText = 'PROCESANDO...';
            this.style.opacity = '0.7';
            this.style.pointerEvents = 'none'; // Deshabilita clics múltiples

            // Simula un tiempo de carga y vuelve a la normalidad
            setTimeout(() => {
                this.innerText = 'RESERVA CONFIRMADA ✔';
                this.style.background = 'var(--neon-cyan)';
                this.style.color = '#000';
                this.style.opacity = '1';
                
                // Resetear después de 3 segundos
                setTimeout(() => {
                    this.innerText = originalText;
                    this.style.background = 'rgba(0, 240, 255, 0.05)';
                    this.style.color = 'var(--neon-cyan)';
                    this.style.pointerEvents = 'auto';
                }, 3000);
            }, 800);
        });
    }
});