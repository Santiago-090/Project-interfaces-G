// Mecanismo de recuperación automática para tooltips
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando sistema de recuperación automática de tooltips');
    
    // Verificar si los tooltips aparecen después del modal
    let tooltipCheckAttempts = 0;
    const maxAttempts = 3;
    
    // Función para verificar si hay tooltips visibles
    function checkForVisibleTooltips() {
        const visibleTooltips = document.querySelectorAll('.tippy-box[data-state="visible"]');
        console.log(`Comprobando tooltips visibles: ${visibleTooltips.length} encontrados`);
        
        if (visibleTooltips.length === 0 && tooltipCheckAttempts < maxAttempts) {
            tooltipCheckAttempts++;
            console.log(`Intento ${tooltipCheckAttempts} de ${maxAttempts}: No se detectaron tooltips visibles`);
            
            // Intentar forzar la aparición de tooltips
            if (window.startGuideTooltips) {
                console.log('Intentando recuperar tooltips usando startGuideTooltips()');
                window.startGuideTooltips();
                
                // Programar otra verificación
                setTimeout(checkForVisibleTooltips, 1000);
            } else if (window.showGuideStep) {
                console.log('Intentando recuperar tooltips usando showGuideStep(0)');
                window.showGuideStep(0);
                
                // Programar otra verificación
                setTimeout(checkForVisibleTooltips, 1000);
            }
        } else if (visibleTooltips.length > 0) {
            console.log('¡Éxito! Tooltips visibles detectados');
        } else {
            console.log('Se alcanzó el máximo de intentos sin éxito');
            
            // Último intento: disparar manualmente el evento modalWelcomeClosed
            console.log('Intentando disparar manualmente el evento modalWelcomeClosed');
            document.dispatchEvent(new CustomEvent('modalWelcomeClosed'));
        }
    }
    
    // Escuchar al evento del modal cerrado para verificar tooltips
    document.addEventListener('modalWelcomeClosed', function() {
        console.log('Evento modalWelcomeClosed detectado por tooltip-auto-fixer');
        
        // Esperar un momento para que los tooltips tengan tiempo de aparecer
        setTimeout(function() {
            checkForVisibleTooltips();
        }, 1000);
    });
    
    // Botón para iniciar manualmente los tooltips
    const resetButton = document.getElementById('resetTooltips');
    if (resetButton) {
        resetButton.addEventListener('click', function() {
            console.log('Botón de reset presionado, iniciando tooltips manualmente');
            // Intentar iniciar los tooltips después de un pequeño retraso
            setTimeout(function() {
                if (window.startGuideTooltips) {
                    window.startGuideTooltips();
                }
            }, 500);
        });
    }
    
    // Si no hay modal o está oculto, verificar los tooltips después de un tiempo
    setTimeout(function() {
        const modalOverlay = document.querySelector('.modal-overlay');
        if (!modalOverlay || getComputedStyle(modalOverlay).display === 'none') {
            console.log('No se detectó modal, verificando tooltips directamente');
            checkForVisibleTooltips();
        }
    }, 2000);
});

// Añadir botón de ayuda para iniciar tooltips manualmente si falla todo lo demás
setTimeout(function() {
    // Verificar si hay tooltips visibles
    const visibleTooltips = document.querySelectorAll('.tippy-box[data-state="visible"]');
    if (visibleTooltips.length === 0) {
        console.log('No se detectaron tooltips después de 5 segundos, añadiendo botón de ayuda');
        
        // Crear botón de ayuda
        const helpButton = document.createElement('button');
        helpButton.textContent = 'Iniciar Guía de Ayuda';
        helpButton.style.position = 'fixed';
        helpButton.style.bottom = '20px';
        helpButton.style.right = '20px';
        helpButton.style.padding = '10px 15px';
        helpButton.style.backgroundColor = '#0077cc';
        helpButton.style.color = 'white';
        helpButton.style.border = 'none';
        helpButton.style.borderRadius = '5px';
        helpButton.style.cursor = 'pointer';
        helpButton.style.zIndex = '9999';
        
        helpButton.addEventListener('click', function() {
            if (window.startGuideTooltips) {
                window.startGuideTooltips();
            }
        });
        
        document.body.appendChild(helpButton);
    }
}, 5000);
