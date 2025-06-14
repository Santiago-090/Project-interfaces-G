document.addEventListener('DOMContentLoaded', function () {
  setupPageTooltips(
    [
      {
        element: '.indice',
        title: 'Volver al Inicio',
        text: 'Al darle clic te llevará a la página principal de la tienda.',
        position: 'bottom',
        highlight: true
      },
      {
        element: '.details',
        title: 'Detalles de tu Compra',
        text: 'Aquí puedes ver todos los detalles de tu compra, productos adquiridos y valores.',
        position: 'right',
        highlight: true
      },
      {
        element: '.btn-imprimir',
        title: 'Imprimir Factura',
        text: 'Haz clic aquí para imprimir o guardar tu factura como PDF.',
        position: 'bottom',
        highlight: true
      }
    ],
    {
      title: 'Tu Factura',
      content: `
                <p>Esta es la factura de tu compra reciente.</p>
                <p>Puedes guardarla para tus registros o imprimirla si lo necesitas.</p>
            `
    }
  );
});
