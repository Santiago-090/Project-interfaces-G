// Función para abrir el modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

// Función para cerrar el modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Función para agregar una categoría
function agregarCategoria() {
    var id = document.getElementById('idInput').value;
    var nombre = document.getElementById('nombreInput').value;
    var imagen = document.getElementById('imagenCategoriaInput').files[0];

    // Validación de datos
    var idValido = /^[0-9]+$/.test(id);
    var nombreValido = /^[A-Za-z\s]+$/.test(nombre);

    if (idValido && nombreValido && imagen) {
        var categoriaListaTabla = document.getElementById('categoriaListaTabla');

        var fila = categoriaListaTabla.insertRow();

        // Insertar imagen
        var cellImagen = fila.insertCell();
        var img = document.createElement('img');
        img.src = URL.createObjectURL(imagen);
        img.height = 50;
        img.onload = function() {
            URL.revokeObjectURL(img.src); // Liberar memoria
        };
        cellImagen.appendChild(img);

        // Insertar ID
        var cellId = fila.insertCell();
        cellId.textContent = id;

        // Insertar Nombre
        var cellNombre = fila.insertCell();
        cellNombre.textContent = nombre;

        // Insertar botón de eliminar
        var cellEliminar = fila.insertCell();
        var btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = function() {
            eliminarFila(this);
        };

        // Aplicar estilos al botón de eliminar
        btnEliminar.style.padding = '5px 10px';
        btnEliminar.style.backgroundColor = '#dc3545'; // Color de fondo rojo
        btnEliminar.style.color = 'white'; // Color de texto blanco
        btnEliminar.style.border = 'none'; // Sin borde
        btnEliminar.style.borderRadius = '3px'; // Bordes redondeados
        btnEliminar.style.cursor = 'pointer';
        btnEliminar.style.display = 'block'; // Convertir a bloque para centrar
        btnEliminar.style.margin = '0 auto'; // Establecer margen automático para centrar

        // Cambio de color de fondo al pasar el cursor
        btnEliminar.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#c82333';
        });
        // Restaurar color de fondo al salir del cursor
        btnEliminar.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#dc3545';
        });
        cellEliminar.appendChild(btnEliminar);

        // Limpiar campos de entrada
        document.getElementById('idInput').value = '';
        document.getElementById('nombreInput').value = '';
        document.getElementById('imagenCategoriaInput').value = '';

        // Cerrar el modal
        closeModal('categoriaModal');
    } else {
        const campos = ['imagenCategoriaInput', 'idInput', 'nombreInput'];
        limpiarErrores(campos);

        const imagen = document.getElementById('imagenCategoriaInput').files[0];
        const id = document.getElementById('idInput').value.trim();
        const nombre = document.getElementById('nombreInput').value.trim();

        let ok = true;
        
        // condiciones para mirar si los campos esten correctos 
        if (!imagen) {
            document.getElementById('error-imagenCategoriaInput').innerText = '🔍 Selecciona una imagen.';
            ok = false;
        }

        if (!/^[0-9]+$/.test(id)) {
            document.getElementById('error-idInput').innerText = '❌ El ID debe contener solo números.';
            document.getElementById('idInput').classList.add('field-error');
            ok = false;
        }

        if (!/^[A-Za-z\s]+$/.test(nombre)) {
            document.getElementById('error-nombreInput').innerText = '❌ El nombre debe contener solo letras.';
            document.getElementById('nombreInput').classList.add('field-error');
            ok = false;
        }

        if (!ok) return;

    }
}

