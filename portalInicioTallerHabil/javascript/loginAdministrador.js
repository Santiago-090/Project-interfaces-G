// aqui se hace un funcion para que el administrador acceda al dashboard
function loguear() {
  let nombreUsuario = document.getElementById('nombreUsuario').value;
  let contraseña = document.getElementById('contraseña').value;

  if (nombreUsuario == 'adminurbanstreet' && contraseña == '1234') {
    window.location.href = 'dashboard.html';
  } else {
    alert('Nombre Usuario o Contraseña incorrecta');
  }
}

function olvidoContraseña() {
  alert('Recuerda, tu contraseña empieza 12****');
}
