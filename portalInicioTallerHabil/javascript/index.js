document.addEventListener('DOMContentLoaded', () => {
  // Crear el modal de bienvenida
  const modal = document.createElement('div');
  modal.className = 'welcome-modal';

  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content';

  const welcomeMessage = document.createElement('h2');
  welcomeMessage.textContent = 'Bienvenidos a Urban Street';

  const welcomeDescription = document.createElement('p');
  welcomeDescription.textContent =
    'Nos destacamos por ofrecer productos a la moda con precios accesibles para todos.';

  const closeText = document.createElement('p');
  closeText.className = 'close-text';
  closeText.textContent = 'Haz clic en cualquier parte para continuar';

  modalContent.appendChild(welcomeMessage);
  modalContent.appendChild(welcomeDescription);
  modalContent.appendChild(closeText);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);
  // Cerrar el modal al hacer clic en cualquier parte
  modal.addEventListener('click', () => {
    modal.classList.add('fade-out');
    setTimeout(() => {
      document.body.removeChild(modal);

      showAutoTooltip();
    }, 400);
  });

  initializeInfoButtons();
});

// Función para mostrar una guía visual para los botones de información
function showInfoButtonsHint() {
  const infoButtons = document.querySelectorAll('.profile-image svg');

  infoButtons.forEach((button) => {
    button.classList.add('pulse-effect');

    const hint = document.createElement('div');
    hint.className = 'info-hint';
    hint.textContent = 'Clic aquí';

    const buttonParent = button.closest('.profile-image');
    buttonParent.appendChild(hint);

    // Eliminar la animación y las etiquetas después de unos segundos
    setTimeout(() => {
      button.classList.remove('pulse-effect');
      if (hint.parentNode) {
        buttonParent.removeChild(hint);
      }
    }, 5000);
  });
}

// Variable para rastrear qué botones de información han sido vistos
const seenInfoButtons = new Set();
let autoTooltipShown = false;

function showAutoTooltip() {
  if (autoTooltipShown) return;

  const firstInfoButton = document.querySelector('.card:first-child .profile-image svg');

  if (!firstInfoButton) return;

  firstInfoButton.classList.add('highlighted-info');

  const rect = firstInfoButton.getBoundingClientRect();

  // Crear el tooltip
  const tooltip = document.createElement('div');
  tooltip.className = 'info-tooltip auto-tooltip';

  const tooltipContent = document.createElement('div');
  tooltipContent.className = 'tooltip-content';

  const infoMessage = document.createElement('p');
  infoMessage.textContent =
    'A continuación, puedes explorar el catálogo con todos los productos que tenemos disponibles para ti.';

  const closeButton = document.createElement('button');
  closeButton.className = 'tooltip-button';
  closeButton.textContent = 'Entendido';
  closeButton.addEventListener('click', () => {
    autoTooltipShown = true;

    firstInfoButton.classList.remove('highlighted-info');

    tooltip.classList.add('fade-out');
    setTimeout(() => {
      if (tooltip.parentNode) {
        document.body.removeChild(tooltip);
      }
    }, 300);
  });

  tooltipContent.appendChild(infoMessage);
  tooltipContent.appendChild(closeButton);
  tooltip.appendChild(tooltipContent);

  tooltip.style.top = `${rect.bottom + window.scrollY + 5}px`;
  tooltip.style.left = `${rect.left + window.scrollX - 100}px`;

  document.body.appendChild(tooltip);

  showInfoButtonsHint();
}

// Función para los mensajes en los botones de información
function initializeInfoButtons() {
  const infoButtons = document.querySelectorAll('.profile-image svg');

  infoButtons.forEach((button) => {
    if (!button.dataset.infoId) {
      button.dataset.infoId = `info-${Math.random().toString(36).substring(2, 10)}`;
    }

    button.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const infoId = e.currentTarget.dataset.infoId;

      if (seenInfoButtons.has(infoId)) {
        const link = e.currentTarget.closest('a').getAttribute('href');
        if (link) {
          window.location.href = link;
        }
        return;
      }

      createInfoModal(e.currentTarget);
    });

    button.closest('a').style.cursor = 'pointer';
  });
}

// Función para crear un tooltip informativo
function createInfoModal(button) {
  const existingTooltip = document.querySelector('.info-tooltip');
  
  if (existingTooltip) {
    document.body.removeChild(existingTooltip);
    return;
  }

  autoTooltipShown = true;

  const infoId = button.dataset.infoId;
  seenInfoButtons.add(infoId);

  const link = button.closest('a').getAttribute('href');
  if (link) {
    window.location.href = link;
  }
}

// Función para cerrar el tooltip
function closeTooltip(e) {
  const tooltip = document.querySelector('.info-tooltip');
  if (tooltip && !e.target.closest('.info-tooltip')) {
    tooltip.classList.add('fade-out');
    setTimeout(() => {
      if (tooltip.parentNode) {
        document.body.removeChild(tooltip);
      }
      document.removeEventListener('click', closeTooltip);
    }, 300);
  }
}
