document.addEventListener('DOMContentLoaded', function () {
  setupPageTooltips(
    [
      {
        element: '.btn-factura',
        title: 'Ver Factura',
        text: 'Al darle clic podrás visualizar la factura.',
        position: 'bottom',
        highlight: true
      },
      {
        element: '.container-message',
        title: 'Transacción Exitosa',
        text: 'Tu transacción ha sido procesada exitosamente. ¡Gracias por tu compra!',
        position: 'top',
        highlight: true
      }
    ],
    {
      title: '¡Compra Exitosa!',
      content: `
                <p>¡Felicitaciones! Tu compra ha sido procesada correctamente.</p>
                <p>A continuación, puedes ver tu factura o regresar a la página principal.</p>
            `
    }
  );
});
