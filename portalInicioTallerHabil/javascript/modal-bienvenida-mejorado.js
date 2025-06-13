// JavaScript para el modal de bienvenida a categorías
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, preparando modal de bienvenida');
    // Verificar si ya se mostró el modal en esta sesión
    if (!sessionStorage.getItem('modalShown')) {
        // Mostrar el modal al entrar a la página de categoría
        mostrarModalBienvenida();
        // Marcar como mostrado para esta sesión
        sessionStorage.setItem('modalShown', 'true');
    } else {
        console.log('Modal ya mostrado en esta sesión, disparando evento modalWelcomeClosed');
        // Disparar el evento para iniciar los tooltips si el modal no se muestra
        setTimeout(() => {
            const modalClosedEvent = new CustomEvent('modalWelcomeClosed');
            document.dispatchEvent(modalClosedEvent);
        }, 500);
    }
});

function mostrarModalBienvenida() {
    console.log('Mostrando modal de bienvenida');
    
    // Determinar qué categoría es basado en la URL actual
    const urlActual = window.location.pathname;
    let nombreCategoria = '';
    
    // Mapeo de URLs a nombres de categoría
    const categoriasMap = {
        'interfaz-camiseta': 'camisetas',
        'interfaz-pantalones': 'pantalones',
        'interfaz-gorras': 'gorras',
        'interfaz-accesorios': 'accesorios',
        'interfaz-perfumeria': 'perfumes'
    };
    
    // Buscar la categoría basada en la URL
    const categoriaEncontrada = Object.keys(categoriasMap).find(key => urlActual.includes(key));
    if (categoriaEncontrada) {
        nombreCategoria = categoriasMap[categoriaEncontrada];
        console.log(`Categoría detectada por URL: ${nombreCategoria}`);
    } else {
        // Si no se encuentra en la URL, intentar extraer del h3
        try {
            const elementosH3 = document.querySelectorAll('h3');
            for (let i = 0; i < elementosH3.length; i++) {
                const texto = elementosH3[i].textContent;
                if (texto.includes('Categoria')) {
                    const categoriaSimple = texto.split('/')[0].trim();
                    nombreCategoria = categoriaSimple.replace('Categoria ', '').toLowerCase();
                    console.log(`Categoría detectada por H3: ${nombreCategoria}`);
                    break;
                }
            }
            
            if (!nombreCategoria) {
                throw new Error('No se encontró ningún elemento H3 con texto de categoría');
            }
        } catch (e) {
            console.error('No se pudo determinar la categoría:', e);
            // En lugar de retornar, usar una categoría por defecto
            nombreCategoria = 'productos';
            console.log('Usando categoría por defecto:', nombreCategoria);
        }
    }
    
    // Verificar que el nombre de categoría sea válido y asegurarse de que no sea un elemento del carrito
    if (!nombreCategoria || nombreCategoria === 'Total:' || nombreCategoria === 'carrito') {
        console.error('Nombre de categoría no válido:', nombreCategoria);
        nombreCategoria = 'productos'; // Usar un valor por defecto
        console.log('Usando categoría genérica:', nombreCategoria);
    }
    
    // Crear elementos del modal
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    
    const modalTitle = document.createElement('h2');
    modalTitle.className = 'modal-title';
    modalTitle.textContent = `Bienvenido a ${nombreCategoria}`;
    
    const modalText = document.createElement('p');
    modalText.className = 'modal-text';
    modalText.textContent = `Te damos la bienvenida al catálogo de ${nombreCategoria}, donde encontrarás todos los modelos disponibles para tu elección.`;
    
    const modalButtons = document.createElement('div');
    modalButtons.className = 'modal-buttons';
      const cancelButton = document.createElement('button');
    cancelButton.className = 'modal-button cancel';
    cancelButton.textContent = 'Cancelar';    cancelButton.addEventListener('click', function() {
        cerrarModalConAnimacion(modalOverlay);
        // Dispara el evento para iniciar los tooltips (igual que el botón "Siguiente")
        setTimeout(() => {
            console.log('Cerrando modal (cancelar) y disparando evento modalWelcomeClosed');
            const modalClosedEvent = new CustomEvent('modalWelcomeClosed');
            document.dispatchEvent(modalClosedEvent);
            
            // Intentar iniciar los tooltips directamente como respaldo
            if (window.startGuideTooltips) {
                console.log('Intentando iniciar guía directamente desde el botón cancelar');
                window.startGuideTooltips();
            }
        }, 400);
    });
    
    const acceptButton = document.createElement('button');
    acceptButton.className = 'modal-button primary';
    acceptButton.textContent = 'Siguiente';    acceptButton.addEventListener('click', function() {
        cerrarModalConAnimacion(modalOverlay);
        // Dispara un evento personalizado para iniciar los tooltips secuenciales
        console.log('Cerrando modal y disparando evento modalWelcomeClosed');
        // Añadir un pequeño retraso para asegurar que el evento se dispara después de que el modal desaparezca
        setTimeout(() => {
            const modalClosedEvent = new CustomEvent('modalWelcomeClosed');
            document.dispatchEvent(modalClosedEvent);
            console.log('Evento modalWelcomeClosed disparado');
            
            // Intentar iniciar los tooltips directamente como respaldo
            if (window.startGuideTooltips) {
                console.log('Intentando iniciar guía directamente desde el botón Siguiente');
                window.startGuideTooltips();
            }
        }, 400);
    });
      // Cerrar al hacer clic fuera del modal
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            cerrarModalConAnimacion(modalOverlay);
            // Dispara un evento personalizado para iniciar los tooltips secuenciales
            console.log('Cerrando modal (click fuera) y disparando evento modalWelcomeClosed');
            setTimeout(() => {
                const modalClosedEvent = new CustomEvent('modalWelcomeClosed');
                document.dispatchEvent(modalClosedEvent);
                
                // Intentar iniciar los tooltips directamente como respaldo
                if (window.startGuideTooltips) {
                    console.log('Intentando iniciar guía directamente desde clic fuera');
                    window.startGuideTooltips();
                }
            }, 400);
        }
    });
    
    // Construir el modal
    modalButtons.appendChild(cancelButton);
    modalButtons.appendChild(acceptButton);
    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalText);
    modalContent.appendChild(modalButtons);
    modalOverlay.appendChild(modalContent);
    
    // Añadir a la página
    document.body.appendChild(modalOverlay);
    
    // Enfoque en el botón principal
    setTimeout(() => {
        acceptButton.focus();
    }, 100);
}

// Función para cerrar el modal con animación
function cerrarModalConAnimacion(modalElement) {
    modalElement.style.animation = 'fadeOut 0.3s forwards';
    
    // Definir la animación de salida
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // Eliminar el modal después de la animación
    setTimeout(() => {
        if (document.body.contains(modalElement)) {
            document.body.removeChild(modalElement);
            console.log('Modal removido del DOM');
        }
        document.head.removeChild(style);
    }, 300);
}

// Exponer una función pública para resetear el estado de los modales (útil para pruebas)
window.resetModalState = function() {
    sessionStorage.removeItem('modalShown');
    sessionStorage.removeItem('tooltipGuideCompleted');
    console.log('Estado de modales y guías reiniciado');
};
