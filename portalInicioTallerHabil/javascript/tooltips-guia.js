document.addEventListener('DOMContentLoaded', () => {
  let currentTooltipIndex = 0;
  let tooltipsShown = false;
  let cartWasOriginallyOpen = false;
  let activeTooltip = null;
  let hasCartItems = false;

  // Función para prevenir que el carrito se abra/cierre al hacer clic durante el recorrido de tooltips
  function preventCartToggle(e) {
    if (tooltipsShown) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  // Funciones para verificar y monitorear el estado del carrito
  function checkCartHasItems() {
    try {
      const savedProducts = localStorage.getItem('allProducts');
      if (savedProducts) {
        const products = JSON.parse(savedProducts);
        if (Array.isArray(products) && products.length > 0) {
          return true;
        }
      }

      const productosEnCarrito = localStorage.getItem('productosEnCarrito');
      if (productosEnCarrito && productosEnCarrito !== '0' && productosEnCarrito !== '[]') {
        return true;
      }
    } catch (e) {
      console.error('Error checking localStorage cart items', e);
    }

    try {
      if (typeof window.allProducts !== 'undefined' && window.allProducts.length > 0) {
        return true;
      }
    } catch (e) {
      console.error('Error checking global allProducts', e);
    }

    const cartItems = document.querySelectorAll('.cart-product');
    const cartEmpty = document.querySelector('.cart-empty');

    if (cartItems.length > 0 && (cartEmpty === null || cartEmpty.classList.contains('hidden'))) {
      return true;
    }

    const countProducts = document.querySelector('#contador-productos');
    if (countProducts && parseInt(countProducts.textContent) > 0) {
      return true;
    }

    return false;
  }

  // Monitorear cambios en el carrito
  function setupCartMonitoring() {
    hasCartItems = checkCartHasItems();
    updateBodyCartClass(hasCartItems);

    const addButtons = document.querySelectorAll('.btn-add-cart');
    addButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setTimeout(() => {
          hasCartItems = true;
          updateBodyCartClass(true);
        }, 100);
      });
    });

    // Monitorear cambios en el localStorage (por si se actualiza desde otra pestaña)
    window.addEventListener('storage', (event) => {
      if (event.key === 'allProducts' || event.key === 'productosEnCarrito') {
        setTimeout(() => {
          hasCartItems = checkCartHasItems();
          updateBodyCartClass(hasCartItems);
        }, 100);
      }
    });

    setInterval(() => {
      const currentCartState = checkCartHasItems();
      if (currentCartState !== hasCartItems) {
        hasCartItems = currentCartState;
        updateBodyCartClass(hasCartItems);
      }
    }, 2000);
  }

  // Actualizar la clase del body según el estado del carrito
  function updateBodyCartClass(hasItems) {
    if (hasItems) {
      document.body.classList.add('cart-has-items');
    } else {
      document.body.classList.remove('cart-has-items');
    }
  }

  setupCartMonitoring();

  window.addEventListener('resize', () => {
    if (activeTooltip) {
      const tooltipId = parseInt(activeTooltip.dataset.tooltipId);
      if (!isNaN(tooltipId) && tooltipId < tooltips.length) {
        const targetElementSelector = tooltips[tooltipId].element;
        const targetElement = document.querySelector(targetElementSelector);
        if (targetElement) {
          positionTooltip(activeTooltip, targetElement, tooltips[tooltipId].position);
        }
      }
    }
  });

  // Obtener la categoría de la página actual
  const pageTitle = document.title;
  const h3Category = document.querySelector('h3')?.textContent || '';
  let category = '';

  if (h3Category.includes('Categoria')) {
    category = h3Category.split('/')[0].replace('Categoria', '').trim();
  } else if (pageTitle.includes('Tienda')) {
    const url = window.location.pathname;
    if (url.includes('camiseta')) {
      category = 'Camisetas';
    } else if (url.includes('pantalones')) {
      category = 'Pantalones';
    } else if (url.includes('gorras')) {
      category = 'Gorras';
    } else if (url.includes('accesorios')) {
      category = 'Accesorios';
    } else if (url.includes('perfumeria')) {
      category = 'Perfumes';
    }
  }

  function getTooltipsConfiguration() {
    // Tooltips básicos que siempre se mostrarán
    const baseTooltips = [
      {
        message: `Te damos la bienvenida al catálogo de ${category}, donde encontrarás todos los modelos disponibles para tu elección.`,
        element: 'body',
        position: 'center',
        type: 'modal'
      },
      {
        message: 'Haz clic en este botón para volver al índice principal.',
        element: '.icon-cart3',
        position: 'bottom'
      },
      {
        message:
          'Al hacer clic en este botón, podrás acceder a nuestras redes sociales y contactarnos directamente.',
        element: '.icon-cart2',
        position: 'bottom'
      },
      {
        message:
          'Haz clic en este botón para ver los productos que has seleccionado para tu compra.',
        element: '.icon-cart',
        position: 'bottom'
      },
      {
        message:
          'Haz clic en este botón para añadir este artículo a tu carrito y reservarlo para una posible compra.',
        element: '.btn-add-cart',
        position: 'bottom'
      },
      {
        message: 'Haz clic aquí para ver más detalles y especificaciones del producto.',
        element: '.btn-detalles',
        position: 'bottom'
      }
    ];

    // Tooltips relacionados con el carrito que solo se mostrarán si hay elementos en él
    const cartTooltips = [
      {
        message:
          'Aquí podrás ver una breve descripción de los productos seleccionados, incluyendo su cantidad y valor unitario.',
        element: '.container-cart-products',
        position: 'right',
        requiresCart: true
      },
      {
        message: 'Este botón te permite eliminar cualquier producto del carrito de compras.',
        element: '.icon-close',
        position: 'right',
        requiresCart: true
      },
      {
        message: 'En esta sección se muestra el valor total de los productos que has elegido.',
        element: '.cart-total',
        position: 'right',
        requiresCart: true
      },
      {
        message: 'Haz clic en este botón para comenzar el proceso de finalización de tu compra.',
        element: '.finalizar-compra',
        position: 'right',
        requiresCart: true
      }
    ];

    const hasItems = checkCartHasItems();

    hasCartItems = hasItems;
    updateBodyCartClass(hasItems);

    if (!hasItems) {
      console.log('Carrito vacío - mostrando tooltips básicos');
      return baseTooltips;
    }

    console.log('Carrito con elementos - mostrando tooltips completos');
    return [...baseTooltips.slice(0, 4), ...cartTooltips, ...baseTooltips.slice(4)];
  }

  // Obtener los tooltips iniciales
  let tooltips = getTooltipsConfiguration();
  function showWelcomeModal() {
    const modal = document.createElement('div');
    modal.className = 'welcome-modal product-modal';

    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    const welcomeMessage = document.createElement('h2');
    welcomeMessage.textContent = `Bienvenido a ${category}`;

    const welcomeDescription = document.createElement('p');
    welcomeDescription.textContent = tooltips[0].message;

    modalContent.appendChild(welcomeMessage);
    modalContent.appendChild(welcomeDescription);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'modal-button-container';

    const nextButton = document.createElement('button');
    nextButton.className = 'modal-button';
    nextButton.textContent = 'Siguiente';

    const cancelButton = document.createElement('button');
    cancelButton.className = 'modal-button modal-button-cancel';
    cancelButton.textContent = 'Cancelar';

    buttonContainer.appendChild(cancelButton);
    buttonContainer.appendChild(nextButton);

    modalContent.appendChild(buttonContainer);
    modal.appendChild(modalContent);

    document.body.appendChild(modal);
    nextButton.addEventListener('click', () => {
      modal.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(modal);
        showNextTooltip();
      }, 300);
    });

    // Evento para el botón cancelar
    cancelButton.addEventListener('click', () => {
      modal.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(modal);
        finishGuide();
      }, 300);
    });
  }

  // Función para mostrar tooltip
  function showTooltip(tooltipInfo, index) {
    // Seleccionar el elemento objetivo
    const targetElement = document.querySelector(tooltipInfo.element);
    if (!targetElement && tooltipInfo.type !== 'modal') {
      console.log(`Elemento no encontrado: ${tooltipInfo.element}`);
      currentTooltipIndex++;
      if (currentTooltipIndex < tooltips.length) {
        showNextTooltip();
      }
      return;
    }

    const isTouchDevice =
      window.matchMedia('(pointer: coarse)').matches || window.innerWidth <= 768;

    document.body.classList.add('tooltip-active');

    const tooltip = document.createElement('div');
    tooltip.className = 'guide-tooltip';
    tooltip.dataset.tooltipId = index;

    if (isTouchDevice) {
      tooltip.classList.add('touch-device');
    }

    activeTooltip = tooltip;

    if (
      ['.container-cart-products', '.icon-close', '.cart-total', '.finalizar-compra'].includes(
        tooltipInfo.element
      )
    ) {
      tooltip.classList.add('cart-related-tooltip');
    }

    const tooltipContent = document.createElement('div');
    tooltipContent.className = 'tooltip-content';

    const message = document.createElement('p');
    const messageText = tooltipInfo.message;

    if (messageText.length > 100) {
      const sentences = messageText.split('. ');
      if (sentences.length > 1) {
        message.textContent = sentences[0] + '.';
        const additionalMessage = document.createElement('p');
        additionalMessage.textContent = sentences.slice(1).join('. ');
        tooltipContent.appendChild(message);
        tooltipContent.appendChild(additionalMessage);
      } else {
        message.textContent = messageText;
        tooltipContent.appendChild(message);
      }
    } else {
      message.textContent = messageText;
      tooltipContent.appendChild(message);
    }

    // Botones de navegación
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'tooltip-buttons';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancelar';
    cancelButton.className = 'tooltip-button cancel-button';
    cancelButton.addEventListener('click', finishGuide);
    buttonsContainer.appendChild(cancelButton);

    if (index > 1) {
      const prevButton = document.createElement('button');
      prevButton.textContent = 'Anterior';
      prevButton.className = 'tooltip-button prev-button';
      prevButton.addEventListener('click', showPrevTooltip);
      buttonsContainer.appendChild(prevButton);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = index === tooltips.length - 1 ? 'Finalizar' : 'Siguiente';
    nextButton.className = 'tooltip-button next-button';
    nextButton.addEventListener('click', showNextTooltip);
    buttonsContainer.appendChild(nextButton);

    tooltipContent.appendChild(buttonsContainer);
    tooltip.appendChild(tooltipContent);

    document.body.appendChild(tooltip);

    // Posicionar el tooltip
    positionTooltip(tooltip, targetElement, tooltipInfo.position);
    if (targetElement && tooltipInfo.type !== 'modal') {
      targetElement.classList.add('highlight-element');

      const cartProducts = document.querySelector('.container-cart-products');
      if (cartProducts) {
        if (tooltipInfo.element === '.icon-cart') {
          cartWasOriginallyOpen = !cartProducts.classList.contains('hidden-cart');

          const cartIcon = document.querySelector('.container-cart-icon');
          if (cartIcon) {
            cartIcon.setAttribute('data-tooltip-active', 'true');
            cartIcon.addEventListener('click', preventCartToggle);
          }
        } else if (
          tooltipInfo.element === '.container-cart-products' ||
          tooltipInfo.element === '.icon-close' ||
          tooltipInfo.element === '.cart-total' ||
          tooltipInfo.element === '.finalizar-compra'
        ) {
          cartWasOriginallyOpen = !cartProducts.classList.contains('hidden-cart');
          if (cartProducts.classList.contains('hidden-cart')) {
            cartProducts.classList.remove('hidden-cart');
          }

          if (tooltipInfo.position === 'right') {
            document.documentElement.style.setProperty('--tooltip-cart-z-index', '1070');
          }
        }
      }
    }
  }

  // Función para posicionar el tooltip
  function positionTooltip(tooltip, targetElement, position) {
    if (!targetElement) return;

    const rect = targetElement.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const windowWidth = window.innerWidth;

    tooltip.classList.add(`position-${position}`);
    tooltip.classList.add('no-scroll');

    const isNavbarElement = rect.top < 100;
    const isCartIcon = targetElement.classList.contains('icon-cart');
    const isDetallesBtn = targetElement.classList.contains('btn-detalles');
    const isCartElement = targetElement.closest('.container-cart-products') !== null;
    const isMobile = windowWidth <= 768;
    const isTablet = windowWidth > 768 && windowWidth <= 1024;

    switch (position) {
      case 'top':
        // Ajuste especial para botón de detalles
        if (isDetallesBtn) {
          tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
          tooltip.style.top = `${rect.top - tooltipRect.height - 15}px`;

          // Asegurar que no se salga de los límites de la pantalla
          const tooltipLeft = rect.left + rect.width / 2 - tooltipRect.width / 2;
          if (tooltipLeft < 10) {
            tooltip.style.left = '10px';
            const arrowOffset = rect.left + rect.width / 2 - 10;
            const percentOffset = (arrowOffset / tooltipRect.width) * 100;
            tooltip.classList.add('arrow-offset');
            tooltip.style.setProperty(
              '--arrow-offset',
              `${Math.min(Math.max(percentOffset, 15), 85)}%`
            );
          }

          // En dispositivos móviles, asegurar que hay espacio suficiente arriba
          if (isMobile && rect.top < tooltipRect.height + 30) {
            tooltip.classList.remove('position-top');
            tooltip.classList.add('position-bottom');
            tooltip.style.top = `${rect.bottom + 15}px`;
          }
        } else {
          tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
          tooltip.style.top = `${rect.top - tooltipRect.height - 10}px`;
        }
        break;

      case 'bottom':
        if (isNavbarElement) {
          if (
            isCartIcon ||
            targetElement.classList.contains('icon-cart2') ||
            targetElement.classList.contains('icon-cart3')
          ) {
            const offsetLeft = rect.left + rect.width / 2 - tooltipRect.width / 2;
            tooltip.style.left = `${Math.max(offsetLeft, 10)}px`;
            tooltip.style.top = `${rect.bottom + 5}px`;

            const arrowOffset = rect.left + rect.width / 2 - offsetLeft;
            const percentOffset = (arrowOffset / tooltipRect.width) * 100;

            tooltip.classList.add('arrow-offset');
            tooltip.style.setProperty(
              '--arrow-offset',
              `${Math.min(Math.max(percentOffset, 15), 85)}%`
            );

            if (isMobile) {
              tooltip.style.top = `${rect.bottom + 10}px`;
              if (offsetLeft + tooltipRect.width > windowWidth - 10) {
                tooltip.style.left = `${windowWidth - tooltipRect.width - 10}px`;
              }
            }
          } else {
            tooltip.style.left = `${Math.max(
              rect.left + rect.width / 2 - tooltipRect.width / 2,
              10
            )}px`;
            tooltip.style.top = `${rect.bottom + 5}px`;
          }
        } else {
          tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
          tooltip.style.top = `${rect.bottom + 10}px`;
        }
        break;

      case 'left':
        tooltip.style.left = `${rect.left - tooltipRect.width - 10}px`;
        tooltip.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;

        if (isMobile && rect.left < tooltipRect.width + 20) {
          tooltip.classList.remove('position-left');
          tooltip.classList.add('position-bottom');
          tooltip.style.left = `${rect.left}px`;
          tooltip.style.top = `${rect.bottom + 10}px`;
        }
        break;

      case 'right':
        // Verificar si es un elemento del carrito
        if (isCartElement) {
          if (isMobile) {
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.top = `${rect.top - tooltipRect.height - 15}px`;
            tooltip.classList.remove('position-right');
            tooltip.classList.add('position-top');
          } else {
            tooltip.style.left = 'auto';
            tooltip.style.right = isMobile ? '280px' : isTablet ? '290px' : '320px';
            tooltip.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;
          }
        } else {
          tooltip.style.left = `${rect.right + 10}px`;
          tooltip.style.top = `${rect.top + rect.height / 2 - tooltipRect.height / 2}px`;

          if (rect.right + tooltipRect.width + 10 > windowWidth) {
            tooltip.classList.remove('position-right');
            tooltip.classList.add('position-bottom');
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltipRect.width / 2}px`;
            tooltip.style.top = `${rect.bottom + 10}px`;
          }
        }
        break;

      case 'center':
        tooltip.style.left = '50%';
        tooltip.style.top = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
        break;
    }

    // Ajustar si se sale de la ventana
    const tooltipRect2 = tooltip.getBoundingClientRect();
    if (tooltipRect2.left < 0) {
      tooltip.style.left = '10px';
      if (position === 'bottom' || position === 'top') {
        const originalLeftPos = rect.left + rect.width / 2;
        const adjustedArrowPos = originalLeftPos - 10;
        const percentPos = (adjustedArrowPos / tooltipRect2.width) * 100;
        tooltip.classList.add('arrow-offset');
        tooltip.style.setProperty('--arrow-offset', `${Math.min(Math.max(percentPos, 15), 85)}%`);
      }
    } else if (tooltipRect2.right > window.innerWidth) {
      tooltip.style.left = `${window.innerWidth - tooltipRect2.width - 10}px`;
      if (position === 'bottom' || position === 'top') {
        const originalLeftPos = rect.left + rect.width / 2;
        const adjustedLeftPos = window.innerWidth - tooltipRect2.width - 10;
        const adjustedArrowPos = originalLeftPos - adjustedLeftPos;
        const percentPos = (adjustedArrowPos / tooltipRect2.width) * 100;
        tooltip.classList.add('arrow-offset');
        tooltip.style.setProperty('--arrow-offset', `${Math.min(Math.max(percentPos, 15), 85)}%`);
      }
    }

    // Ajustes verticales
    if (tooltipRect2.top < 0) {
      if (position === 'top') {
        tooltip.classList.remove('position-top');
        tooltip.classList.add('position-bottom');
        tooltip.style.top = `${rect.bottom + 10}px`;
      } else {
        tooltip.style.top = '10px';
      }
    } else if (tooltipRect2.bottom > window.innerHeight) {
      if (position === 'bottom') {
        tooltip.classList.remove('position-bottom');
        tooltip.classList.add('position-top');
        tooltip.style.top = `${rect.top - tooltipRect2.height - 10}px`;
      } else {
        tooltip.style.top = `${window.innerHeight - tooltipRect2.height - 10}px`;
      }
    }
  } // Función para mostrar el siguiente tooltip
  function showNextTooltip() {
    const cartProducts = document.querySelector('.container-cart-products');
    const currentElement = document.querySelector('.highlight-element');

    // Si estamos saliendo del tooltip del carrito o elementos dentro del carrito, manejar su estado
    if (currentElement) {
      if (currentElement.classList.contains('icon-cart') && !cartWasOriginallyOpen) {
        if (cartProducts && !cartProducts.classList.contains('hidden-cart')) {
          cartProducts.classList.add('hidden-cart');
        }

        const cartIcon = document.querySelector('.container-cart-icon');
        if (cartIcon && cartIcon.hasAttribute('data-tooltip-active')) {
          cartIcon.removeEventListener('click', preventCartToggle);
          cartIcon.removeAttribute('data-tooltip-active');
        }
      } else if (
        (currentElement.classList.contains('container-cart-products') ||
          currentElement.classList.contains('icon-close') ||
          currentElement.classList.contains('cart-total') ||
          currentElement.classList.contains('finalizar-compra')) &&
        !cartWasOriginallyOpen
      ) {
        if (cartProducts && !cartProducts.classList.contains('hidden-cart')) {
          cartProducts.classList.add('hidden-cart');
        }
      }
    }

    removeCurrentTooltip();

    if (currentElement) {
      currentElement.classList.remove('highlight-element');
    }

    if (currentTooltipIndex >= tooltips.length) {
      finishGuide();
      return;
    }

    const nextTooltip = tooltips[currentTooltipIndex];

    const carritoChequeado = checkCartHasItems();
    if (carritoChequeado !== hasCartItems) {
      hasCartItems = carritoChequeado;
      updateBodyCartClass(hasCartItems);

      tooltips = getTooltipsConfiguration();
    }

    const requiresCartItems =
      nextTooltip.requiresCart === true ||
      ['.container-cart-products', '.icon-close', '.cart-total', '.finalizar-compra'].includes(
        nextTooltip.element
      );

    if (requiresCartItems && !hasCartItems) {
      currentTooltipIndex++;
      showNextTooltip();
      return;
    }

    const targetElement = document.querySelector(nextTooltip.element);

    if (!targetElement && nextTooltip.type !== 'modal') {
      console.log(`Elemento no encontrado: ${nextTooltip.element}`);
      currentTooltipIndex++;
      showNextTooltip();
      return;
    }

    showTooltip(tooltips[currentTooltipIndex], currentTooltipIndex);
    currentTooltipIndex++;
  }

  // Función para mostrar el tooltip anterior
  function showPrevTooltip() {
    const cartProducts = document.querySelector('.container-cart-products');
    const currentElement = document.querySelector('.highlight-element');

    if (currentElement) {
      if (currentElement.classList.contains('icon-cart') && !cartWasOriginallyOpen) {
        if (cartProducts && !cartProducts.classList.contains('hidden-cart')) {
          cartProducts.classList.add('hidden-cart');
        }

        const cartIcon = document.querySelector('.container-cart-icon');
        if (cartIcon && cartIcon.hasAttribute('data-tooltip-active')) {
          cartIcon.removeEventListener('click', preventCartToggle);
          cartIcon.removeAttribute('data-tooltip-active');
        }
      } else if (
        (currentElement.classList.contains('container-cart-products') ||
          currentElement.classList.contains('icon-close') ||
          currentElement.classList.contains('cart-total') ||
          currentElement.classList.contains('finalizar-compra')) &&
        !cartWasOriginallyOpen
      ) {
        if (cartProducts && !cartProducts.classList.contains('hidden-cart')) {
          cartProducts.classList.add('hidden-cart');
        }
      }
    }

    removeCurrentTooltip();

    if (currentElement) {
      currentElement.classList.remove('highlight-element');
    }

    // Comprobamos si hay elementos en el carrito y actualizamos nuestras variables
    const carritoChequeado = checkCartHasItems();
    if (carritoChequeado !== hasCartItems) {
      hasCartItems = carritoChequeado;
      updateBodyCartClass(hasCartItems);

      tooltips = getTooltipsConfiguration();
    }

    currentTooltipIndex = Math.max(1, currentTooltipIndex - 2);

    let intentos = 0;
    const maxIntentos = tooltips.length;

    while (intentos < maxIntentos) {
      const prevTooltip = tooltips[currentTooltipIndex];

      if (!prevTooltip) {
        currentTooltipIndex = Math.max(1, currentTooltipIndex - 1);
        intentos++;
        continue;
      }

      const requiresCartItems =
        prevTooltip.requiresCart === true ||
        ['.container-cart-products', '.icon-close', '.cart-total', '.finalizar-compra'].includes(
          prevTooltip.element
        );

      if (requiresCartItems && !hasCartItems) {
        currentTooltipIndex = Math.max(1, currentTooltipIndex - 1);
        intentos++;
        continue;
      }

      const targetElement = document.querySelector(prevTooltip.element);
      if (!targetElement && prevTooltip.type !== 'modal') {
        currentTooltipIndex = Math.max(1, currentTooltipIndex - 1);
        intentos++;
        continue;
      }

      break;
    }

    showTooltip(tooltips[currentTooltipIndex], currentTooltipIndex);
    currentTooltipIndex++;
  }
  function removeCurrentTooltip() {
    const currentTooltip = document.querySelector('.guide-tooltip');
    if (currentTooltip) {
      currentTooltip.remove();
      activeTooltip = null;
    }
  }

  // Función para finalizar la guía
  function finishGuide() {
    const highlightedElement = document.querySelector('.highlight-element');
    if (highlightedElement) {
      highlightedElement.classList.remove('highlight-element');
    }

    document.body.classList.remove('tooltip-active');

    const cartProducts = document.querySelector('.container-cart-products');
    if (cartProducts) {
      if (!cartWasOriginallyOpen && !cartProducts.classList.contains('hidden-cart')) {
        cartProducts.classList.add('hidden-cart');
      }

      cartWasOriginallyOpen = false;
    }

    // Restaurar el comportamiento original del icono del carrito
    const cartIcon = document.querySelector('.container-cart-icon');
    if (cartIcon && cartIcon.hasAttribute('data-tooltip-active')) {
      cartIcon.removeEventListener('click', preventCartToggle);
      cartIcon.removeAttribute('data-tooltip-active');
    }

    removeCurrentTooltip();

    try {
      localStorage.setItem(`${category}-guide-shown`, 'true');
      console.log(`Guía para ${category} marcada como vista en localStorage`);
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  }

  // Iniciar la guía si no se ha mostrado antes
  function initGuide() {
    if (!category) {
      console.warn(
        "No se pudo determinar la categoría de la página, estableciendo 'Productos' como valor predeterminado"
      );
      category = 'Productos';
    }    try {
      const guideShown = localStorage.getItem(`${category}-guide-shown`);
      console.log(`Comprobando guía para ${category}: ${guideShown ? 'Ya vista' : 'No vista aún'}`);

      if (!guideShown) {
        tooltipsShown = true;
        // Comentado para evitar conflicto con el nuevo modal de bienvenida
        // showWelcomeModal();
        localStorage.setItem(`${category}-guide-shown`, 'true'); // Marcar como visto
      }
    } catch (error) {
      console.error('Error al acceder a localStorage:', error);
      tooltipsShown = true;
      // Comentado para evitar conflicto con el nuevo modal de bienvenida
      // showWelcomeModal();
    }
  }

  // Añadir botón flotante para acceder a la guía desde cualquier parte de la página
  function addGuideLink() {
    const helpButton = document.createElement('button');
    helpButton.className = 'help-floating-button';
    helpButton.title = 'Ver guía de navegación';
    helpButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    `;    helpButton.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem(`${category}-guide-shown`);
      tooltipsShown = true;
      // Comentado para evitar conflicto con el nuevo modal de bienvenida
      // showWelcomeModal();
      // En su lugar, mostrar directamente el primer tooltip 
      showNextTooltip();
    });

    document.body.appendChild(helpButton);
  }

  // Escuchar cambios en el carrito para actualizar tooltips si es necesario
  function listenForCartChanges() {
    const addToCartButtons = document.querySelectorAll('.btn-add-cart');

    addToCartButtons.forEach((button) => {
      button.addEventListener('click', () => {
        setTimeout(() => {
          const cartHasItems = checkCartHasItems();

          if (cartHasItems) {
            hasCartItems = true;
            updateBodyCartClass(true);

            // Si estamos en medio de mostrar tooltips, actualizar la configuración
            if (tooltipsShown) {
              const updatedTooltips = getTooltipsConfiguration();

              if (updatedTooltips.length > tooltips.length) {
                const currentPosition = currentTooltipIndex;
                tooltips = updatedTooltips;

                const notification = document.createElement('div');
                notification.className = 'tooltip-update-notification';
                notification.textContent = '¡Nuevos consejos disponibles para el carrito!';
                document.body.appendChild(notification);

                setTimeout(() => {
                  if (notification.parentNode) {
                    notification.classList.add('fade-out');
                    setTimeout(() => {
                      if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                      }
                    }, 500);
                  }
                }, 3000);
              }
            }
          }
        }, 300);
      });
    });

    // Monitorear los botones de eliminar del carrito
    document.addEventListener(
      'click',
      (e) => {
        if (e.target.classList.contains('icon-close') || e.target.closest('.icon-close')) {
          setTimeout(() => {
            const cartHasItems = checkCartHasItems();
            if (!cartHasItems && hasCartItems) {
              hasCartItems = false;
              updateBodyCartClass(false);

              if (tooltipsShown) {
                tooltips = getTooltipsConfiguration();
              }
            }
          }, 300);
        }
      },
      true
    );
  }

  setTimeout(() => {
    initGuide();
    addGuideLink();
    listenForCartChanges();
  }, 500);
});
