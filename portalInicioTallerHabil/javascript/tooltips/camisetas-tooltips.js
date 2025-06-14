document.addEventListener('DOMContentLoaded', function () {
  setupPageTooltips(
    [
      {
        element: '.icon-cart3',
        title: 'Volver al Inicio',
        text: 'Haz clic en este botón para volver al índice principal.',
        position: 'bottom',
        highlight: true
      },
      {
        element: '.icon-cart2',
        title: 'Contacto',
        text: 'Al hacer clic en este botón, podrás acceder a nuestras redes sociales y contactarnos directamente.',
        position: 'bottom',
        highlight: true
      },
      {
        element: '.icon-cart',
        title: 'Carrito de Compras',
        text: 'Haz clic en este botón para ver los productos que has seleccionado para tu compra.',
        position: 'bottom',
        highlight: true
      },
      {
        element: '.item:first-child .btn-add-cart',
        title: 'Añadir al Carrito',
        text: 'Haz clic en este botón para añadir este artículo a tu carrito y reservarlo para una posible compra.',
        position: 'top',
        highlight: true
      },
      {
        element: '.item:first-child .info-product',
        title: 'Información del Producto',
        text: 'Aquí puedes ver el nombre y precio del producto.',
        position: 'bottom',
        highlight: true
      }
    ],
    {
      title: 'Catálogo de Productos',
      content: `
                <p>Te damos la bienvenida al catálogo de camisetas, donde encontrarás todos los modelos disponibles para tu elección.</p>
                <p>¿Quieres conocer cómo navegar por esta sección?</p>
            `
    }
  );

  // Eventos para mostrar tooltips del carrito cuando se abre
  document.querySelector('.container-icon-cart')?.addEventListener('click', function () {
    setTimeout(() => {
      const cartTooltips = [
        {
          element: '.cart-product',
          title: 'Producto en Carrito',
          text: 'Aquí podrás ver una breve descripción de los productos seleccionados, incluyendo su cantidad y valor unitario.',
          position: 'right',
          highlight: true
        },
        {
          element: '.icon-close',
          title: 'Eliminar Producto',
          text: 'Este botón te permite eliminar cualquier producto del carrito de compras.',
          position: 'left',
          highlight: true
        },
        {
          element: '.total-pagar',
          title: 'Valor Total',
          text: 'En esta sección se muestra el valor total de los productos que has elegido.',
          position: 'top',
          highlight: true
        },
        {
          element: '.btn-comprar',
          title: 'Finalizar Compra',
          text: 'Haz clic en este botón para comenzar el proceso de finalización de tu compra.',
          position: 'top',
          highlight: true
        }
      ];

      // Mostrar tooltips uno por uno
      let currentIndex = 0;

      function showNextCartTooltip() {
        if (currentIndex >= cartTooltips.length) return;

        const tooltip = cartTooltips[currentIndex];
        const element = document.querySelector(tooltip.element);

        if (element) {
          const tempTooltip = document.createElement('div');
          tempTooltip.className = 'custom-tooltip tooltip-active';
          tempTooltip.innerHTML = `
            <div class="tooltip-arrow"></div>
            <div class="tooltip-content">
              <h4 class="tooltip-title">${tooltip.title}</h4>
              <p class="tooltip-text">${tooltip.text}</p>
              <div class="tooltip-buttons">
                <button class="tooltip-button next">Siguiente</button>
              </div>
            </div>
          `;

          document.getElementById('tooltip-container').appendChild(tempTooltip);

          const tooltipSystem = new TooltipSystem();
          tooltipSystem.positionTooltip(tempTooltip, element, tooltip.position);

          tempTooltip.querySelector('.next').addEventListener('click', () => {
            tempTooltip.remove();
            currentIndex++;
            showNextCartTooltip();
          });

          if (currentIndex === cartTooltips.length - 1) {
            tempTooltip.querySelector('.next').textContent = 'Finalizar';
          }
        } else {
          currentIndex++;
          showNextCartTooltip();
        }
      }

      showNextCartTooltip();
    }, 300);
  });

  // Evento para cuando se añade un producto al carrito
  document.querySelectorAll('.btn-add-cart').forEach((button) => {
    button.addEventListener('click', function () {
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
});