// Función para agregar un producto
function agregarProducto() {
    var imagen = document.getElementById('imagenInput').files[0];
    var nombre = document.getElementById('nombreProductoInput').value;
    var descripcion = document.getElementById('descripcionInput').value;
    var precio = document.getElementById('precioInput').value;
    var cantidad = document.getElementById('cantidadInput').value;
    var categoria = document.getElementById('categoriaProductoInput').value;

    // Validación de datos
    var nombreValido = /^[A-Za-z\s]+$/.test(nombre);
    var descripcionValida = /^[A-Za-z\s]+$/.test(descripcion);
    var categoriaValida = /^[A-Za-z\s]+$/.test(categoria);
    var precioValido = /^[0-9]+$/.test(precio);
    var cantidadValida = /^[0-9]+$/.test(cantidad);

    if (imagen && nombreValido && descripcionValida && precioValido && cantidadValida && categoriaValida) {
        var productoListaTabla = document.getElementById('productoListaTabla');

        var fila = productoListaTabla.insertRow();

        // Insertar imagen
        var cellImagen = fila.insertCell();
        var img = document.createElement('img');
        img.src = URL.createObjectURL(imagen);
        img.height = 50;
        img.onload = function() {
            URL.revokeObjectURL(img.src); // Liberar memoria
        };
        cellImagen.appendChild(img);

        // Insertar Nombre
        var cellNombre = fila.insertCell();
        cellNombre.textContent = nombre;

        // Insertar Descripción
        var cellDescripcion = fila.insertCell();
        cellDescripcion.textContent = descripcion;

        // Insertar Precio
        var cellPrecio = fila.insertCell();
        cellPrecio.textContent = precio;

        // Insertar Cantidad
        var cellCantidad = fila.insertCell();
        cellCantidad.textContent = cantidad;

        // Insertar Categoría
        var cellCategoria = fila.insertCell();
        cellCategoria.textContent = categoria;

        // Insertar botón de eliminar
        var cellEliminar = fila.insertCell();
        var btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = function() {
            eliminarFila(this);
        };
        
        // Aplicar estilos al botón de eliminar
        btnEliminar.style.padding = '10px 10px';
        btnEliminar.style.backgroundColor = '#e53935'; // Color de fondo rojo
        btnEliminar.style.color = 'white'; // Color de texto blanco
        btnEliminar.style.border = 'none'; // Sin borde
        btnEliminar.style.borderRadius = '3px'; // Bordes redondeados
        btnEliminar.style.cursor = 'pointer';
        btnEliminar.style.display = 'block'; // Convertir a bloque para centrar
        btnEliminar.style.margin = '0 auto'; // Establecer margen automático para centrar

        // Cambio de color de fondo al pasar el cursor
        btnEliminar.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'red';
        });
        // Restaurar color de fondo al salir del cursor
        btnEliminar.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '#e53935';
        });
        cellEliminar.appendChild(btnEliminar);

        // Limpiar campos de entrada
        document.getElementById('imagenInput').value = '';
        document.getElementById('nombreProductoInput').value = '';
        document.getElementById('descripcionInput').value = '';
        document.getElementById('precioInput').value = '';
        document.getElementById('cantidadInput').value = '';
        document.getElementById('categoriaProductoInput').value = '';

        // Cerrar el modal
        closeModal('productoModal');
    } else {
        const campos = ['imagenInput', 'nombreProductoInput', 'descripcionInput', 'precioInput', 'cantidadInput', 'categoriaProductoInput'];
        limpiarErrores(campos);

        const imagen = document.getElementById('imagenInput').files[0];
        const nombre = document.getElementById('nombreProductoInput').value.trim();
        const descripcion = document.getElementById('descripcionInput').value.trim();
        const precio = document.getElementById('precioInput').value.trim();
        const cantidad = document.getElementById('cantidadInput').value.trim();
        const categoria = document.getElementById('categoriaProductoInput').value.trim();

        let ok = true;
        
         // condiciones para mirar si los campos esten correctos 
        if (!imagen) {
            document.getElementById('error-imagenInput').innerText = '🔍 Selecciona una imagen.';
            ok = false;
        }

        if (!/^[A-Za-z\s]+$/.test(nombre)) {
            document.getElementById('error-nombreProductoInput').innerText = '❌ Nombre solo debe contener letras.';
            document.getElementById('nombreProductoInput').classList.add('field-error');
            ok = false;
        }

        if (!/^[A-Za-z\s]+$/.test(descripcion)) {
            document.getElementById('error-descripcionInput').innerText = '❌ Descripción solo debe contener letras.';
            document.getElementById('descripcionInput').classList.add('field-error');
            ok = false;
        }

        if (!/^[0-9]+$/.test(precio)) {
            document.getElementById('error-precioInput').innerText = '❌ Precio debe ser numérico.';
            document.getElementById('precioInput').classList.add('field-error');
            ok = false;
        }

        if (!/^[0-9]+$/.test(cantidad)) {
            document.getElementById('error-cantidadInput').innerText = '❌ Cantidad debe ser numérica.';
            document.getElementById('cantidadInput').classList.add('field-error');
            ok = false;
        }

        if (!/^[A-Za-z\s]+$/.test(categoria)) {
            document.getElementById('error-categoriaProductoInput').innerText = '❌ Categoría solo debe contener letras.';
            document.getElementById('categoriaProductoInput').classList.add('field-error');
            ok = false;
        }

        if (!ok) return;
    }
}

// Función para eliminar una fila
function eliminarFila(button) {
    var fila = button.parentNode.parentNode;
    fila.parentNode.removeChild(fila);
}

// Función para mostrar y ocultar el menú
function toggleMenu() {
    var menu = document.getElementById('menuDashboard');
    menu.classList.toggle('closed');
}

// Función para mostrar y ocultar categorías
function toggleCategories() {
    var categorias = document.getElementById('categorias');
    var productos = document.getElementById('productos');
    categorias.style.display = categorias.style.display === 'none' ? 'block' : 'none';
    productos.style.display = 'none';
}

// Función para mostrar y ocultar productos
function toggleProductos() {
    var productos = document.getElementById('productos');
    var categorias = document.getElementById('categorias');
    if (productos.style.display === 'none') {
        productos.style.display = 'block';
        categorias.style.display = 'none'; // Ocultar categorías si están visibles
    } else {
        productos.style.display = 'none';
    }
}

// se hace una funcion para mandar al usuario a la pagina principal 
function irAPagina_indice() {
    window.location.href = "indice.html";
  }
  
// funciones para los mensajes de error   
function mostrarNotificacion(texto, colorFondo = "#E53935") {
    const noti = document.getElementById("notificacion");
    noti.innerText = texto;
    noti.style.backgroundColor = colorFondo;
    noti.classList.remove("hidden");
    noti.classList.add("show");

    setTimeout(() => {
        noti.classList.remove("show");
        noti.classList.add("hidden");
    }, 4000);
}

// funcion para los mensajes de error de cada campo 
function limpiarErrores(ids) {
  ids.forEach(id => {
    const input = document.getElementById(id);
    if (input) input.classList.remove('field-error');
    const errorDiv = document.getElementById(`error-${id}`);
    if (errorDiv) errorDiv.innerText = '';
  });
}
