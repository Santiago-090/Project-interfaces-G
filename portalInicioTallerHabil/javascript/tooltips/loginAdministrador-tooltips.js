document.addEventListener('DOMContentLoaded', function () {
  setupPageTooltips(
    [
      {
        element: '.credenciales',
        title: 'Credenciales de Administrador',
        text: 'Ingresa aquí las credenciales de usuario para acceder al panel de administración.',
        position: 'right',
        highlight: true
      },
      {
        element: '.forget-section',
        title: 'Recuperar Contraseña',
        text: 'Si olvidaste la contraseña, da clic aquí para restablecerla.',
        position: 'bottom',
        highlight: true
      },
      {
        element: '.btn-login',
        title: 'Iniciar Sesión',
        text: 'Si las credenciales son correctas, al darle clic en este botón podrás ingresar al panel admin.',
        position: 'bottom',
        highlight: true
      },
      {
        element: '.account-creation',
        title: 'Volver al Índice',
        text: 'Al darle clic a este botón regresaremos a la página principal de la tienda.',
        position: 'bottom',
        highlight: true
      }
    ],
    {
      title: 'Panel de Administrador',
      content: `
                <p>Ingresa tus credenciales</p>
                <p>¿Te gustaría un recorrido por las opciones disponibles?</p>
            `
    }
  );
});
