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
    theme: 'light-border blue',
    animation: 'shift-away',
    trigger: 'manual'
  });

  tippy('.cart-delete', {
    content: 'Este botón te permite eliminar cualquier producto del carrito de compras.',
    placement: 'left',
    theme: 'light-border red',
    animation: 'shift-away',
    trigger: 'manual'
  });

  tippy('.total-pagar', {
    content: 'En esta sección se muestra el valor total de los productos que has elegido.',
    placement: 'bottom',
    theme: 'light-border green',
    animation: 'shift-away',
    trigger: 'manual'
  });

  // Tooltips para los botones
  tippy('.btn-add-cart', {
    content:
      'Haz clic en este botón para añadir este artículo a tu carrito y reservarlo para una posible compra.',
    placement: 'top',
    theme: 'light-border green',
    animation: 'perspective',
    trigger: 'manual'
  });

  tippy('.btn-detalles', {
    content: 'Haz clic aquí para ver más detalles y especificaciones del producto.',
    placement: 'top',
    theme: 'light-border blue',
    animation: 'perspective',
    trigger: 'manual'
  });

  tippy('.finalizar-compra', {
    content: 'Haz clic en este botón para comenzar el proceso de finalización de tu compra.',
    placement: 'top',
    theme: 'light-border green',
    animation: 'perspective',
    trigger: 'manual'
  });

  // Crear los pasos para la guía secuencial
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

  // Función para crear el contenido HTML del paso
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
          
          // Avanzar al siguiente paso después de un breve retraso
          setTimeout(function() {
            if (index === guideSteps.length - 1) {
              console.log('Guía completada');
            } else {
              showGuideStep(index + 1);
            }
          }, 300);
        };
        
        // Función para configurar el botón Siguiente
        const setupNextButton = function() {
          // Encontrar el botón y asignarle el evento
          const nextButton = document.getElementById(`guide-next-${step.step}`);
          if (nextButton) {
            // Eliminar cualquier evento previo (clonando el botón)
            const newButton = nextButton.cloneNode(true);
            if (nextButton.parentNode) {
              nextButton.parentNode.replaceChild(newButton, nextButton);
            }
            
            // Agregar el nuevo evento
            newButton.addEventListener('click', advanceToNextStep);
            
            // Enfocar el botón para mejor accesibilidad
            setTimeout(() => {
              try {
                newButton.focus();
              } catch (focusError) {
                console.log('Error al intentar enfocar botón: ', focusError);
              }
            }, 100);
          } else {
            console.log(`No se encontró el botón Siguiente para el paso ${step.step}`);
          }
        };
        
        // Si el elemento ya tiene una instancia de tippy, usarla
        if (element._tippy) {
          currentTippyInstance = element._tippy;
          currentTippyInstance.setProps({
            content: createStepContent(step),
            placement: step.placement || 'auto',
            allowHTML: true,
            interactive: true,
            theme: 'guide-step',
            animation: 'shift-away',
            arrow: true,
            hideOnClick: false,
            trigger: 'manual',
            touch: false,
            zIndex: 9999,
            onShow(instance) {
              console.log(`Mostrando tooltip paso ${step.step}: ${step.title}`);
              setTimeout(setupNextButton, 100);
              
              // Hacer scroll al elemento
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Destacar visualmente el elemento
              element.classList.add('tooltip-highlight-element');
              
              // Restaurar estado de procesamiento sólo después de que se ha mostrado
              setTimeout(() => {
                processingStep = false;
              }, 500);
            },
            onMount(instance) {
              // Asegurar que el botón tiene su evento
              setupNextButton();
            },
            onHide(instance) {
              // Eliminar clase de destacado
              element.classList.remove('tooltip-highlight-element');
            }
          });
          
          currentTippyInstance.show();
        } else {
          // Crear una nueva instancia de tippy
          currentTippyInstance = tippy(element, {
            content: createStepContent(step),
            placement: step.placement || 'auto',
            allowHTML: true,
            interactive: true,
            theme: 'guide-step',
            animation: 'shift-away',
            arrow: true,
            hideOnClick: false,
            trigger: 'manual',
            touch: false,
            zIndex: 9999,
            onShow(instance) {
              console.log(`Mostrando tooltip paso ${step.step}: ${step.title}`);
              setTimeout(setupNextButton, 100);
              
              // Hacer scroll al elemento
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Destacar visualmente el elemento
              element.classList.add('tooltip-highlight-element');
              
              // Restaurar estado de procesamiento sólo después de que se ha mostrado
              setTimeout(() => {
                processingStep = false;
              }, 500);
            },
            onMount(instance) {
              // Asegurar que el botón tiene su evento
              setupNextButton();
            },
            onHide(instance) {
              // Eliminar clase de destacado
              element.classList.remove('tooltip-highlight-element');
            }
          });
          
          currentTippyInstance.show();
        }
      } else {
        console.log(`No se encontraron elementos para ${selector}, pasando al siguiente paso`);
        processingStep = false;
        if (index < guideSteps.length - 1) {
          setTimeout(() => showGuideStep(index + 1), 200);
        } else {
          console.log('Guía completada (sin elementos)');
        }
      }
    } catch (error) {
      console.error('Error al mostrar paso:', error);
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
    const isVisibleByStyle = style.display !== 'none' && 
                            style.visibility !== 'hidden' && 
                            style.opacity !== '0';
    
    // Verificar si el elemento está en el viewport
    const isInViewport = rect.top <= window.innerHeight &&
                        rect.left <= window.innerWidth &&
                        rect.bottom >= 0 &&
                        rect.right >= 0;
    
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
      processingStep,
      visibleTooltips: visibleTooltips.length
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
