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
    position: 'right',
    highlight: true
  },
  {
    element: '.icon-product',
    title: 'Gestión de Productos',
    text: 'Aquí puedes administrar los productos de tu catálogo.',
    position: 'right',
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
    element: '.btn-producto',
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
    element: '.dateCategotyInputs',
    title: 'Campos de Categoría',
    text: 'En estos campos podemos agregar una imagen, un ID y un nombre que es el que toma la categoría.',
    position: 'right',
    highlight: true
  },
  {
    element: '.addCategotyButton',
    title: 'Agregar Categoría',
    text: 'Al darle clic se creará una nueva categoría.',
    position: 'right',
    highlight: true
  },
  {
    element: '.close',
    title: 'Cerrar Modal',
    text: 'Haz clic aquí para cerrar el modal de agregar categoría.',
    position: 'right',
    highlight: true
  }
];

const productModalTooltips = [
  {
    element: '.dateProductInputs',
    title: 'Campos del Producto',
    text: 'En estos campos podemos agregar una imagen, un nombre, la descripción, el precio, la cantidad y la categoría a la cual pertenece el nuenvo producto',
    position: 'right',
    highlight: true
  },
  {
    element: '.addProductButton',
    title: 'Agregar Producto',
    text: 'Al darle clic se creará un nuevo producto.',
    position: 'right',
    highlight: true
  },
  {
    element: '.closeProduct',
    title: 'Cerrar Modal',
    text: 'Haz clic aquí para cerrar el modal de agregar categoría.',
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
  tooltipSystem.reset();
  tooltipSystem.setup(tooltips, null);

  setTimeout(() => {
    tooltipSystem.startTooltips();
  }, 300);
}

document.addEventListener('DOMContentLoaded', function () {
  setupPageTooltips(initialTooltips, welcomeModalData);

  document.querySelector('.icon-category').addEventListener('click', function () {
    setTimeout(() => {
      showNewTooltips(categoryTooltips);
    }, 300);
  });

  document.querySelector('.icon-product').addEventListener('click', function () {
    setTimeout(() => {
      showNewTooltips(productTooltips);
    }, 300);
  });

  document.querySelectorAll('.btn-agregar').forEach((btn) => {
    btn.addEventListener('click', function () {
      if (document.getElementById('categorias').style.display !== 'none') {
        setTimeout(() => {
          showNewTooltips(categoryModalTooltips);
        }, 500);
      } else if (document.getElementById('productos').style.display !== 'none') {
        setTimeout(() => {
          showNewTooltips(productModalTooltips);
        }, 500);
      }
    });
  });

  // Event listener para cerrar los modales y volver a los tooltips de sección
  document.querySelectorAll('.close').forEach((close) => {
    close.addEventListener('click', function () {
      if (document.getElementById('categorias').style.display !== 'none') {
        setTimeout(() => {
          showNewTooltips(categoryTooltips);
        }, 300);
      } else if (document.getElementById('productos').style.display !== 'none') {
        setTimeout(() => {
          showNewTooltips(productTooltips);
        }, 300);
      } else {
        setTimeout(() => {
          showNewTooltips(initialTooltips);
        }, 300);
      }
    });
  });
});
