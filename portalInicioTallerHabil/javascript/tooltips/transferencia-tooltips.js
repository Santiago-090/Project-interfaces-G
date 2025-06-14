document.addEventListener('DOMContentLoaded', function () {
  setupPageTooltips(
    [
      {
        element: '.btn-regresar',
        title: 'Regresar',
        text: 'Si necesitas realizar algún cambio pulsa este botón "Regresar".',
        position: 'bottom',
        highlight: true
      },
      {
        element: '.btn-continuar',
        title: 'Continuar',
        text: 'Si estás seguro de tus datos pulsa este botón "Continuar".',
        position: 'bottom',
        highlight: true
      }
    ],
    {
      title: 'Confirma tu Información',
      content: `
                <p>Por favor, confirma que todos tus datos son correctos antes de proceder al pago.</p>
                <p>Si necesitas hacer algún cambio, puedes regresar al formulario anterior.</p>
            `
    }
  );
});
