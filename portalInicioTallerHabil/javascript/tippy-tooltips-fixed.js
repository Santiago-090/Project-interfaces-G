// Declaraciones globales para evitar duplicaciones o conflictos
// Estas variables deben estar en el ámbito más externo para consistencia
let currentTippyInstance = null;
let currentStepIndex = 0;
let guideStarted = false;
let processingStep = false;
let lastNavigatedTimestamp = 0;

document.addEventListener('DOMContentLoaded', function () {
  console.log('Tippy-tooltips (FIXED): Inicializando tooltips');
  
  // Configuración básica de Tippy
  tippy.setDefaultProps({
    arrow: true,
    animation: 'scale',
    theme: 'light-border',
    duration: 300,
    placement: 'auto',
    delay: [300, 100],
    maxWidth: 250
  });

  // Tooltips para los iconos del header y navegación (comunes para todas las vistas)
  tippy('.icon-cart', {
    content: 'Haz clic en este botón para ver los productos que has seleccionado para tu compra.',
    placement: 'bottom',
    theme: 'light-border blue',
    animation: 'shift-away',
    trigger: 'manual' // Cambiamos a manual para controlarlo desde el guiado secuencial
  });

  tippy('.icon-cart2', {
    content:
      'Al hacer clic en este botón, podrás acceder a nuestras redes sociales y contactarnos directamente.',
    placement: 'bottom',
    theme: 'light-border blue',
    animation: 'shift-away',
    trigger: 'manual'
  });

  tippy('.icon-cart3', {
    content: 'Haz clic en este botón para volver al índice principal.',
    placement: 'bottom',
    theme: 'light-border blue',
    animation: 'shift-away',
    trigger: 'manual'
  });

  // Tooltips para descripciones en el carrito
  tippy('.container-cart-products', {
    content:
      'Aquí podrás ver una breve descripción de los productos seleccionados, incluyendo su cantidad y valor unitario.',
    placement: 'right',
    theme: 'light-border info',
    trigger: 'manual'
  });

  tippy('.btn-detalles', {
    content:
      'Haz clic aquí para ver información detallada del producto, incluyendo descripción, tallas disponibles y opiniones de otros compradores.',
    placement: 'top',
    theme: 'light-border info',
    trigger: 'manual'
  });

  tippy('.btn-add-cart', {
    content:
      'Haz clic en este botón para añadir el producto a tu carrito. Este producto aparecerá en tu carrito de compras.',
    placement: 'top',
    theme: 'light-border success',
    trigger: 'manual'
  });

  tippy('.cart-delete', {
    content:
      'Si deseas eliminar un producto de tu carrito, haz clic en este botón junto al producto que quieres quitar.',
    placement: 'left',
    theme: 'light-border danger',
    trigger: 'manual'
  });

  tippy('.total-pagar', {
    content:
      'En esta sección se muestra el valor total de los productos que has elegido.',
    placement: 'bottom',
    theme: 'light-border info',
    trigger: 'manual'
  });

  tippy('.finalizar-compra', {
    content:
      'Una vez que hayas seleccionado tus productos, haz clic aquí para comenzar el proceso de pago.',
    placement: 'top',
    theme: 'light-border success',
    trigger: 'manual'
  });

  // Definición de los pasos de la guía
  const guideSteps = [
    {
      element: '.icon-cart3',
      title: 'Volver al inicio',
      content: 'Haz clic en este botón para volver al índice principal.',
      placement: 'bottom',
      step: 1,
      required: true // Es un elemento obligatorio
    },
    {
      element: '.icon-cart2',
      title: 'Contacto',
      content: 'Al hacer clic en este botón, podrás acceder a nuestras redes sociales y contactarnos directamente.',
      placement: 'bottom',
      step: 2,
      required: true
    },
    {
      element: '.icon-cart',
      title: 'Carrito de compras',
      content: 'Haz clic en este botón para ver los productos que has seleccionado para tu compra.',
      placement: 'bottom',
      step: 3,
      required: true
    },
    {
      element: '.btn-add-cart',
      title: 'Añadir productos',
      content: 'Haz clic en este botón para añadir productos a tu carrito. Cada producto seleccionado aparecerá en tu carrito de compras.',
      placement: 'top',
      step: 4,
      required: true
    },
    {
      element: '.btn-detalles',
      title: 'Ver detalles',
      content: 'Haz clic aquí para ver información detallada del producto, incluyendo descripción, tallas disponibles y opiniones de otros compradores.',
      placement: 'top',
      step: 5,
      required: true
    },
    {
      element: '.container-cart-products',
      title: 'Descripción del producto',
      content: 'Aquí podrás ver una breve descripción de los productos seleccionados, incluyendo su cantidad y valor unitario.',
      placement: 'right',
      step: 6,
      required: false // Puede que no esté visible inicialmente
    },
    {
      element: '.cart-delete',
      title: 'Eliminar producto',
      content: 'Si deseas eliminar un producto de tu carrito, haz clic en este botón junto al producto que quieres quitar.',
      placement: 'left',
      step: 7,
      required: false // Puede que no esté visible inicialmente
    },
    {
      element: '.total-pagar',
      title: 'Total a pagar',
      content: 'En esta sección se muestra el valor total de los productos que has elegido.',
      placement: 'bottom',
      step: 8,
      required: false // Puede que no esté visible inicialmente
    },
    {
      element: '.finalizar-compra',
      title: 'Finalizar compra',
      content: 'Una vez que hayas seleccionado tus productos, haz clic aquí para comenzar el proceso de pago.',
      placement: 'top',
      step: 9,
      required: false // Puede que no esté visible inicialmente
    }
  ];
  // Función para crear el contenido HTML del paso con mejor estilo y más claridad
  function createStepContent(step) {
    return `
      <div class="guide-step-content">
        <div class="step-number">${step.step}</div>
        <h3>${step.title}</h3>
        <p>${step.content}</p>
        <div class="guide-navigation">
          <button class="guide-button guide-next-button" id="guide-next-${step.step}">Siguiente</button>
        </div>
      </div>
    `;
  }
  
  // Función mejorada para mostrar los pasos secuencialmente
  function showGuideStep(index) {
    // Si estamos en el paso 5 (índice 5) que corresponde al paso 6 (container-cart-products),
    // verificar si hay productos en el carrito
    if (index === 5) {
      const carritoVacio = document.querySelector('.cart-empty:not(.hidden)');
      const rowProduct = document.querySelector('.row-product');
      
      // Si el carrito está vacío, saltamos al siguiente paso
      if (carritoVacio || (rowProduct && rowProduct.classList.contains('hidden'))) {
        console.log('Carrito vacío, saltando paso 6 (descripción del producto)');
        return showGuideStep(index + 1); // Avanzar al siguiente paso
      }
    }
    
    // Prevenir múltiples llamadas en corto tiempo, excepto para el paso crítico 3 (carrito)
    const now = Date.now();
    const isCriticalTransition = (currentStepIndex === 2); // Si estamos en paso 2, permitir siempre avanzar a paso 3
    
    if (!isCriticalTransition && (now - lastNavigatedTimestamp < 300)) {
      console.log(`Ignorando navegación rápida al paso ${index}, muy cercana a la última (${now - lastNavigatedTimestamp}ms)`);
      return;
    }
    lastNavigatedTimestamp = now;
    
    // Evitar recursión o procesamiento concurrente
    if (processingStep) {
      console.log(`Ya está procesando un paso, se ignorará la solicitud para el paso ${index}`);
      return;
    }
    
    processingStep = true;
    
    // Actualizar el índice del paso actual
    currentStepIndex = index;
    console.log(`Intentando mostrar el paso ${index}`);
      try {
      // Si ya hay un tooltip activo, ocultarlo
      if (currentTippyInstance) {
        currentTippyInstance.hide();
        currentTippyInstance = null;
      }
  
      // Si ya se mostraron todos los pasos, terminar
      if (index >= guideSteps.length) {
        console.log('Guía finalizada');
        processingStep = false;
        return;
      }
  
      const step = guideSteps[index];
      // Buscar elementos con un selector más específico si es necesario
      let selector = step.element;
      
      // Mejora: mapeo específico para cada paso para asegurar que encontramos los elementos correctos
      const selectorMappings = {
        '.icon-cart': '.container-cart-icon .icon-cart',        // Paso 3: Carrito de compras
        '.icon-cart2': '.container-icon-cart .icon-cart2',      // Paso 2: Contacto
        '.icon-cart3': '.container-icon-cart .icon-cart3',      // Paso 1: Volver al inicio
        '.btn-add-cart': '.info-product .btn-add-cart',         // Paso 4: Añadir productos
        '.btn-detalles': '.info-product .btn-detalles'          // Paso 5: Ver detalles
      };
      
      // Usar selectores más específicos para asegurar que encontramos los elementos correctos
      if (selectorMappings[step.element]) {
        console.log(`Usando selector específico para "${step.title}"`);
        selector = selectorMappings[step.element];
      }
      
      // Intentar primero con el selector específico
      let elements = document.querySelectorAll(selector);
      
      // Si no encuentra elementos, intentar con el selector original como respaldo
      if (elements.length === 0 && selector !== step.element) {
        console.log(`No se encontraron elementos con el selector específico, intentando con el selector original: ${step.element}`);
        elements = document.querySelectorAll(step.element);
      }
        console.log(`Buscando elemento: ${selector}, encontrados: ${elements.length}`);
      
      // Si estamos en el primer paso y no se encuentra el elemento, usar un elemento respaldo
      if (index === 0 && elements.length === 0) {
        console.log('No se encontró el elemento para el primer paso, usando elemento respaldo');
        // Intentamos con otros elementos que siempre deben estar presentes
        const fallbackSelectors = [
          'h1', // El título del sitio siempre debería estar presente
          '.container-BarraSuperior',
          'header',
          'body' // Última opción, siempre existe
        ];
        
        for (const fallbackSelector of fallbackSelectors) {
          const fallbackElements = document.querySelectorAll(fallbackSelector);
          if (fallbackElements.length > 0) {
            elements = fallbackElements;
            console.log(`Usando elemento respaldo: ${fallbackSelector}, encontrados: ${elements.length}`);
            break;
          }
        }
      }
      
      if (elements.length > 0) {
        // Seleccionar el primer elemento que sea visible
        const element = Array.from(elements).find(el => isElementVisible(el));
        
        if (!element) {
          console.log(`No se encontró un elemento visible para ${selector}, pasando al siguiente paso`);
          processingStep = false;
          setTimeout(() => showGuideStep(index + 1), 100);
          return;
        }
        
        console.log(`Mostrando tooltip para ${selector} en el paso ${step.step}`);
        
        // Función mejorada para avanzar al siguiente paso
        const advanceToNextStep = function(e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          
          // Para debug
          console.log(`Botón presionado: Avanzando del paso ${index} (${step.title}) al paso ${index + 1}`);
          
          // Limpiar estado de procesamiento
          processingStep = false;
          
          // Forzar ocultar el tooltip actual
          if (currentTippyInstance) {
            currentTippyInstance.hide();
            currentTippyInstance = null;
          }
          
          // Pequeña pausa antes de mostrar el siguiente
          setTimeout(() => {
            showGuideStep(index + 1);
          }, 100);
        };
        
        // Guardar la función para uso global
        window.currentAdvanceFunction = advanceToNextStep;
        
        // Función para configurar el botón siguiente con ID único
        const setupNextButton = () => {
          const nextButton = document.getElementById(`guide-next-${step.step}`);
          if (nextButton) {
            console.log(`Configurando botón para paso ${step.step}`);
            
            // Eliminar cualquier listener anterior y crear uno nuevo
            const newNextButton = nextButton.cloneNode(true);
            if (nextButton.parentNode) {
              nextButton.parentNode.replaceChild(newNextButton, nextButton);
            }
            
            // Agregar el nuevo listener (de varias maneras para garantizar que funcione)
            newNextButton.onclick = advanceToNextStep;
            newNextButton.addEventListener('click', advanceToNextStep);
            newNextButton.addEventListener('mousedown', advanceToNextStep);
            
            // Agregar atributos data para facilitar la depuración
            newNextButton.setAttribute('data-step', step.step);
            newNextButton.setAttribute('data-element', step.element);
          } else {
            console.log(`No se encontró el botón Siguiente para paso ${step.step}`);
          }
        };
        
        // Si ya tiene una instancia de tippy, usarla; si no, crearla
        if (element._tippy) {
          currentTippyInstance = element._tippy;
          currentTippyInstance.setContent(createStepContent(step));
          currentTippyInstance.setProps({
            placement: step.placement,
            allowHTML: true,
            interactive: true,
            animation: 'shift-away',
            theme: 'guide-step',
            arrow: true,
            zIndex: 9999,
            appendTo: document.body,
            onShow(instance) {
              // Scroll hacia el elemento para asegurarse de que sea visible
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Configurar botón después de que el tooltip esté visible
              setTimeout(setupNextButton, 100);
            }
          });
          
          currentTippyInstance.show();
        } else {
          console.log(`Creando nuevo tooltip para ${selector}`);
          
          // Crear un nuevo tooltip para este elemento
          currentTippyInstance = tippy(element, {
            content: createStepContent(step),
            placement: step.placement,
            allowHTML: true,
            interactive: true,
            animation: 'shift-away',
            theme: 'guide-step',
            arrow: true,
            zIndex: 9999,
            appendTo: document.body,
            trigger: 'manual',
            onShow(instance) {
              // Scroll hacia el elemento para asegurarse de que sea visible
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Configurar botón después de que el tooltip esté visible
              setTimeout(setupNextButton, 100);
            }
          });
          
          currentTippyInstance.show();
        }
      } else {
        // Si el elemento no existe, tendremos un manejo especial para el carrito (paso 3)
        if (step.element === '.icon-cart' && index === 2) {
          console.log(`ATENCIÓN: No se encontró el icono del carrito en el paso 3, intentando buscar con selector alternativo`);
          
          // Intentar buscar el icono del carrito con distintos selectores
          const alternativeSelectors = [
            '.icon-cart',
            '.container-icon .icon-cart', 
            '.container-cart-icon .icon-cart',
            '.container-icon svg',
            'svg.icon-cart'
          ];
          
          let cartIcon = null;
          for (const selector of alternativeSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
              cartIcon = elements[0];
              console.log(`Encontrado elemento de carrito con selector alternativo: ${selector}`);
              break;
            }
          }
          
          if (cartIcon) {
            // Si encontramos el carrito, usarlo para el tooltip
            console.log(`Usando elemento de carrito encontrado para el paso 3`);
            
            // Crear tooltip para el elemento encontrado
            currentTippyInstance = tippy(cartIcon, {
              content: createStepContent(step),
              placement: step.placement,
              allowHTML: true,
              showOnCreate: true,
              animation: 'shift-away',
              theme: 'guide-step',
              interactive: true,
              trigger: 'manual',
              duration: 300,
              arrow: true,
              zIndex: 9999,
              appendTo: document.body,
              onShow(instance) {
                // Scroll hacia el elemento para asegurarse de que sea visible
                cartIcon.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Configurar el botón después de que el tooltip es visible
                setTimeout(setupNextButton, 100);
              }
            });
            
            currentTippyInstance.show();
            processingStep = false;
            return;
          }
        }
        
        // Si no se pudo manejar especialmente o no era el paso del carrito, pasar al siguiente paso
        console.log(`No se encontró ningún elemento para ${step.element}, pasando al siguiente paso`);
        processingStep = false;
        setTimeout(() => showGuideStep(index + 1), 100);
      }
    } catch (error) {
      console.error('Error al mostrar el paso:', error);
      processingStep = false;
    }
  }
  // Función para verificar si un elemento está realmente visible
  function isElementVisible(el) {
    if (!el) return false;
    
    // Verificar si el elemento tiene tamaño y está visible
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    
    const isVisibleBySize = rect.width > 0 && rect.height > 0;
    const isVisibleByStyle = style.display !== 'none' && style.visibility !== 'hidden' && 
                             style.opacity !== '0' && parseFloat(style.opacity) > 0;
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0 && 
                         rect.left < window.innerWidth && rect.right > 0;
                         
    return isVisibleBySize && isVisibleByStyle && isInViewport;
  }
  
  // Función para iniciar la guía de forma segura
  function startGuide() {
    console.log('Intentando iniciar guía de tooltips');
    
    // Reiniciar el estado aunque ya se haya iniciado para evitar bloqueos
    if (guideStarted) {
      console.log('La guía ya fue iniciada, reiniciando estado');
      
      // Ocultar cualquier tooltip existente
      if (currentTippyInstance) {
        currentTippyInstance.hide();
        currentTippyInstance = null;
      }
      
      // Verificar si hay algún tooltip visible y ocultarlo
      const visibleTooltips = document.querySelectorAll('.tippy-box[data-state="visible"]');
      if (visibleTooltips.length > 0) {
        console.log(`Ocultando ${visibleTooltips.length} tooltips visibles antes de reiniciar`);
        visibleTooltips.forEach(tooltip => {
          const instance = tooltip._tippy;
          if (instance) instance.hide();
        });
      }
    }
    
    guideStarted = true;
    console.log('Iniciando/Reiniciando guía de tooltips');
    currentStepIndex = 0;
    processingStep = false;
    lastNavigatedTimestamp = 0;
    
    // Pequeño retraso para asegurar que todo esté listo
    setTimeout(() => {
      console.log('Mostrando primer paso de la guía');
      showGuideStep(currentStepIndex);
    }, 200);
  }
  
  // Función para avanzar manualmente al siguiente paso (usado por tooltips-fixer.js)
  function manualAdvanceTooltip() {
    console.log('Avanzando manualmente al siguiente paso desde el paso actual');
    
    // Ocultar tooltip actual si existe
    if (currentTippyInstance) {
      currentTippyInstance.hide();
      currentTippyInstance = null;
    }
    
    // Asumimos que estamos atorados en el paso actual, así que avanzamos al siguiente
    processingStep = false; // Asegurar que no estemos bloqueados
    
    // Verificamos específicamente el paso problemático (paso 2 a 3)
    if (currentStepIndex === 2) {
      console.log('Detectado el paso problemático (2->3), aplicando resolución especial');
      
      // Buscar directamente el elemento del paso 3
      const iconCart = document.querySelector('nav .icon-cart');
      if (iconCart) {
        console.log('Elemento del carrito encontrado, avanzando directamente al paso 3');
        setTimeout(() => showGuideStep(2), 200);  // Paso 3 (índice 2)
      } else {
        console.log('Elemento del carrito no encontrado, avanzando al siguiente paso disponible');
        setTimeout(() => showGuideStep(currentStepIndex + 1), 200);
      }
    } else if (typeof currentStepIndex === 'number') {
      setTimeout(() => showGuideStep(currentStepIndex + 1), 200);
    } else {
      // Si por alguna razón currentStepIndex no está definido, empezamos desde el principio
      setTimeout(() => showGuideStep(0), 200);
    }
  }
  
  // Exponer funciones para que tooltips-fixer.js pueda acceder a ellas
  window.manualAdvanceTooltip = manualAdvanceTooltip;
  window.startGuideTooltips = startGuide;
  window.showGuideStep = showGuideStep; // Exponemos showGuideStep directamente
  window.currentStepIndexTooltip = () => currentStepIndex;
  
  // Función de diagnóstico para verificar el estado de los tooltips
  window.checkTooltipState = function() {
    console.log('Estado actual de tooltips:');
    console.log('- Paso actual:', currentStepIndex);
    console.log('- Guía iniciada:', guideStarted);
    console.log('- Procesando paso:', processingStep);
    const visibleTooltips = document.querySelectorAll('.tippy-box[data-state="visible"]');
    console.log('- Tooltips visibles:', visibleTooltips.length);
    return {
      currentStep: currentStepIndex,
      guideStarted,
      processingStep,    visibleTooltips: visibleTooltips.length
    };
  };
  
  // Escuchar al evento para iniciar la guía al cerrar el modal de bienvenida
  document.addEventListener('modalWelcomeClosed', function () {
    console.log('Modal cerrado, iniciando guía de tooltips');
    // Añadir un pequeño retraso para asegurar que el DOM está listo
    setTimeout(() => {
      console.log('Ejecutando startGuide() después del retraso');
      startGuide();
      
      // Verificar después de un breve retraso si el tooltip apareció
      setTimeout(() => {
        const visibleTooltips = document.querySelectorAll('.tippy-box[data-state="visible"]');
        console.log(`Tooltips visibles después de iniciar guía: ${visibleTooltips.length}`);
        
        // Si no hay tooltips visibles, intentar forzar la aparición del primero
        if (visibleTooltips.length === 0 && typeof showGuideStep === 'function') {
          console.log('No se detectaron tooltips visibles, intentando mostrar el primer paso');
          showGuideStep(0);
        }
      }, 500);
    }, 400);
  });
  
  // Escuchar al evento de producto agregado al carrito
  document.addEventListener('productAddedToCart', function() {
    console.log('Producto agregado al carrito detectado');
    // Si estamos en los pasos 0-4 (pasos 1-5), continuar normalmente
    // Si estamos en o hemos pasado el paso 5 (paso 6 - container-cart-products), 
    // y este paso se ha saltado previamente, mostrarlo ahora
    if (currentStepIndex >= 5 && document.querySelector('.cart-empty.hidden')) {
      console.log('Mostrando descripción del carrito ahora que hay productos');
      // Mostrar tooltip del carrito si ya lo pasamos pero ahora hay productos
      showGuideStep(5); // Mostrar paso 6 (índice 5)
    }
  });

  // Detectar si no hay modal de bienvenida e iniciar directamente
  setTimeout(() => {
    const modalOverlay = document.querySelector('.modal-overlay');
    if (!modalOverlay || getComputedStyle(modalOverlay).display === 'none') {
      console.log('No se detectó modal de bienvenida, iniciando guía directamente');
      startGuide();
    }
  }, 1000);

  // Debug: mostrar cuando estemos listos
  console.log('Tippy-tooltips (FIXED): Configuración completada, esperando para iniciar la guía');
});

