// Definición de los diferentes conjuntos de tooltips
const initialTooltips = [
  {
    element: '.toggle',
    title: 'Menú de Navegación',
    text: 'Este botón permite mostrar u ocultar las opciones del panel de administración.',
    position: 'right',
    highlight: true
  },
  {
    element: '.icon-menu',
    title: 'Menú Principal',
    text: 'Haz clic aquí para regresar al índice principal del panel.',
    position: 'right',
    highlight: true
  },
  {
    element: '.icon-category',
    title: 'Gestión de Categorías',
    text: 'Aquí puedes administrar las categorías de productos de tu tienda.',
    position: 'bottom',
    highlight: true
  },
  {
    element: '.icon-product',
    title: 'Gestión de Productos',
    text: 'Aquí puedes administrar los productos de tu catálogo.',
    position: 'bottom',
    highlight: true
  }
];

const categoryTooltips = [
  {
    element: '.btn-agregar',
    title: 'Agregar Categoría',
    text: 'Haz clic aquí para añadir una nueva categoría a tu tienda.',
    position: 'bottom',
    highlight: true
  },
  {
    element: '#tablaCategorias',
    title: 'Lista de Categorías',
    text: 'Aquí puedes ver todas las categorías disponibles en tu tienda.',
    position: 'top',
    highlight: true
  }
];

const productTooltips = [
  {
    element: '.btn-agregar',
    title: 'Agregar Producto',
    text: 'Haz clic aquí para añadir un nuevo producto a tu catálogo.',
    position: 'bottom',
    highlight: true
  },
  {
    element: '#tablaProductos',
    title: 'Lista de Productos',
    text: 'Aquí puedes ver todos los productos disponibles en tu tienda.',
    position: 'top',
    highlight: true
  }
];

const categoryModalTooltips = [
  {
    element: '#imagenCategoriaInput',
    title: 'Imagen de la Categoría',
    text: 'Selecciona una imagen representativa para esta categoría.',
    position: 'right',
    highlight: true
  },
  {
    element: '#idInput',
    title: 'ID de la Categoría',
    text: 'Ingresa un identificador único para esta categoría. Solo se permiten números.',
    position: 'right',
    highlight: true
  },
  {
    element: '#nombreInput',
    title: 'Nombre de la Categoría',
    text: 'Ingresa un nombre descriptivo para esta categoría. Solo se permiten letras.',
    position: 'right',
    highlight: true
  }
];

const productModalTooltips = [
  {
    element: '#imagenInput',
    title: 'Imagen del Producto',
    text: 'Selecciona una imagen representativa para este producto.',
    position: 'right',
    highlight: true
  },
  {
    element: '#nombreProductoInput',
    title: 'Nombre del Producto',
    text: 'Ingresa un nombre descriptivo para este producto.',
    position: 'right',
    highlight: true
  },
  {
    element: '#descripcionInput',
    title: 'Descripción del Producto',
    text: 'Proporciona una descripción detallada del producto.',
    position: 'right',
    highlight: true
  },
  {
    element: '#precioInput',
    title: 'Precio del Producto',
    text: 'Ingresa el precio de venta de este producto.',
    position: 'right',
    highlight: true
  },
  {
    element: '#cantidadInput',
    title: 'Cantidad en Inventario',
    text: 'Indica la cantidad disponible de este producto.',
    position: 'right',
    highlight: true
  },
  {
    element: '#categoriaProductoInput',
    title: 'Categoría del Producto',
    text: 'Selecciona a qué categoría pertenece este producto.',
    position: 'right',
    highlight: true
  }
];

const welcomeModalData = {
  title: 'Panel de Administración',
  content: `
    <p>Bienvenido al panel de administración de Urban Street.</p>
    <p>Desde aquí puedes gestionar productos, categorías y otras funciones administrativas de la tienda.</p>
    <p>¿Te gustaría conocer las principales secciones de este panel?</p>
  `
};

// Función para limpiar tooltips existentes y mostrar nuevos
function showNewTooltips(tooltips) {
  // Resetear el sistema de tooltips
  tooltipSystem.reset();
  
  // Configurar y mostrar nuevos tooltips
  tooltipSystem.setup(tooltips, null);
  
  // Iniciar la visualización de tooltips
  setTimeout(() => {
    tooltipSystem.startTooltips();
  }, 300);
}

document.addEventListener('DOMContentLoaded', function () {
  // Configurar tooltips iniciales y modal de bienvenida
  setupPageTooltips(initialTooltips, welcomeModalData);
  
  // Agregar event listeners para cambiar dinámicamente los tooltips
  
  // Tooltips para categorías
  document.querySelector('.icon-category').addEventListener('click', function() {
    // Permitir que se complete la visualización del DOM antes de mostrar tooltips
    setTimeout(() => {
      showNewTooltips(categoryTooltips);
    }, 300);
  });
  
  // Tooltips para productos
  document.querySelector('.icon-product').addEventListener('click', function() {
    // Permitir que se complete la visualización del DOM antes de mostrar tooltips
    setTimeout(() => {
      showNewTooltips(productTooltips);
    }, 300);
  });
  
  // Event listener para el modal de categorías
  document.querySelectorAll('.btn-agregar').forEach(btn => {
    btn.addEventListener('click', function() {
      // Identificar qué modal se está abriendo
      if (document.getElementById('categorias').style.display !== 'none') {
        // Modal de categoría
        setTimeout(() => {
          showNewTooltips(categoryModalTooltips);
        }, 500);
      } else if (document.getElementById('productos').style.display !== 'none') {
        // Modal de producto
        setTimeout(() => {
          showNewTooltips(productModalTooltips);
        }, 500);
      }
    });
  });
  
  // Event listener para cerrar los modales y volver a los tooltips de sección
  document.querySelectorAll('.close').forEach(close => {
    close.addEventListener('click', function() {
      // Identificar de qué sección venimos
      if (document.getElementById('categorias').style.display !== 'none') {
        // Volver a tooltips de categoría
        setTimeout(() => {
          showNewTooltips(categoryTooltips);
        }, 300);
      } else if (document.getElementById('productos').style.display !== 'none') {
        // Volver a tooltips de producto
        setTimeout(() => {
          showNewTooltips(productTooltips);
        }, 300);
      } else {
        // Volver a tooltips iniciales
        setTimeout(() => {
          showNewTooltips(initialTooltips);
        }, 300);
      }
    });
  });
});
