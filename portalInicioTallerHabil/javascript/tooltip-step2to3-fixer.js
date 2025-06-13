// Script mejorado específicamente para solucionar el problema del tooltip paso 2 al paso 3
document.addEventListener('DOMContentLoaded', function() {
    console.log('Cargando solucionador específico para transición paso 2 -> paso 3');
    
    // Variables para detectar la secuencia problemática
    let lastStepSeen = null;
    let monitoringActive = false;
    let stuckCount = 0;
    let carritoBuscado = false;
    
    // Función para encontrar directamente el icono del carrito
    function encontrarIconoCarrito() {
        if (carritoBuscado) return null; // Solo intentar una vez
        
        carritoBuscado = true;
        console.log('Buscando el icono del carrito con varios selectores...');
        
        // Lista ampliada de selectores posibles para el carrito
        const selectores = [
            '.icon-cart',
            '.container-cart-icon .icon-cart',
            '.container-icon .icon-cart',
            'svg.icon-cart',
            '.container-icon svg',
            '[class*="icon-cart"]'
        ];
        
        // Probar cada selector
        for (const selector of selectores) {
            const elementos = document.querySelectorAll(selector);
            if (elementos.length > 0) {
                console.log(`¡Encontrado icono del carrito con el selector ${selector}!`);
                // Destacar el elemento encontrado visualmente
                const elemento = elementos[0];
                elemento.style.filter = 'drop-shadow(0 0 8px #ff5722)';
                elemento.style.animation = 'pulse-cart 1.5s infinite';
                return elemento;
            }
        }
        
        console.log('No se pudo encontrar el icono del carrito con ningún selector');
        return null;
    }
    
    // Función para verificar la transición problemática
    function checkCriticalTransition() {
        // Buscar tooltip visible
        const visibleTooltip = document.querySelector('.tippy-box[data-state="visible"]');
        if (!visibleTooltip) return;
        
        // Buscar el número de paso actual
        const stepNumber = visibleTooltip.querySelector('.step-number');
        if (!stepNumber) return;
        
        const currentStep = stepNumber.textContent;
        console.log(`Paso actual detectado: ${currentStep}, último paso visto: ${lastStepSeen}`);
        
        // Detectar si estamos atascados en el paso 2
        if (currentStep === '2') {
            if (lastStepSeen === '2') {
                stuckCount++;
                console.log(`Posiblemente atascado en paso 2 (contador: ${stuckCount})`);
                
                // Si estamos atascados por más de 3 verificaciones
                if (stuckCount >= 3) {
                    console.log('¡ATASCADO CONFIRMADO! Interviniendo en el paso 2->3');
                    stuckCount = 0; // Resetear contador
                    
                    // Buscar el icono del carrito
                    const iconoCarrito = encontrarIconoCarrito();
                    
                    // Intentar avanzar directamente
                    if (window.manualAdvanceTooltip) {
                        console.log('Forzando avance con manualAdvanceTooltip()');
                        window.manualAdvanceTooltip();
                    }
                    
                    // Método alternativo: forzar un click en botón siguiente
                    setTimeout(() => {
                        const siguienteBtn = document.querySelector('.guide-next-button');
                        if (siguienteBtn) {
                            console.log('Simulando click en botón siguiente');
                            siguienteBtn.click();
                        }
                    }, 500);
                    
                    // Mostrar botón de diagnóstico
                    if (window.tooltip_diagnostics) {
                        window.tooltip_diagnostics.showPanel();
                        console.log('Forzando avance manualmente...');
                        
                        setTimeout(() => {
                            window.tooltip_diagnostics.forceAdvance();
                        }, 1000);
                    }
                }
            }
        } else {
            // Si no estamos en el paso 2, resetear contador
            stuckCount = 0;
            
            // Si llegamos al paso 3 o 4, considerar que se ha solucionado el problema
            if (currentStep === '3' || currentStep === '4') {
                console.log(`¡ÉXITO! Avanzado del paso 2 al paso ${currentStep}`);
                monitoringActive = false;
                
                // Si llegamos al paso 4 (saltándonos el 3), mostrar mensaje informativo
                if (currentStep === '4' && lastStepSeen === '2') {
                    console.log('NOTA: Se saltó el paso 3 (carrito) pero la secuencia continúa correctamente');
                }
            }
        }
        
        // Guardar el paso actual para la próxima verificación
        lastStepSeen = currentStep;
    }
    
    // Monitorear los tooltips con mayor frecuencia (cada 500ms)
    const monitorInterval = setInterval(checkCriticalTransition, 500);
    
    // Interceptar clicks en el botón Siguiente del paso 2
    document.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('guide-next-button')) {
            // Verificar el paso actual
            const stepElement = event.target.closest('.guide-step-content');
            const stepNumber = stepElement ? stepElement.querySelector('.step-number') : null;
            
            if (stepNumber && stepNumber.textContent === '2') {
                console.log('¡ATENCIÓN! Click en botón Siguiente del paso 2 detectado');
                
                // Buscar el icono del carrito inmediatamente
                encontrarIconoCarrito();
                
                // Programar verificaciones para asegurar que avanza
                for (let i = 1; i <= 6; i++) {
                    setTimeout(() => {
                        const currentStepElem = document.querySelector('.tippy-box[data-state="visible"] .step-number');
                        const currentStep = currentStepElem ? currentStepElem.textContent : 'ninguno';
                        console.log(`Verificación ${i}: Paso actual = ${currentStep}`);
                        
                        // Si después de 1 segundo seguimos en el paso 2, intentar soluciones
                        if (i >= 2 && currentStep === '2') {
                            console.log(`Todavía en paso 2 después de ${i*300}ms, aplicando solución #${i}`);
                            
                            if (i === 2) {
                                // Primera solución: avance manual
                                if (window.manualAdvanceTooltip) {
                                    window.manualAdvanceTooltip();
                                }
                            } else if (i === 4) {
                                // Segunda solución: forzar con diagnóstico
                                if (window.tooltip_diagnostics) {
                                    window.tooltip_diagnostics.forceAdvance();
                                }
                            } else if (i === 6) {
                                // Tercera solución: resetear la secuencia
                                console.log('SOLUCIÓN EXTREMA: Reiniciando secuencia de tooltips');
                                if (window.tooltip_diagnostics) {
                                    window.tooltip_diagnostics.resetTooltips();
                                }
                            }
                        }
                    }, i * 300); // Verificar cada 300ms
                }
            }
        }
    });
    
    // Detener el monitoreo después de 3 minutos
    setTimeout(() => {
        clearInterval(monitorInterval);
        console.log('Monitoreo de transición crítica finalizado (tiempo máximo alcanzado)');
    }, 3 * 60 * 1000);
});