// Debug: Exponer herramientas de diagnóstico y reparación
window.diagnosticarTooltips = function() {
  console.log('=== Diagnóstico de Tooltips ===');
  console.log('Paso actual:', currentStepIndex);
  console.log('Guía iniciada:', guideStarted);
  console.log('Procesando paso:', processingStep);
  console.log('Tooltips visibles:', document.querySelectorAll('.tippy-box[data-state="visible"]').length);
    const visibleTooltip = document.querySelector('.tippy-box[data-state="visible"]');
  if (visibleTooltip) {
    console.log('Contenido del tooltip visible:', visibleTooltip.textContent);
  }
  
  return "Diagnóstico completado. Ver consola para detalles.";
}

window.repararTooltips = function() {
  processingStep = false;
  if (currentTippyInstance) {
    currentTippyInstance.hide();
    currentTippyInstance = null;
  }
  
  console.log('Reparando secuencia de tooltips...');
  setTimeout(() => {
    if (typeof currentStepIndex === 'number' && currentStepIndex > 0) {
      window.manualAdvanceTooltip();
    } else {
      // Reiniciar desde el principio
      const event = new CustomEvent('modalWelcomeClosed');
      document.dispatchEvent(event);
    }
  }, 300);
  
  return "Reparación iniciada. La secuencia de tooltips debería continuar.";
};

