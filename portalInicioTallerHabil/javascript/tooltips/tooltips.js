// Configuración global de tooltips
const tooltipConfig = {
  animationDuration: 300,
  tooltipClass: 'custom-tooltip',
  modalClass: 'welcome-modal',
  activeClass: 'tooltip-active',
  buttonClass: 'tooltip-button',
  showDelay: 300
};

// Clase para gestionar los tooltips y el modal de bienvenida
class TooltipSystem {
  constructor(options = {}) {
    this.options = { ...tooltipConfig, ...options };
    this.tooltips = [];
    this.currentIndex = 0;
    this.isActive = false;
    this.modalShown = false;

    this.tooltipContainer = document.createElement('div');
    this.tooltipContainer.id = 'tooltip-container';
    document.body.appendChild(this.tooltipContainer);

    this.createWelcomeModal();
  }

  setup(tooltipsData, welcomeData) {
    this.tooltips = tooltipsData.map((data) => ({
      ...data,
      element:
        typeof data.element === 'string' ? document.querySelector(data.element) : data.element
    }));

    this.welcomeData = welcomeData;

    if (welcomeData) {
      const modalTitle = document.querySelector('#welcome-modal-title');
      const modalContent = document.querySelector('#welcome-modal-content');

      if (modalTitle && welcomeData.title) {
        modalTitle.textContent = welcomeData.title;
      }

      if (modalContent && welcomeData.content) {
        modalContent.innerHTML = welcomeData.content;
      }
    }

    window.addEventListener('DOMContentLoaded', () => {
      this.showWelcomeModal();
    });
  }

