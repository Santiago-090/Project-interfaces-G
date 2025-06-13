// Archivo principal para tooltips optimizados
// Declaraciones globales para evitar duplicaciones o conflictos
let currentTippyInstance = null;
let currentStepIndex = 0;
let guideStarted = false;
let processingStep = false;
let lastNavigatedTimestamp = 0;

document.addEventListener('DOMContentLoaded', function () {
  console.log("Tooltips core cargado y listo para iniciar después del modal");
  
  // Configuración básica de Tippy
  tippy.setDefaultProps({
    arrow: true,
    animation: 'scale',
    theme: 'light-border',
    duration: 300,
    placement: 'auto',
    delay: [300, 100],
    maxWidth: 'none',  // Eliminar restricción de ancho máximo
    popperOptions: {
      modifiers: [
        {
          name: 'preventOverflow',
          options: {
            boundary: document.body,
            padding: 15
          }
        },
        {
          name: 'offset',
          options: {
            offset: [-20, 8]  // Desplazar a la izquierda (x, y)
          }
        }
      ]
    }
  });

  // Tooltips para los iconos del header y navegación (comunes para todas las vistas)
  tippy('.icon-cart', {
    content: 'Haz clic en este botón para ver los productos que has seleccionado para tu compra.',
    placement: 'bottom',
    theme: 'light-border blue',
    animation: 'shift-away',
    trigger: 'manual' 
  });

  tippy('.icon-cart2', {
    content: 'Al hacer clic en este botón, podrás acceder a nuestras redes sociales y contactarnos directamente.',
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
    content: 'Aquí podrás ver una breve descripción de los productos seleccionados, incluyendo su cantidad y valor unitario.',
    placement: 'right',
    theme: 'light-border info',
    trigger: 'manual'
  });

  tippy('.btn-detalles', {
    content: 'Haz clic aquí para ver información detallada del producto, incluyendo descripción, tallas disponibles y opiniones de otros compradores.',
    placement: 'top',
    theme: 'light-border info',
    trigger: 'manual'
  });

  tippy('.btn-add-cart', {
    content: 'Haz clic en este botón para añadir el producto a tu carrito. Este producto aparecerá en tu carrito de compras.',
    placement: 'top',
    theme: 'light-border success',
    trigger: 'manual'
  });

  tippy('.cart-delete', {
    content: 'Si deseas eliminar un producto de tu carrito, haz clic en este botón junto al producto que quieres quitar.',
    placement: 'left',
    theme: 'light-border danger',
    trigger: 'manual'
  });

  tippy('.total-pagar', {
    content: 'En esta sección se muestra el valor total de los productos que has elegido.',
    placement: 'bottom',
    theme: 'light-border info',
    trigger: 'manual'
  });

  tippy('.finalizar-compra', {
    content: 'Una vez que hayas seleccionado tus productos, haz clic aquí para comenzar el proceso de pago.',
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
      required: true
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
      required: false
    },
    {
      element: '.cart-delete',
      title: 'Eliminar producto',
      content: 'Si deseas eliminar un producto de tu carrito, haz clic en este botón junto al producto que quieres quitar.',
      placement: 'left',
      step: 7,
      required: false
    },
    {
      element: '.total-pagar',
      title: 'Total a pagar',
      content: 'En esta sección se muestra el valor total de los productos que has elegido.',
      placement: 'bottom',
      step: 8,
      required: false
    },
    {
      element: '.finalizar-compra',
      title: 'Finalizar compra',
      content: 'Una vez que hayas seleccionado tus productos, haz clic aquí para comenzar el proceso de pago.',
      placement: 'top',
      step: 9,
      required: false
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
  
  // Función para mostrar los pasos secuencialmente
  function showGuideStep(index) {
    console.log(`Intentando mostrar paso ${index}`);
    
    // Si estamos en el paso 5 (índice 5) que corresponde al paso 6 (container-cart-products),
    // verificar si hay productos en el carrito
    if (index === 5) {
      const carritoVacio = document.querySelector('.cart-empty:not(.hidden)');
      const rowProduct = document.querySelector('.row-product');
      
      // Si el carrito está vacío, saltamos al siguiente paso
      if (carritoVacio || (rowProduct && rowProduct.classList.contains('hidden'))) {
        return showGuideStep(index + 1); // Avanzar al siguiente paso
      }
    }
    
    // Prevenir múltiples llamadas en corto tiempo
    const now = Date.now();
    const isCriticalTransition = (currentStepIndex === 2);
    
    if (!isCriticalTransition && (now - lastNavigatedTimestamp < 300)) {
      return;
    }
    lastNavigatedTimestamp = now;
    
    // Evitar recursión o procesamiento concurrente
    if (processingStep) {
      return;
    }
    
    processingStep = true;
    
    // Actualizar el índice del paso actual
    currentStepIndex = index;
    
    try {
      // Si ya hay un tooltip activo, ocultarlo
      if (currentTippyInstance) {
        currentTippyInstance.hide();
        currentTippyInstance = null;
      }
  
      // Si ya se mostraron todos los pasos, terminar
      if (index >= guideSteps.length) {
        processingStep = false;
        return;
      }
  
      const step = guideSteps[index];
      // Buscar elementos con un selector más específico si es necesario
      let selector = step.element;
      
      // Mejora: mapeo específico para cada paso para asegurar que encontramos los elementos correctos
      const selectorMappings = {
        '.icon-cart': '.container-cart-icon .icon-cart, .container-icon .icon-cart',        // Paso 3: Carrito de compras
        '.icon-cart2': '.container-icon-cart .icon-cart2',      // Paso 2: Contacto
        '.icon-cart3': '.container-icon-cart .icon-cart3',      // Paso 1: Volver al inicio
        '.btn-add-cart': '.info-product .btn-add-cart',         // Paso 4: Añadir productos
        '.btn-detalles': '.info-product .btn-detalles'          // Paso 5: Ver detalles
      };
      
      // Usar selectores más específicos para asegurar que encontramos los elementos correctos
      if (selectorMappings[step.element]) {
        selector = selectorMappings[step.element];
      }
      
      // Intentar primero con el selector específico
      let elements = document.querySelectorAll(selector);
      console.log(`Buscando elementos con selector: ${selector}, encontrados: ${elements.length}`);
      
      // Si no encuentra elementos, intentar con el selector original como respaldo
      if (elements.length === 0 && selector !== step.element) {
        elements = document.querySelectorAll(step.element);
        console.log(`Intentando con selector original: ${step.element}, encontrados: ${elements.length}`);
      }
      
      // Si estamos en el primer paso y no se encuentra el elemento, usar un elemento respaldo
      if (index === 0 && elements.length === 0) {
        // Intentamos con otros elementos que siempre deben estar presentes
        const fallbackSelectors = [
          'h1', 
          '.container-BarraSuperior',
          'header',
          'body' 
        ];
        
        for (const fallbackSelector of fallbackSelectors) {
          const fallbackElements = document.querySelectorAll(fallbackSelector);
          if (fallbackElements.length > 0) {
            elements = fallbackElements;
            console.log(`Usando selector de respaldo: ${fallbackSelector}`);
            break;
          }
        }
      }
      
      if (elements.length > 0) {
        // Seleccionar el primer elemento que sea visible
        const element = Array.from(elements).find(el => isElementVisible(el));
        
        if (!element) {
          console.log('No se encontró ningún elemento visible');
          processingStep = false;
          setTimeout(() => showGuideStep(index + 1), 100);
          return;
        }
        
        // Función mejorada para avanzar al siguiente paso
        const advanceToNextStep = function(e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          
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
            // Eliminar cualquier listener anterior y crear uno nuevo
            const newNextButton = nextButton.cloneNode(true);
            if (nextButton.parentNode) {
              nextButton.parentNode.replaceChild(newNextButton, nextButton);
            }
            
            // Agregar el nuevo listener
            newNextButton.onclick = advanceToNextStep;
            newNextButton.addEventListener('click', advanceToNextStep);
            newNextButton.addEventListener('mousedown', advanceToNextStep);
            
            // Agregar atributos data
            newNextButton.setAttribute('data-step', step.step);
            newNextButton.setAttribute('data-element', step.element);
          }
        };
        
        console.log(`Creando tooltip para elemento paso ${step.step}`);
        
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
            maxWidth: 'none',
            popperOptions: {
              modifiers: [
                {
                  name: 'preventOverflow',
                  options: {
                    boundary: document.body,
                    padding: 15
                  }
                },
                {
                  name: 'offset',
                  options: {
                    offset: [-20, 8] // Desplazar a la izquierda (x, y)
                  }
                }
              ]
            },
            onShow(instance) {
              // Scroll hacia el elemento para asegurarse de que sea visible
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              
              // Configurar botón después de que el tooltip esté visible
              setTimeout(setupNextButton, 100);
            }
          });
          
          currentTippyInstance.show();
        } else {          
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
            maxWidth: 'none',
            popperOptions: {
              modifiers: [
                {
                  name: 'preventOverflow',
                  options: {
                    boundary: document.body,
                    padding: 15
                  }
                },
                {
                  name: 'offset',
                  options: {
                    offset: [-20, 8] // Desplazar a la izquierda (x, y)
                  }
                }
              ]
            },
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
              console.log(`Encontrado cartIcon con selector: ${selector}`);
              break;
            }
          }
          
          if (cartIcon) {            
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
              maxWidth: 'none',
              popperOptions: {
                modifiers: [
                  {
                    name: 'preventOverflow',
                    options: {
                      boundary: document.body,
                      padding: 15
                    }
                  },
                  {
                    name: 'offset',
                    options: {
                      offset: [-20, 8] // Desplazar a la izquierda (x, y)
                    }
                  }
                ]
              },
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
        
        console.log(`No se encontró elemento para paso ${index}, avanzando al siguiente`);
        // Si no se pudo manejar especialmente o no era el paso del carrito, pasar al siguiente paso
        processingStep = false;
        setTimeout(() => showGuideStep(index + 1), 100);
      }
    } catch (error) {
      console.error('Error mostrando guía:', error);
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
  
  // Función para iniciar la guía
  function startGuide() {
    console.log('Iniciando guía de tooltips');
    
    // Reiniciar el estado aunque ya se haya iniciado para evitar bloqueos
    if (guideStarted) {
      // Ocultar cualquier tooltip existente
      if (currentTippyInstance) {
        currentTippyInstance.hide();
        currentTippyInstance = null;
      }
      
      // Verificar si hay algún tooltip visible y ocultarlo
      const visibleTooltips = document.querySelectorAll('.tippy-box[data-state="visible"]');
      if (visibleTooltips.length > 0) {
        visibleTooltips.forEach(tooltip => {
          const instance = tooltip._tippy;
          if (instance) instance.hide();
        });
      }
    }

    guideStarted = true;
    currentStepIndex = 0;
    processingStep = false;
    lastNavigatedTimestamp = 0;

    // Pequeño retraso para asegurar que todo esté listo
    setTimeout(() => {
      showGuideStep(currentStepIndex);
    }, 200);
  }

  // Función para avanzar manualmente al siguiente paso
  function manualAdvanceTooltip() {
    // Ocultar tooltip actual si existe
    if (currentTippyInstance) {
      currentTippyInstance.hide();
      currentTippyInstance = null;
    }

    processingStep = false;
    showGuideStep(currentStepIndex);
  }
  
  // Exponer funciones para acceso externo
  window.startGuideTooltips = startGuide;
  window.showGuideStep = showGuideStep;
  window.manualAdvanceTooltip = manualAdvanceTooltip;
});

