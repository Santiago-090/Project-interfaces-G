document.addEventListener('DOMContentLoaded', function () {
  setupPageTooltips(
    [
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
        text: 'Aquí puedes consultar los productos registrados y añadir nuevos artículos al catálogo.',
        position: 'bottom',
        highlight: true
      },
      {
        element: '.icon-product',
        title: 'Gestión de Productos',
        text: 'Aquí puedes consultar los productos registrados y añadir nuevos artículos al catálogo.',
        position: 'bottom',
        highlight: true
      }
    ],



    
    {
      title: 'Panel de Administración',
      content: `
                <p>Bienvenido al panel de administración de Urban Street.</p>
                <p>Desde aquí puedes gestionar productos, categorías y otras funciones administrativas de la tienda.</p>
                <p>¿Te gustaría conocer las principales secciones de este panel?</p>
            `
    }
  );
});
