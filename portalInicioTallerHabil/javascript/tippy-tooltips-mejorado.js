document.addEventListener('DOMContentLoaded', function () {
  // Variables globales para el control de tooltips
  let currentTippyInstance = null;
  let currentStepIndex = 0;
  let guideStarted = false;
  let processingStep = false;
  let lastNavigatedTimestamp = 0;
  
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
    `;
  }

  // Función para mostrar los pasos secuencialmente
  function showGuideStep(index) {
    console.log(`Intentando mostrar el paso ${index}`);
    
    // Si ya hay un tooltip activo, ocultarlo
    if (currentTippyInstance) {
      currentTippyInstance.hide();
    }

    // Si ya se mostraron todos los pasos, terminar
    if (index >= guideSteps.length) {
      console.log('Guía finalizada');
      // Marcar la guía como completada para esta sesión
      sessionStorage.setItem('tooltipGuideCompleted', 'true');
      return;
    }

    const step = guideSteps[index];
    const elements = document.querySelectorAll(step.element);
    console.log(`Buscando elemento: ${step.element}, encontrados: ${elements.length}`);
    
    // Si no hay elementos o todos los elementos están ocultos
    if (elements.length === 0) {
      console.log(`No se encontró ningún elemento para ${step.element}`);
      
      // Si el paso es requerido, intentar de nuevo después de un tiempo
      if (step.required) {
        console.log(`El paso ${index} es requerido, esperando a que aparezca el elemento...`);
        setTimeout(() => {
          // Verificar si todavía estamos en la misma página
          if (document.body) {
            showGuideStep(index);
          }
        }, 1000);
      } else {
        // Si no es requerido, pasar al siguiente paso
        console.log(`El paso ${index} no es requerido, pasando al siguiente`);
        showGuideStep(index + 1);
      }
      return;
    }
    
    // Buscar un elemento visible entre los seleccionados
    const element = Array.from(elements).find(el => {
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return rect.width > 0 && 
             rect.height > 0 && 
             style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             style.opacity !== '0';
    });
    
    if (!element) {
      console.log(`Ningún elemento visible encontrado para ${step.element}`);
      
      // Si el paso es requerido, intentar de nuevo o esperar
      if (step.required) {
        console.log(`El paso ${index} es requerido, esperando a que el elemento sea visible...`);
        setTimeout(() => {
          // Verificar si todavía estamos en la misma página
          if (document.body) {
            showGuideStep(index);
          }
        }, 1000);
      } else {
        // Si no es requerido, pasar al siguiente paso
        console.log(`El paso ${index} no es requerido, pasando al siguiente`);
        showGuideStep(index + 1);
      }
      return;
    }
    
    console.log(`Elemento visible encontrado para ${step.element}, mostrando tooltip`);
    
    // Función para configurar el evento del botón siguiente
    function setupNextButton() {
      const nextButton = document.querySelector('.guide-next-button');
      if (nextButton) {
        // Crear un nuevo botón para reemplazar el actual y evitar duplicar listeners
        const newNextButton = document.createElement('button');
        newNextButton.className = 'guide-button guide-next-button';
        newNextButton.textContent = 'Siguiente';
        
        // Reemplazar el botón original
        if (nextButton.parentNode) {
          nextButton.parentNode.replaceChild(newNextButton, nextButton);
        }
        
        // Agregar el nuevo listener
        newNextButton.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          console.log(`Avanzando al paso ${index + 1}`);
          showGuideStep(index + 1);
        });
      }
    }
    
    // Mostrar el tooltip usando la instancia existente o creando una nueva
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
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setupNextButton();
          }, 100);
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
        zIndex: 9999,
        arrow: true,
        appendTo: document.body,
        onShow(instance) {
          // Scroll hacia el elemento para asegurarse de que sea visible
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setupNextButton();
          }, 100);
        }
      });
      
      currentTippyInstance.show();
    }
  }

  // Función para iniciar la guía de forma segura
  function startGuide() {
    console.log('Intentando iniciar guía de tooltips (versión mejorada)');
    
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
  
  // Función para avanzar manualmente al siguiente paso
  function manualAdvanceTooltip() {
    console.log('Avanzando manualmente al siguiente paso desde el paso actual');
    
    // Ocultar tooltip actual si existe
    if (currentTippyInstance) {
      currentTippyInstance.hide();
      currentTippyInstance = null;
    }
    
    // Asumimos que estamos atorados en el paso actual, así que avanzamos al siguiente
    processingStep = false; // Asegurar que no estemos bloqueados
    
    if (typeof currentStepIndex === 'number') {
      setTimeout(() => showGuideStep(currentStepIndex + 1), 200);
    } else {
      // Si por alguna razón currentStepIndex no está definido, empezamos desde el principio
      setTimeout(() => showGuideStep(0), 200);
    }
  }
  
  // Exponer funciones para que los scripts de diagnóstico puedan acceder a ellas
  window.manualAdvanceTooltip = manualAdvanceTooltip;
  window.startGuideTooltips = startGuide;
  window.showGuideStep = showGuideStep; // Exponemos showGuideStep directamente
  window.currentStepIndexTooltip = () => currentStepIndex;
  
  // Escuchar al evento para iniciar la guía al cerrar el modal de bienvenida
  document.addEventListener('modalWelcomeClosed', function () {
    console.log('Modal cerrado, iniciando guía de tooltips (versión mejorada)');
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
  
  // Detectar si no hay modal de bienvenida e iniciar directamente
  setTimeout(() => {
    const modalOverlay = document.querySelector('.modal-overlay');
    if (!modalOverlay || getComputedStyle(modalOverlay).display === 'none') {
      console.log('No se detectó modal de bienvenida, iniciando guía directamente (versión mejorada)');
      startGuide();
    }
  }, 1000);
  
  // Debug: mostrar cuando estemos listos
  console.log('Tippy-tooltips (MEJORADO): Configuración completada, esperando para iniciar la guía');
  
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