// El evento modalWelcomeClosed ahora es el único que inicia la guía
document.addEventListener('modalWelcomeClosed', function() {
  console.log('Evento modalWelcomeClosed recibido - iniciando guía de tooltips');
  setTimeout(() => {
    if (window.startGuideTooltips) {
      window.startGuideTooltips();
    } else {
      console.error('La función startGuideTooltips no está disponible');
    }
  }, 300); // Pequeño retraso para asegurar que el modal haya desaparecido completamente
});

// Manejo de eventos para el botón de ayuda (?) en la barra superior
document.addEventListener('DOMContentLoaded', function () {
  const helpButton = document.querySelector('.btn-help');

  if (helpButton) {
    helpButton.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Alternar la visibilidad de los tooltips de ayuda
      const isVisible = document.querySelector('.tippy-box[data-state="visible"]');

      if (isVisible) {
        // Si hay tooltips visibles, ocultarlos
        const instances = document.querySelectorAll('.tippy-box');
        instances.forEach((instance) => {
          const tippyInstance = instance._tippy;
          if (tippyInstance) {
            tippyInstance.hide();
          }
        });
      } else {
        // Si no hay tooltips visibles, iniciar la guía
        if (window.startGuideTooltips) {
          window.startGuideTooltips();
        }
      }
    });
  }
});