// Función específica para mostrar tooltips en elementos encontrados con selectores alternativos
function showSpecificTooltip(element, step, index) {
    if (!element) return false;
    
    console.log(`Mostrando tooltip específico para elemento encontrado (paso ${step.step})`);
    
    // Función para avanzar al siguiente paso
    const advanceToNextStep = function(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      console.log(`Avanzando del paso específico ${index} al paso ${index + 1}`);
      
      // Limpiar estado de procesamiento
      processingStep = false;
      
      // Ocultar tooltip actual
      if (currentTippyInstance) {
        currentTippyInstance.hide();
      }
      
      // Avanzar al siguiente paso
      setTimeout(() => {
        showGuideStep(index + 1);
      }, 100);
    };
    
    // Guardar referencia global
    window.currentAdvanceFunction = advanceToNextStep;
    
    // Configurar botón siguiente
    const setupNextButton = () => {
      const nextButton = document.querySelector('.guide-next-button');
      if (nextButton) {
        const newButton = nextButton.cloneNode(true);
        nextButton.parentNode.replaceChild(newButton, nextButton);
        newButton.addEventListener('click', advanceToNextStep);
      }
    };
    
    // Crear instancia de tippy
    currentTippyInstance = tippy(element, {
      content: createStepContent(step),
      placement: step.placement,
      allowHTML: true,
      interactive: true,
      animation: 'shift-away',
      theme: 'guide-step highlight-special',
      trigger: 'manual',
      arrow: true,
      zIndex: 10000, // Mayor z-index para destacar
      maxWidth: 350,
      appendTo: document.body,
      onShow(instance) {
        // Scroll al elemento
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Configurar botón
        setTimeout(setupNextButton, 100);
        // Destacar visualmente el elemento
        element.classList.add('tooltip-highlight-element');
        // Animar para llamar la atención
        element.style.animation = 'pulse 1s infinite';
      },
      onHide(instance) {
        // Eliminar destacados
        element.classList.remove('tooltip-highlight-element');
        element.style.animation = '';
      }
    });
    
    // Mostrar tooltip
    currentTippyInstance.show();
    return true;
  }
