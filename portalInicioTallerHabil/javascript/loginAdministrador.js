// Función para mostrar notificaciones personalizadas
function mostrarNotificacion(texto, colorFondo = '#2E7D32') {
  const noti = document.getElementById('notificacion');
  noti.innerText = texto;
  noti.style.backgroundColor = colorFondo;
  noti.classList.remove('hidden');
  noti.classList.add('show');

  setTimeout(() => {
    noti.classList.remove('show');
    noti.classList.add('hidden');
  }, 4000);
}

// Función para validar login del administrador
function loguear() {
  const nombreUsuarioInput = document.getElementById('nombreUsuario');
  const contraseñaInput = document.getElementById('contraseña');

  const nombreUsuario = nombreUsuarioInput.value.trim();
  const contraseña = contraseñaInput.value.trim();

  const usuarioValido = 'adminurbanstreet';
  const contraseñaValida = '1234';

  if (nombreUsuario === usuarioValido && contraseña === contraseñaValida) {
    window.location.href = 'dashboard.html';
  } else {
    if (nombreUsuario !== usuarioValido && contraseña !== contraseñaValida) {
      mostrarNotificacion('🚧 Usuario y contraseña incorrectos', '#E53935');
    } else if (nombreUsuario !== usuarioValido) {
      mostrarNotificacion('☢️ Nombre de usuario incorrecto', '#E53935');
    } else if (contraseña !== contraseñaValida) {
      mostrarNotificacion('☢️ Contraseña incorrecta', '#E53935');
    }
  }
}

// Función para mostrar pista de la contraseña
function olvidoContraseña() {
  mostrarNotificacion('🔐 Pista: la contraseña empieza con 12****', '#FFA000');
}
