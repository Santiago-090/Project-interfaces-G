// Script de diagnóstico para solucionar problemas con tooltips
console.log('Tooltip Diagnostic Tool cargado');

(function() {
    // Crear panel de diagnóstico flotante
    const diagPanel = document.createElement('div');
    diagPanel.id = 'tooltip-diagnostic-panel';
    diagPanel.style.cssText = `
        position: fixed;
        bottom: 70px;
        right: 20px;
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 12px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 10000;
        max-width: 250px;
        display: none;
        font-family: monospace;
    `;
    document.body.appendChild(diagPanel);

    // Botones de herramientas
    const diagTools = document.createElement('div');
    diagTools.id = 'tooltip-diagnostic-tools';
    diagTools.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        z-index: 10000;
        display: flex;
        gap: 10px;
    `;
    document.body.appendChild(diagTools);

    // Botón para mostrar/ocultar panel de diagnóstico
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '🔍 Diagnosticar';
    toggleButton.style.cssText = `
        background-color: #333;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 14px;
    `;
    diagTools.appendChild(toggleButton);

    // Botón para forzar avance
    const forceButton = document.createElement('button');
    forceButton.textContent = '⚡ Forzar Avance';
    forceButton.style.cssText = `
        background-color: #ff5722;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 14px;
    `;
    diagTools.appendChild(forceButton);

    // Botón para reiniciar
    const resetButton = document.createElement('button');
    resetButton.textContent = '🔄 Reiniciar Tooltips';
    resetButton.style.cssText = `
        background-color: #0077cc;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 14px;
    `;
    diagTools.appendChild(resetButton);

    // Estado de visibilidad del panel
    let panelVisible = false;

    // Alternar la visibilidad del panel
    toggleButton.addEventListener('click', function() {
        panelVisible = !panelVisible;
        diagPanel.style.display = panelVisible ? 'block' : 'none';
        updateDiagnosticInfo();
    });

    // Función para forzar el avance
    forceButton.addEventListener('click', function() {
        console.log('Forzando avance manualmente...');
        if (window.manualAdvanceTooltip) {
            window.manualAdvanceTooltip();
        } else if (window.currentAdvanceFunction) {
            window.currentAdvanceFunction();
        } else {
            // Intento de última opción: buscar y hacer clic en el botón Siguiente
            const nextButton = document.querySelector('.guide-next-button');
            if (nextButton) {
                console.log('Haciendo clic en el botón Siguiente encontrado');
                nextButton.click();
            }
        }
        updateDiagnosticInfo();
    });

    // Función para reiniciar tooltips
    resetButton.addEventListener('click', function() {
        console.log('Reiniciando tooltips...');
        
        // Eliminar variables de sesión
        sessionStorage.removeItem('modalShown');
        sessionStorage.removeItem('tooltipGuideCompleted');
        
        // Intento de reinicio usando función expuesta
        if (window.resetModalState) {
            window.resetModalState();
        }
        
        // Reiniciar variables globales
        if (window.diagnosticarTooltips) {
            window.diagnosticarTooltips();
        }
        
        // Forzar un evento de reinicio
        const resetEvent = new CustomEvent('modalWelcomeClosed');
        document.dispatchEvent(resetEvent);
        
        updateDiagnosticInfo();
        
        // Indicar éxito
        const originalText = resetButton.textContent;
        resetButton.textContent = '✅ Reiniciado';
        setTimeout(() => {
            resetButton.textContent = originalText;
        }, 2000);
    });

    // Función para actualizar información de diagnóstico
    function updateDiagnosticInfo() {
        if (!panelVisible) return;
        
        // Recopilar información de diagnóstico
        const visibleTooltips = document.querySelectorAll('.tippy-box[data-state="visible"]');
        const currentStepText = document.querySelector('.tippy-box[data-state="visible"] .step-number');
        const nextButtons = document.querySelectorAll('.guide-next-button');
        
        // Crear HTML para el panel
        let infoHtml = `
            <h3 style="margin: 0 0 8px 0; font-size: 14px; border-bottom: 1px solid #555; padding-bottom: 5px;">Diagnóstico de Tooltips</h3>
            <div>Tooltips visibles: ${visibleTooltips.length}</div>
            <div>Paso actual: ${currentStepText ? currentStepText.textContent : 'ninguno'}</div>
            <div>Botones "Siguiente": ${nextButtons.length}</div>
            <div>currentStepIndex: ${window.currentStepIndexTooltip ? window.currentStepIndexTooltip() : 'N/A'}</div>
        `;
        
        // Si hay tooltips visibles, mostrar más información
        if (visibleTooltips.length > 0) {
            const tooltipContent = visibleTooltips[0].textContent;
            infoHtml += `
                <h4 style="margin: 8px 0 4px 0; font-size: 13px;">Contenido del tooltip:</h4>
                <div style="color: #aaa; font-size: 11px; max-height: 80px; overflow-y: auto;">${tooltipContent.substring(0, 100)}${tooltipContent.length > 100 ? '...' : ''}</div>
            `;
        }
        
        diagPanel.innerHTML = infoHtml;
    }

    // Actualizar información periódicamente
    setInterval(updateDiagnosticInfo, 1000);

    // Exponer funciones útiles en el ámbito global
    window.tooltip_diagnostics = {
        showPanel: () => {
            panelVisible = true;
            diagPanel.style.display = 'block';
            updateDiagnosticInfo();
        },
        hidePanel: () => {
            panelVisible = false;
            diagPanel.style.display = 'none';
        },
        forceAdvance: () => forceButton.click(),
        resetTooltips: () => resetButton.click()
    };

    console.log('Tooltip Diagnostic Tool: Use window.tooltip_diagnostics para acceder a las funciones de diagnóstico');
})();
