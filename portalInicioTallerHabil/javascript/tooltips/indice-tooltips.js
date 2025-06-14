document.addEventListener('DOMContentLoaded', function () {
  setupPageTooltips(
    [
      {
        element: '.card:first-child',
        title: 'Categorías',
        text: 'Puedes explorar el catálogo con todos los productos que tenemos disponibles para ti.',
        position: 'bottom',
        highlight: true
      },
      {
        element: '.icon-admin',
        title: 'Acceso administrativo',
        text: 'Área reservada para administradores de la tienda.',
        position: 'bottom',
        highlight: true
      }
    ],
    {
      title: '¡Bienvenido a Urban Street!',
      content: `
                <p>Bienvenidos a Urban Street. Nos destacamos por ofrecer productos a la moda con precios accesibles para todos.</p>
                <p>¿Te gustaría hacer un recorrido rápido por las funciones principales de nuestra página?</p>
            `
    }
  );
});
