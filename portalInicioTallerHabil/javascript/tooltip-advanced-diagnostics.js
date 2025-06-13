// Herramienta de diagnóstico avanzado para tooltips
console.log('Inicializando herramienta de diagnóstico avanzado para tooltips');

// Crear una función de diagnóstico completo
window.runTooltipDiagnostics = function() {
    console.group('==== DIAGNÓSTICO DE TOOLTIPS ====');
    
    // 1. Estado general
    console.log('---- Estado del sistema ----');
    if (window.currentStepIndexTooltip) {
        console.log('Paso actual:', window.currentStepIndexTooltip());
    } else {
        console.log('Paso actual: No disponible (función no encontrada)');
    }
    
    // 2. Verificar presencia de elementos del DOM para tooltips
    console.log('---- Verificando elementos en el DOM ----');
    const selectors = [
        '.icon-cart', '.icon-cart2', '.icon-cart3', 
        '.btn-add-cart', '.btn-detalles', 
        '.container-cart-products', '.cart-delete',
        '.total-pagar', '.finalizar-compra'
    ];
    
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        const visibleCount = Array.from(elements).filter(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
        }).length;
        
        console.log(`${selector}: ${elements.length} elementos (${visibleCount} visibles)`);
    });
    
    // 3. Verificar tooltips existentes
    console.log('---- Verificando tooltips existentes ----');
    const tooltips = document.querySelectorAll('.tippy-box');
    console.log(`Tooltips en el DOM: ${tooltips.length}`);
    
    // Contar tooltips por estado
    const visibleTooltips = document.querySelectorAll('.tippy-box[data-state="visible"]');
    console.log(`Tooltips visibles: ${visibleTooltips.length}`);
    
    // 4. Verificar si Tippy.js está cargado correctamente
    console.log('---- Verificando Tippy.js ----');
    if (typeof tippy !== 'undefined') {
        console.log('✅ Tippy.js está cargado correctamente');
    } else {
        console.log('❌ ERROR: Tippy.js no está cargado');
    }
    
    // 5. Verificar funciones esenciales para tooltips
    console.log('---- Verificando funciones disponibles ----');
    const requiredFunctions = [
        'startGuideTooltips',
        'manualAdvanceTooltip',
        'showGuideStep',
        'currentStepIndexTooltip'
    ];
    
    requiredFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function' || 
            (typeof window[funcName] !== 'undefined' && typeof window[funcName]() !== 'undefined')) {
            console.log(`✅ ${funcName} está disponible`);
        } else {
            console.log(`❌ ${funcName} no está disponible`);
        }
    });
    
    // 6. Modal de bienvenida
    console.log('---- Verificando modal de bienvenida ----');
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        console.log('Modal de bienvenida encontrado en el DOM');
        const style = window.getComputedStyle(modalOverlay);
        console.log(`Estado del modal: ${style.display === 'none' ? 'oculto' : 'visible'}`);
    } else {
        console.log('Modal de bienvenida no encontrado en el DOM');
    }
    
    console.groupEnd();
    
    // 7. Proporcionar soluciones sugeridas
    console.group('==== SOLUCIONES SUGERIDAS ====');
    
    if (visibleTooltips.length === 0) {
        console.log('1. Prueba reiniciando la guía manualmente:');
        console.log('   - Presiona el botón "Resetear Guías"');
        console.log('   - O ejecuta window.startGuideTooltips() en la consola');
        
        console.log('\n2. Si los pasos no aparecen después de cerrar el modal:');
        console.log('   - Intenta ejecutar manualmente: document.dispatchEvent(new CustomEvent("modalWelcomeClosed"))');
    }
    
    console.log('\nPuedes usar el botón auxiliar "Iniciar Guía de Ayuda" que aparece después de 5 segundos');
    console.log('si no se muestra ningún tooltip automáticamente.');
    
    console.groupEnd();
    
    return "Diagnóstico completado. Ver consola para detalles.";
};

// Añadir comandos de solución rápida
window.fixTooltipIssues = function() {
    console.log('Intentando solucionar problemas de tooltips...');
    
    // 1. Asegurarnos que no haya tooltip activo bloqueando
    const visibleTooltips = document.querySelectorAll('.tippy-box[data-state="visible"]');
    visibleTooltips.forEach(tooltip => {
        const instance = tooltip._tippy;
        if (instance) instance.hide();
    });
    
    // 2. Resetear variables globales si están accesibles
    if (window.resetTooltipState) {
        window.resetTooltipState();
    } else {
        console.log('Función resetTooltipState no disponible, intentando método alternativo');
        
        // 3. Intentar iniciar la guía
        if (window.startGuideTooltips) {
            window.startGuideTooltips();
        }
    }
    
    return "Corrección aplicada. Ver consola para detalles.";
};

// Ejecutar diagnóstico de forma automática al cargar
setTimeout(function() {
    // Verificar si hay problemas con los tooltips
    const visibleTooltips = document.querySelectorAll('.tippy-box[data-state="visible"]');
    if (visibleTooltips.length === 0) {
        console.log('No se detectaron tooltips después de 3 segundos, ejecutando diagnóstico automático');
        window.runTooltipDiagnostics();
    }
}, 3000);
