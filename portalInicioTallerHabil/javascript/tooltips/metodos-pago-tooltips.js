document.addEventListener('DOMContentLoaded', function () {
  setupPageTooltips(
    [
      {
        element: '.qr-code img',
        title: 'Código QR de Pago',
        text: 'Escanea este código QR para realizar tu pago de forma rápida y segura.',
        position: 'right',
        highlight: true
      },
      {
        element: '.payment-instructions',
        title: 'Instrucciones',
        text: 'Sigue estas instrucciones para completar tu pago correctamente.',
        position: 'bottom',
        highlight: true
      }
    ],
    {
      title: 'Pago con QR',
      content: `
                <p>Utiliza tu app bancaria para escanear el código QR y completar el pago de manera rápida y segura.</p>
                <p>Una vez realizado el pago, recibirás una confirmación en pantalla.</p>
            `
    }
  );
});
