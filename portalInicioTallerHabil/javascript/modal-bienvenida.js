// JavaScript para el modal de bienvenida a categorías
document.addEventListener('DOMContentLoaded', function() {
    // Mostrar el modal inmediatamente al entrar a la página de categoría
    // No usamos sessionStorage para asegurar que siempre se muestre
    mostrarModalBienvenida();
});

function mostrarModalBienvenida() {
    // Obtener información de la categoría actual
    const tituloCategoria = document.querySelector('h3').textContent;
    const categoriaSimple = tituloCategoria.split('/')[0].trim();
    const nombreCategoria = categoriaSimple.replace('Categoria ', '');
    
    // Verificar que el nombre de categoría sea válido
    if (!nombreCategoria || nombreCategoria === 'Total:') {
        console.error('Nombre de categoría no válido:', nombreCategoria);
        return; // No mostrar el modal si la categoría no es válida
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
    cancelButton.textContent = 'Cancelar';
    cancelButton.addEventListener('click', function() {
        cerrarModalConAnimacion(modalOverlay);
        setTimeout(() => {
            window.history.back();
        }, 300);
    });
    
    const acceptButton = document.createElement('button');
    acceptButton.className = 'modal-button primary';
    acceptButton.textContent = 'Siguiente';
    acceptButton.addEventListener('click', function() {
        cerrarModalConAnimacion(modalOverlay);
    });
    
    // Cerrar al hacer clic fuera del modal
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            cerrarModalConAnimacion(modalOverlay);
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
        }
        document.head.removeChild(style);
    }, 300);
}
