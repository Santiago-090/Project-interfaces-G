document.addEventListener('DOMContentLoaded', function () {
  setupPageTooltips(
    [
      {
        element: 'form#myForm',
        title: 'Formulario de Datos',
        text: 'Por favor, ingresa tus datos para registrar la información de envío y facturación.',
        position: 'top',
        highlight: true
      },
      {
        element: '.nextBtn[href="indice.html"]',
        title: 'Regresar al Índice',
        text: 'Haz clic en este botón para regresar al índice principal de la tienda.',
        position: 'bottom',
        highlight: true
      },
      {
        element: '.nextBtn[href="transferencia.html"]',
        title: 'Continuar',
        text: 'Haz clic en este botón para continuar con el proceso de compra.',
        position: 'bottom',
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
        title: 'Documento de Identidad',
        text: 'Ingresa tu documento de identidad para registrar correctamente tu compra.',
        position: 'right',
        highlight: true
      }
    ],
    {
      title: 'Formulario de Pago',
      content: `
                <p>Has llegado al formulario de pago para finalizar tu compra.</p>
                <p>Por favor, completa todos los campos requeridos para procesar tu pedido correctamente.</p>
                <p>¿Quieres que te guiemos a través del proceso?</p>
            `
    }
  );
});
