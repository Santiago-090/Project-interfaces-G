document.addEventListener('DOMContentLoaded', function () {
  setupPageTooltips(
    [
      {
        element: '.logo',
        title: 'Regresar',
        text: 'Escoge el método de pago y escanea el QR.',
        position: 'bottom',
        highlight: true
      }
    ],
    {
      title: 'Confirma tu Información',
      content: `
                <p>A continuación, te mostramos los métodos de pago disponibles.</p>
            `
    }
  );
});
