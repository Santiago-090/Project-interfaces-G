document.addEventListener('DOMContentLoaded', function () {
  setupPageTooltips(
    [
      {
        element: '.btn-DirigirFactura',
        title: 'Ver Factura',
        text: 'Al darle clic podrás visualizar la factura.',
        position: 'bottom',
        highlight: true
      }
    ],
    {
      title: '¡Compra Exitosa!',
      content: `
                <p>A continuación, puedes ver tu factura o regresar a la página principal.</p>
            `
    }
  );
});
