function printInvoice() {
    window.print();
}

// Obtener la fecha actual y mostrarla en la factura
const currentDate = new Date().toLocaleDateString('en-US');
document.getElementById('date').innerText = `${currentDate}`;

// Función para agregar un producto a la factura
function addProductToInvoice(productName, price) {
    const table = document.getElementById('items-table');
    const row = table.insertRow(-1);
    const cell1 = row.insertCell(0);
    const cell2 = row.insertCell(1);
    cell1.textContent = productName;
    cell2.textContent = price;
}

// Ejemplo de cómo agregar productos a la factura
addProductToInvoice('Producto 1', '$10.00');
addProductToInvoice('Producto 2', '$20.00');
addProductToInvoice('Producto 3', '$15.00');

// Calcular el total de la factura
const totalAmount = Array.from(document.querySelectorAll('#items-table tr td:nth-child(2)'))
    .map(td => parseFloat(td.textContent.replace('$', '')))
    .reduce((acc, curr) => acc + curr, 0);
document.getElementById('total-amount').innerText = `$${totalAmount.toFixed(2)}`;


// se hace una funcion para mandar al usuario a la pagina principal 
function irAPagina_indice() {
    window.location.href = "indice.html";
  }
