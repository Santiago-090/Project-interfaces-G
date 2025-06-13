// Script para corregir problemas específicos en los tooltips
document.addEventListener('DOMContentLoaded', function() {
    console.log('Tooltips-fixer (IMPROVED): Aplicando correcciones para los tooltips');
    
    // Crear un botón de emergencia para forzar el avance
    const emergencyButton = document.createElement('button');
    emergencyButton.innerHTML = '⚡ Siguiente Tooltip';
    emergencyButton.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background-color: #ff5722;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 10000;
        font-weight: bold;
        font-size: 16px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        display: none;
    `;
    document.body.appendChild(emergencyButton);
    
    // Variable para rastrear cuándo mostrar el botón de emergencia
    let tooltipStuckDetected = false;
    let lastTooltipStep = null;
    let tooltipNotChangingCount = 0;
    
    // Mostrar el botón de emergencia después de detectar problemas
    const checkTooltipProgress = () => {
        const visibleTooltip = document.querySelector('.tippy-box[data-state="visible"]');
        const currentStepText = document.querySelector('.tippy-box[data-state="visible"] .step-number');
        const currentStep = currentStepText ? currentStepText.textContent : null;
        
        if (currentStep) {
            if (currentStep === lastTooltipStep) {
                tooltipNotChangingCount++;
                console.log(`Tooltip en paso ${currentStep} no ha cambiado por ${tooltipNotChangingCount} checks`);
                
                // Si el tooltip no ha cambiado después de 3 verificaciones, mostrar botón de emergencia
                if (tooltipNotChangingCount >= 3) {
                    emergencyButton.style.display = 'block';
                    tooltipStuckDetected = true;
                }
            } else {
                // Se detectó cambio, reiniciar contador
                tooltipNotChangingCount = 0;
                lastTooltipStep = currentStep;
                
                // Si ya no estamos atascados, ocultar el botón de emergencia
                if (tooltipStuckDetected) {
                    emergencyButton.style.display = 'none';
                    tooltipStuckDetected = false;
                }
            }
        }
    };
    
    // Verificar el progreso cada segundo
    setInterval(checkTooltipProgress, 1000);
    
    // Al hacer clic en el botón de emergencia, forzar el avance
    emergencyButton.addEventListener('click', function() {
        console.log('Tooltips-fixer: Botón de emergencia presionado, forzando avance');
        if (window.manualAdvanceTooltip) {
            window.manualAdvanceTooltip();
        } else if (window.currentAdvanceFunction) {
            window.currentAdvanceFunction();
        }
        
        // Ocultar el botón después de usarlo
        setTimeout(() => {
            emergencyButton.style.display = 'none';
        }, 500);
    });
    
    // 1. Corregir el problema específico de pasos de tooltips
    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('guide-next-button')) {
            console.log('Tooltips-fixer: Click detectado en botón Siguiente');
            
            // Obtener información sobre el paso actual
            const stepElement = event.target.closest('.guide-step-content');
            const stepNumber = stepElement ? stepElement.querySelector('.step-number')?.textContent : null;
            
            console.log(`Click en botón Siguiente del paso ${stepNumber}`);
            
            // Prestar especial atención al paso 2, que es donde se atasca
            if (stepNumber === '2') {
                console.log('¡Paso crítico detectado! (paso 2 -> 3)');
            }
            
            // Primera intervención inmediata - intentar ejecutar la función de avance directamente
            if (window.currentAdvanceFunction) {
                try {
                    console.log('Tooltips-fixer: Ejecutando función de avance directamente');
                    window.currentAdvanceFunction();
                } catch (error) {
                    console.error('Tooltips-fixer: Error al ejecutar función de avance:', error);
                }
            }
            
            // Segunda intervención después de un tiempo
            setTimeout(() => {
                // Verificar si hay un tooltip visible (lo que indicaría que el avance funcionó)
                const visibleTooltips = document.querySelectorAll('.tippy-box[data-state="visible"]');
                const currentStepText = document.querySelector('.tippy-box[data-state="visible"] .step-number');
                console.log('Tooltips-fixer: Tooltips visibles:', visibleTooltips.length, 'Paso actual:', currentStepText?.textContent);
                
                if (visibleTooltips.length === 0 || window.lastStepNumber === currentStepText?.textContent) {
                    console.log('Tooltips-fixer: No se detectó avance en la guía, forzando el avance');
                    // Acceder directamente a la función showGuideStep si está disponible
                    if (window.manualAdvanceTooltip) {
                        window.manualAdvanceTooltip();
                    }
                } else if (currentStepText) {
                    // Guardar el número de paso actual para comparar después
                    window.lastStepNumber = currentStepText.textContent;
                }
            }, 800); // Aumentado a 800ms para dar más tiempo al procesamiento
        }
    });
    
    // 2. Mejora el z-index de los tooltips para asegurar visibilidad
    const tooltipStyle = document.createElement('style');
    tooltipStyle.textContent = `
        .tippy-box {
            z-index: 9999 !important;
        }
        
        .tippy-box[data-theme~='guide-step'] {
            z-index: 9999 !important;
        }
        
        .guide-next-button {
            cursor: pointer !important;
            background-color: #0077cc !important;
            color: white !important;
            border-radius: 4px !important;
            padding: 6px 12px !important;
            border: none !important;
            font-weight: bold !important;
            transition: background-color 0.2s ease-in-out !important;
        }
        
        .guide-next-button:hover {
            background-color: #005fa3 !important;
        }
    `;
    document.head.appendChild(tooltipStyle);
});

// Esta función puede ser llamada desde la consola para diagnosticar problemas
function diagnosticarTooltips() {
    console.log('--- Diagnóstico de Tooltips ---');
    console.log('Tooltips activos:', document.querySelectorAll('.tippy-box').length);
    console.log('Tooltips visibles:', document.querySelectorAll('.tippy-box[data-state="visible"]').length);
    console.log('Botones "Siguiente" en el DOM:', document.querySelectorAll('.guide-next-button').length);
    
    // Forzar avance de tooltips
    console.log('Intentando forzar avance de tooltips...');
    setTimeout(() => {
        const event = new CustomEvent('modalWelcomeClosed');
        document.dispatchEvent(event);
        console.log('Evento modalWelcomeClosed disparado manualmente');
    }, 500);
    
    return "Diagnóstico completado. Revisa la consola para ver los resultados.";
}

// Exponer la función para uso global
window.diagnosticarTooltips = diagnosticarTooltips;
