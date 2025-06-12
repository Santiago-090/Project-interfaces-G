 // Variable de arreglos de Productos
let allProducts = [];

document.addEventListener("DOMContentLoaded", function() {
    // Obtener elementos relevantes del DOM
    const btnCart = document.querySelector('.container-cart-icon');
    const containerCartProducts = document.querySelector('.container-cart-products');
    const botonAgregar = document.querySelector('.container4 button');
    const inputCantidad = document.querySelector('.formulario__input');
    const contadorProductos = document.getElementById('contador-productos');
    const cartEmpty = document.querySelector('.cart-empty');
    const rowProduct = document.querySelector('.row-product');
    const cartTotal = document.querySelector('.cart-total');
    const valorTotal = document.querySelector('.total-pagar');
    const countProducts = document.querySelector('#contador-productos');

    // Cantidad máxima permitida para agregar al carrito
    const CANTIDAD_MAXIMA = document.querySelector('.Cantidades').textContent;

    // Manejador de evento para el botón de agregar al carrito
    botonAgregar.addEventListener('click', function() {
        const cantidad = parseInt(inputCantidad.value);

        if (cantidad > 0 && cantidad <= CANTIDAD_MAXIMA && !isNaN(cantidad)) {
            // Obtener información del producto (este es un ejemplo, debes adaptarlo según tu estructura HTML)
            const titulo = document.querySelector('.titulo').textContent;
            const precio = document.querySelector('.precio').textContent;

            const infoProduct = {
                quantity: cantidad,
                title: titulo,
                price: precio,
            };

            const exists = allProducts.some(product => product.title === infoProduct.title);

            // se hace la condicion para tener un limite de añadir al carrito 
            if (exists) {
                let excede = false;
                const products = allProducts.map(product => {
                if (product.title === infoProduct.title) {
                    if (product.quantity + cantidad <= parseInt(CANTIDAD_MAXIMA)) {
                        product.quantity += cantidad;
            }   else {
                excede = true;
                    }
                }
                return product;
                });

                if (excede) {
                    mostrarNotificacion(`No puedes añadir más de ${CANTIDAD_MAXIMA} unidades disponibles.`, "#E53935");
                    return; // <- importante para evitar mostrar 'añadido' si no se añadió
                }

            allProducts = [...products];
            } else {
                if (cantidad <= parseInt(CANTIDAD_MAXIMA)) {
                    allProducts.push(infoProduct);
                } else {
                    mostrarNotificacion(`No puedes añadir más de ${CANTIDAD_MAXIMA} unidades disponibles.`, "#E53935");
                    return;
                }
            }

            mostrarNotificacion("Producto añadido al carrito 🛒", "#2E7D32"); showHTML();
        } else {
            mostrarMensajeError(`Por favor, ingrese una cantidad de los productos disponibles en la descripcion`, "#E53935");
        }
    });

    // Manejador de evento para el icono del carrito
    btnCart.addEventListener('click', () => {
        containerCartProducts.classList.toggle('hidden-cart');
    });

    // Manejador de evento para eliminar producto del carrito
    rowProduct.addEventListener('click', e => {
        if (e.target.classList.contains('icon-close')) {
            const product = e.target.parentElement;
            const title = product.querySelector('p').textContent;
            allProducts = allProducts.filter(product => product.title !== title);
            showHTML();
        }
    });

    // Función para mostrar HTML del carrito
    const showHTML = () => {
        if (!allProducts.length) {
            cartEmpty.classList.remove('hidden');
            rowProduct.classList.add('hidden');
            cartTotal.classList.add('hidden');
        } else {
            cartEmpty.classList.add('hidden');
            rowProduct.classList.remove('hidden');
            cartTotal.classList.remove('hidden');
        }

        // Limpiar HTML
        rowProduct.innerHTML = '';

        let total = 0;
        let totalOfProducts = 0;

        allProducts.forEach(product => {
            const containerProduct = document.createElement('div');
            containerProduct.classList.add('cart-product');

            containerProduct.innerHTML = `
                <div class="info-cart-product">
                    <span class="cantidad-producto-carrito">${product.quantity}</span>
                    <p class="titulo-producto-carrito">${product.title}</p>
                    <span class="precio-producto-carrito">${product.price}</span>
                </div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="icon-close"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            `;

            rowProduct.prepend(containerProduct);

            total += parseInt(product.quantity * product.price.slice(1));
            totalOfProducts += product.quantity;
        });

        valorTotal.innerText = `$${total}`;
        countProducts.innerText = totalOfProducts;
    };
});

function mostrarNotificacion(texto, colorFondo) {
    const noti = document.getElementById("notificacion");
    noti.innerText = texto;
    noti.style.backgroundColor = colorFondo;
    noti.classList.remove("hidden");
    noti.classList.add("show");

    setTimeout(() => {
        noti.classList.remove("show");
        noti.classList.add("hidden");
    }, 3000);
}

function mostrarMensajeError(texto) {
  const noti = document.getElementById("notificacion");
  noti.innerText = texto;
  noti.style.backgroundColor = "#E53935";
  noti.classList.remove("hidden");
  noti.classList.add("show");

  setTimeout(() => {
    noti.classList.remove("show");
    noti.classList.add("hidden");
    noti.innerText = "Producto añadido al carrito 🛒";
    noti.style.backgroundColor = "#2E7D32";
  }, 3000);
}


// se hace una funcion para mandar al usuario a la pagina principal 
function irAPagina_indice() {
    window.location.href = "indice.html";
  }

// se hace una funcion para mandar al usuario a el formulario de pago 
function irAPagina_pago() {
    if (allProducts.length === 0) {
        mostrarMensajeError("No hay productos en el carrito. Agrega uno antes de pagar.", "#E53935");
        return;
    }

    window.location.href = "pago.html";
}
