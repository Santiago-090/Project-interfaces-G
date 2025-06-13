// Declaraciones globales para evitar duplicaciones o conflictos
// Estas variables deben estar en el ámbito más externo para consistencia
let guideStarted = false;
let processingStep = false;
let currentTippyInstance = null;
let currentStepIndex = 0;

document.addEventListener('DOMContentLoaded', function () {
  console.log('Tippy-tooltips: Inicializando tooltips');
  
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
          <button class="guide-button guide-next-button">Siguiente</button>
        </div>
      </div>
    `;  }
  // Función para mostrar los pasos secuencialmente
  function showGuideStep(index) {
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
      }
  
      // Si ya se mostraron todos los pasos, terminar
      if (index >= guideSteps.length) {
        console.log('Guía finalizada');
        processingStep = false;
        return;
      }
  
      const step = guideSteps[index];
      const elements = document.querySelectorAll(step.element);
      
      console.log(`Buscando elemento: ${step.element}, encontrados: ${elements.length}`);
      
      if (elements.length > 0) {
        // Seleccionar el primer elemento que sea visible
        const element = Array.from(elements).find(el => {
          const rect = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          return rect.width > 0 && 
                rect.height > 0 && 
                style.display !== 'none' && 
                style.visibility !== 'hidden';
        });
        
        if (!element) {
          console.log(`No se encontró un elemento visible para ${step.element}, pasando al siguiente paso`);
          processingStep = false;
          setTimeout(() => showGuideStep(index + 1), 100);
          return;
        }
        
        console.log(`Mostrando tooltip para ${step.element}`);
        
        // Función para avanzar al siguiente paso
        const advanceToNextStep = function(e) {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          console.log(`Avanzando al paso ${index + 1}`);
          
          // Limpiar estado de procesamiento
          processingStep = false;
          
          // Forzar ocultar el tooltip actual y avanzar
          if (currentTippyInstance) {
            currentTippyInstance.hide();
          }
          
          // Pequeña pausa antes de mostrar el siguiente
          setTimeout(() => {
            showGuideStep(index + 1);
          }, 50);
        };
        
        // Guardar la función para uso global
        window.currentAdvanceFunction = advanceToNextStep;
        
        // Función para configurar el botón siguiente
        const setupNextButton = () => {
          const nextButton = document.querySelector('.guide-next-button');
          if (nextButton) {
            // Eliminar cualquier listener anterior
            const newNextButton = nextButton.cloneNode(true);
            if (nextButton.parentNode) {
              nextButton.parentNode.replaceChild(newNextButton, nextButton);
            }
            
            // Agregar el nuevo listener de manera directa
            newNextButton.addEventListener('click', advanceToNextStep);
          } else {
            console.log('No se encontró el botón Siguiente');
            processingStep = false;
          }
        };
        
        // Si ya tiene una instancia de tippy, usarla
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
              // Configurar el botón después de que el tooltip es visible
              setTimeout(setupNextButton, 100);
            }
          });
          currentTippyInstance.show();
        } else {
          // Crear una nueva instancia de Tippy
          currentTippyInstance = tippy(element, {
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
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              // Configurar el botón después de que el tooltip es visible
              setTimeout(setupNextButton, 100);
            }
          });
          
          currentTippyInstance.show();
        }
      } else {
        // Si el elemento no existe, pasar al siguiente paso
        console.log(`No se encontró ningún elemento para ${step.element}, pasando al siguiente paso`);
        processingStep = false;
        setTimeout(() => showGuideStep(index + 1), 100);
      }
    } catch (error) {
      console.error('Error al mostrar el paso:', error);
      processingStep = false;
    }
  }
    // Función para iniciar la guía de forma segura
  function startGuide() {
    if (guideStarted) {
      console.log('La guía ya fue iniciada, no se iniciará de nuevo');
      return;
    }
    
    guideStarted = true;
    console.log('Iniciando guía de tooltips');
    currentStepIndex = 0;
    showGuideStep(currentStepIndex);
  }
  
  // Función para avanzar manualmente al siguiente paso (usado por tooltips-fixer.js)
  function manualAdvanceTooltip() {
    console.log('Avanzando manualmente al siguiente paso');
    if (currentTippyInstance) {
      currentTippyInstance.hide();
    }
    
    // Asumimos que estamos atorados en el paso actual, así que avanzamos al siguiente
    processingStep = false; // Asegurar que no estemos bloqueados
    if (typeof currentStepIndex === 'number') {
      showGuideStep(currentStepIndex + 1);
    } else {
      // Si por alguna razón currentStepIndex no está definido, empezamos desde el principio
      showGuideStep(0);
    }
  }
  
  // Exponer la función para que tooltips-fixer.js pueda acceder a ella
  window.manualAdvanceTooltip = manualAdvanceTooltip;
  
  // Escuchar el evento personalizado del modal-bienvenida.js
  document.addEventListener('modalWelcomeClosed', function(event) {
    console.log('Evento modalWelcomeClosed detectado');
    
    // Evitar múltiples inicios si se dispara el evento varias veces
    if (!guideStarted) {
      setTimeout(() => {
        startGuide();
      }, 500);
    } else {
      console.log('Guía ya iniciada, ignorando evento modalWelcomeClosed');
    }
  });

  // Detectar cuándo se ha cerrado el modal usando un MutationObserver
  const observer = new MutationObserver((mutations) => {
    if (guideStarted) {
      console.log('Guía ya iniciada, MutationObserver no iniciará la guía');
      return; // No procesar si ya se inició la guía
    }
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.removedNodes.length > 0) {
        // Verificamos si entre los nodos eliminados está el modal de bienvenida
        for (let i = 0; i < mutation.removedNodes.length; i++) {
          const node = mutation.removedNodes[i];
          if (node.classList && node.classList.contains('modal-overlay')) {
            console.log('Modal removido del DOM detectado');
            // Esperamos un poco antes de iniciar la guía
            setTimeout(() => {
              if (!guideStarted) { // Verificar de nuevo por si ha cambiado
                startGuide();
              }
            }, 500);
            
            // Detenemos el observer una vez que se ha iniciado la guía
            observer.disconnect();
            break;
          }
        }
      }
    });
  });

  // Configuramos el observer para que observe los cambios en el body
  observer.observe(document.body, { childList: true, subtree: false });
    // Si estamos en una página de catálogo, intentamos iniciar los tooltips automáticamente
  // pero con un tiempo de espera mayor para asegurar que todo está cargado
  setTimeout(() => {
    // Verificar si estamos en una página de catálogo basado en la URL
    const urlActual = window.location.pathname;
    if (urlActual.includes('interfaz-')) {
      console.log('Página de catálogo detectada, verificando si hay modal visible');
      
      // Verificar si el modal aún está visible y si la guía ya se inició
      const modalOverlay = document.querySelector('.modal-overlay');
      if (!modalOverlay && !guideStarted) {
        console.log('Modal no detectado y guía no iniciada, iniciando guía');
        startGuide(); // Usar la función startGuide en lugar de llamar directamente a showGuideStep
      } else if (modalOverlay) {
        console.log('Modal aún visible, esperando a que se cierre');
      } else if (guideStarted) {
        console.log('Guía ya iniciada, no se iniciará nuevamente');
      }
    }
  }, 2000); // Aumentado a 2 segundos para mayor seguridad

  // Agregar estilos CSS para los tooltips de guía
  const style = document.createElement('style');
  style.textContent = `
    .guide-step-content {
      padding: 15px 10px;
      max-width: 280px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .step-number {
      display: inline-block;
      width: 24px;
      height: 24px;
      background-color: #0077cc;
      color: white;
      border-radius: 50%;
      text-align: center;
      line-height: 24px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .guide-step-content h3 {
      margin: 0 0 8px;
      font-size: 16px;
      color: #333;
      text-align: center;
    }
    
    .guide-step-content p {
      margin: 0 0 15px;
      font-size: 14px;
      color: #555;
      text-align: center;
    }
      .tippy-box[data-theme~='guide-step'] {
      background-color: white;
      color: #333;
      border: 1px solid #ddd;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      z-index: 9999 !important;
    }
    
    .tippy-box[data-theme~='guide-step'] .tippy-arrow {
      color: white;
    }
    
    .guide-navigation {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-top: 10px;
    }
    
    .guide-button {
      padding: 5px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    
    .guide-next-button {
      background-color: #0077cc;
      color: white;
    }
    
    .guide-next-button:hover {
      background-color: #005fa3;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  
  document.head.appendChild(style);
});
