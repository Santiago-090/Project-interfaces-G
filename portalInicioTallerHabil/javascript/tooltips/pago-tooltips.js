document.addEventListener('DOMContentLoaded', function () {
  setupPageTooltips(
    [
      {
        element: 'form#myForm',
        title: 'Formulario de Datos',
        text: 'Por favor, ingresa tus datos para registrar la información de envío y facturación.',
        position: 'right',
        highlight: true
      },
      {
        element: '.details.personal',
        title: 'Datos Personales',
        text: 'En esta sección debes ingresar tus datos personales básicos para el registro de tu compra.',
        position: 'right',
        highlight: true
      },
      {
        element: '.details.ID',
        title: 'Datos de Ubicación',
        text: 'En esta sección debes ingresar tu dirección de envío y facturación.',
        position: 'right',
        highlight: true
      },
      {
        element: '.backBtn1',
        title: 'Regresar al Índice',
        text: 'Haz clic en este botón para regresar al índice principal de la tienda.',
        position: 'bottom',
        highlight: true
      },
      {
        element: '.nextBtn1',
        title: 'Continuar',
        text: 'Haz clic en este botón para continuar con el proceso de compra.',
        position: 'bottom',
        highlight: true
      }
    ],
    {
      title: 'Formulario de Pago',
      content: `
                <p>Por favor, ingresa tus datos para registrar la información de envío y facturación.</p>
                <p>¿Quieres que te guiemos a través del proceso?</p>
            `
    }
  );
});
