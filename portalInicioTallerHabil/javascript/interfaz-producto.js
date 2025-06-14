const btnCart = document.querySelector('.container-cart-icon');
const containerCartProducts = document.querySelector('.container-cart-products');

btnCart.addEventListener('click', () => {
  containerCartProducts.classList.toggle('hidden-cart');
});

const cartInfo = document.querySelector('.cart-product');
const rowProduct = document.querySelector('.row-product');

const productsList = document.querySelector('.container-items');

let allProducts = [];

const valorTotal = document.querySelector('.total-pagar');
const countProducts = document.querySelector('#contador-productos');
const cartEmpty = document.querySelector('.cart-empty');
const cartTotal = document.querySelector('.cart-total');

// Manejador de evento para el botón de agregar al carrito
productsList.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-add-cart')) {
    const product = e.target.parentElement;

    const infoProduct = {
      quantity: 1,
      title: product.querySelector('h2').textContent,
      price: product.querySelector('p').textContent
    };

    const exits = allProducts.some((product) => product.title === infoProduct.title);

    if (exits) {
      const products = allProducts.map((product) => {
        if (product.title === infoProduct.title) {
          product.quantity++;
          return product;
        } else {
          return product;
        }
      });
      allProducts = [...products];
    } else {
      allProducts = [...allProducts, infoProduct];
    }

    mostrarNotificacion();
    showHTML();

    document.dispatchEvent(new CustomEvent('productAddedToCart'));
  }
});

// se hace un evento para ocultar la ventana del carrito
rowProduct.addEventListener('click', (e) => {
  if (e.target.classList.contains('icon-close')) {
    const product = e.target.parentElement;
    const title = product.querySelector('p').textContent;

    allProducts = allProducts.filter((product) => product.title !== title);

    mostrarNotificacion();
    showHTML();
    mostrarMensajeEliminacion(`"${title}" fue eliminado del carrito.`);
  }
});

// Funcion para mostrar  HTML
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

  rowProduct.innerHTML = '';

  let total = 0;
  let totalOfProducts = 0;

  allProducts.forEach((product) => {
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

    rowProduct.append(containerProduct);

    total = total + parseInt(product.quantity * product.price.slice(1));
    totalOfProducts = totalOfProducts + product.quantity;
  });

  valorTotal.innerText = `$${total}`;
  countProducts.innerText = totalOfProducts;
};

function irAPagina_Detalles_accesorios() {
  window.location.href = 'producto-individual-accesorios.html';
}

function irAPagina_Detalles_camisetas() {
  window.location.href = 'producto-individual-camisetas.html';
}

function irAPagina_Detalles_gorras() {
  window.location.href = 'producto-individual-gorras.html';
}

function irAPagina_Detalles_pantalones() {
  window.location.href = 'producto-individual-pantalones.html';
}

function irAPagina_Detalles_perfumeria() {
  window.location.href = 'producto-individual-perfumeria.html';
}

// funcion para validar si el carrito tiene productos 
function irAPagina_pago() {
  if (allProducts.length === 0) {
    mostrarMensajeError('Debes añadir al menos un producto al carrito antes de pagar.');
    return;
  }

  window.location.href = 'pago.html';
}

function mostrarNotificacion() {
  const noti = document.getElementById('notificacion');
  noti.classList.remove('hidden');
  noti.classList.add('show');

  setTimeout(() => {
    noti.classList.remove('show');
    noti.classList.add('hidden');
  }, 5000);
}

function mostrarMensajeError(texto) {
  const noti = document.getElementById('notificacion');
  noti.innerText = texto;
  noti.style.backgroundColor = '#E53935';
  noti.classList.remove('hidden');
  noti.classList.add('show');

  setTimeout(() => {
    noti.classList.remove('show');
    noti.classList.add('hidden');
    noti.innerText = 'Producto añadido al carrito 🛒';
    noti.style.backgroundColor = '#2E7D32';
  }, 5000);
}

function mostrarMensajeEliminacion(texto) {
  const noti = document.getElementById('notificacion');
  noti.innerText = texto;
  noti.style.backgroundColor = '#FFA000';
  noti.classList.remove('hidden');
  noti.classList.add('show');

  setTimeout(() => {
    noti.classList.remove('show');
    noti.classList.add('hidden');
    noti.innerText = 'Producto añadido al carrito 🛒';
    noti.style.backgroundColor = '#2E7D32';
  }, 5000);
}
