document.addEventListener('DOMContentLoaded', function () {
  setupPageTooltips(
    [
      {
        element: '.icon-cart3',
        title: 'Regresar al inicio',
        text: 'Usa este botón para volver al menú de categorías.',
        position: 'bottom',
        highlight: true
      },
      {
        element: '.img',
        title: 'Imagen del Producto',
        text: 'Aquí puedes ver la imagen detallada del producto que has seleccionado.',
        position: 'right',
        highlight: true
      },
      {
        element: '.formulario__input',
        title: 'Cantidad de Productos',
        text: 'En este campo puedes seleccionar la cantidad de unidades que deseas adquirir.',
        position: 'bottom',
        highlight: true
      },
      {
        element: '.btn-add-cart',
        title: 'Añadir al Carrito',
        text: 'Haz clic en este botón para añadir este producto a tu carrito como opción de compra.',
        position: 'bottom',
        highlight: true
      },
      {
        element: '.container2',
        title: 'Descripción del Producto',
        text: 'Aquí encontrarás información detallada sobre las características y especificaciones del producto.',
        position: 'left',
        highlight: true
      }
    ],
    {
      title: 'Detalles del Producto',
      content: `
                <p>En esta sección encontrarás toda la información detallada del producto que te interesa.</p>
                <p>¿Te gustaría un recorrido por las opciones disponibles?</p>
            `
    }
  );

  // Evento para cuando se añade un producto al carrito desde la vista de detalles
  document.querySelector('.btn-add-cart')?.addEventListener('click', function () {
    setTimeout(() => {
      const tempTooltip = document.createElement('div');
      tempTooltip.className = 'custom-tooltip tooltip-active';
      tempTooltip.style.top = '50%';
      tempTooltip.style.left = '50%';
      tempTooltip.style.transform = 'translate(-50%, -50%)';
      tempTooltip.innerHTML = `
        <div class="tooltip-content">
          <h4 class="tooltip-title">¡Producto Añadido!</h4>
          <p class="tooltip-text">El producto ha sido añadido a tu carrito correctamente.</p>
          <div class="tooltip-buttons">
            <button class="tooltip-button next">Aceptar</button>
          </div>
        </div>
      `;

      document.getElementById('tooltip-container').appendChild(tempTooltip);

      tempTooltip.querySelector('.next').addEventListener('click', () => {
        tempTooltip.remove();
      });

      setTimeout(() => {
        tempTooltip.remove();
      }, 3000);
    }, 300);
  });
});