  // Crea el modal de bienvenida
  createWelcomeModal() {
    const modal = document.createElement('div');
    modal.id = 'welcome-modal';
    modal.className = this.options.modalClass;

    modal.innerHTML = `
        <div class="modal-content">
          <span class="close-modal">&times;</span>
          <h2 id="welcome-modal-title">Bienvenido</h2>
          <div id="welcome-modal-content">
            <p>Bienvenido a nuestra tienda. Descubre todo lo que tenemos para ofrecerte.</p>
          </div>
          <div style="display: flex; gap: 0px; justify-content: center;">
          <button id="close-welcome" class="${this.options.buttonClass} secondary">Cerrar</button>
            <button id="start-tour" class="${this.options.buttonClass} primary">Iniciar recorrido</button>
          </div>
        </div>
      `;

    document.body.appendChild(modal);

    document.getElementById('start-tour').addEventListener('click', () => {
      this.hideWelcomeModal();
      setTimeout(() => {
        this.startTooltips();
      }, this.options.showDelay);
    });

    document.getElementById('close-welcome').addEventListener('click', () => {
      this.hideWelcomeModal();
    });

    document.querySelector('.close-modal').addEventListener('click', () => {
      this.hideWelcomeModal();
    });

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        this.hideWelcomeModal();
      }
    });
  }

  showWelcomeModal() {
    const modal = document.getElementById('welcome-modal');
    if (modal && !this.modalShown) {
      modal.style.display = 'flex';
      this.modalShown = true;
    }
  }

  hideWelcomeModal() {
    const modal = document.getElementById('welcome-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  startTooltips() {
    if (this.tooltips.length === 0) return;

    this.isActive = true;
    this.currentIndex = 0;
    this.showCurrentTooltip();
  }

  showCurrentTooltip() {
    if (!this.isActive || this.currentIndex >= this.tooltips.length) {
      this.endTooltips();
      return;
    }

    const tooltipData = this.tooltips[this.currentIndex];

    if (!tooltipData.element) {
      console.warn(`Elemento no encontrado para tooltip #${this.currentIndex}`);
      this.currentIndex++;
      this.showCurrentTooltip();
      return;
    }

    const tooltip = document.createElement('div');
    tooltip.className = this.options.tooltipClass;
    tooltip.id = `tooltip-${this.currentIndex}`;

    tooltip.innerHTML = `
            <div class="tooltip-arrow"></div>
            <div class="tooltip-content">
                <h4 class="tooltip-title">${tooltipData.title || ''}</h4>
                <p class="tooltip-text">${tooltipData.text || ''}</p>
                <div class="tooltip-buttons">
                    <button class="tooltip-button previous">${
                      tooltipData.previousText || 'Anterior'
                    }</button>
                    <button class="tooltip-button next">${
                      tooltipData.nextText || 'Siguiente'
                    }</button>
                    <button class="tooltip-button cancel">Cancelar</button>
                </div>
            </div>
        `;

    this.tooltipContainer.innerHTML = '';
    this.tooltipContainer.appendChild(tooltip);

    this.positionTooltip(tooltip, tooltipData.element, tooltipData.position || 'bottom');

    if (tooltipData.highlight) {
      tooltipData.element.classList.add('tooltip-highlight');
    }

    tooltip.querySelector('.tooltip-button.next').addEventListener('click', () => {
      if (tooltipData.highlight) {
        tooltipData.element.classList.remove('tooltip-highlight');
      }

      this.currentIndex++;
      this.showCurrentTooltip();
    });

    tooltip.querySelector('.tooltip-button.previous').addEventListener('click', () => {
      if (tooltipData.highlight) {
        tooltipData.element.classList.remove('tooltip-highlight');
      }

      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.showCurrentTooltip();
      }
    });

    tooltip.querySelector('.tooltip-button.cancel').addEventListener('click', () => {
      this.endTooltips();
    });

    if (this.currentIndex === 0) {
      tooltip.querySelector('.tooltip-button.previous').disabled = true;
      tooltip.querySelector('.tooltip-button.previous').classList.add('disabled');
    }

    if (this.currentIndex === this.tooltips.length - 1) {
      tooltip.querySelector('.tooltip-button.next').textContent = 'Finalizar';
    }

    setTimeout(() => {
      tooltip.classList.add(this.options.activeClass);
    }, 50);
  }

  positionTooltip(tooltip, targetElement, position) {
    const tooltipRect = tooltip.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    let top, left;
    let arrowClass = '';

    switch (position) {
      case 'top':
        top = targetRect.top + scrollTop - tooltipRect.height - 10;
        left = targetRect.left + scrollLeft + targetRect.width / 2 - tooltipRect.width / 2;
        arrowClass = 'arrow-bottom';
        break;
      case 'right':
        top = targetRect.top + scrollTop + targetRect.height / 2 - tooltipRect.height / 2;
        left = targetRect.right + scrollLeft + 10;
        arrowClass = 'arrow-left';
        break;
      case 'bottom':
        top = targetRect.bottom + scrollTop + 10;
        left = targetRect.left + scrollLeft + targetRect.width / 2 - tooltipRect.width / 2;
        arrowClass = 'arrow-top';
        break;
      case 'left':
        top = targetRect.top + scrollTop + targetRect.height / 2 - tooltipRect.height / 2;
        left = targetRect.left + scrollLeft - tooltipRect.width - 10;
        arrowClass = 'arrow-right';
        break;
      default:
        // Default to bottom
        top = targetRect.bottom + scrollTop + 10;
        left = targetRect.left + scrollLeft + targetRect.width / 2 - tooltipRect.width / 2;
        arrowClass = 'arrow-top';
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 0) {
      left = 10;
    } else if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width - 10;
    }

    if (top < 0) {
      if (position === 'top') {
        top = targetRect.bottom + scrollTop + 10;
        arrowClass = 'arrow-top';
      } else {
        top = 10;
      }
    } else if (top + tooltipRect.height > scrollTop + viewportHeight) {
      if (position === 'bottom') {
        top = targetRect.top + scrollTop - tooltipRect.height - 10;
        arrowClass = 'arrow-bottom';
      } else {
        top = scrollTop + viewportHeight - tooltipRect.height - 10;
      }
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;

    const arrow = tooltip.querySelector('.tooltip-arrow');
    if (arrow) {
      arrow.className = `tooltip-arrow ${arrowClass}`;
    }
  }

  endTooltips() {
    document.querySelectorAll('.tooltip-highlight').forEach((el) => {
      el.classList.remove('tooltip-highlight');
    });

    this.tooltipContainer.innerHTML = '';
    this.isActive = false;
  }

  reset() {
    this.tooltips = [];
    this.currentIndex = 0;
    this.isActive = false;
    this.modalShown = false;
    this.tooltipContainer.innerHTML = '';
  }
}

const tooltipSystem = new TooltipSystem();

function setupPageTooltips(tooltips, welcomeData) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      tooltipSystem.setup(tooltips, welcomeData);
    });
  } else {
    tooltipSystem.setup(tooltips, welcomeData);
  }
}
