// aqui se hace un funcion para que el administrador acceda al dashboard
function loguear(){

    let nombreUsuario = document.getElementById("nombreUsuario").value;
    let contraseña = document.getElementById("contraseña").value;
    // aqui se hace una codicion para compovar que el usuario y contraseña sean correctos 
    if(nombreUsuario == "adminurbanstreet" && contraseña == "1234"){
        // aqui manda al administrador al dashboard
        window.location.href = "dashboard.html";
    }
    else{
        alert("Nombre Usuario o Contraseña incorrecta"); // aqui hace aparecer un mensaje si el usuario y contraseña son incorrectos
    }
}
 
// aqui se hace una funcion para recordar la contraseña al administrador 
function olvidoContraseña(){

    alert("Recuerda, tu contraseña empieza 12****")
}