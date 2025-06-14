function printInvoice() {
  window.print();
}

document.addEventListener('DOMContentLoaded', function () {
  const currentDate = new Date().toLocaleDateString('es-ES');
  const dateElement = document.getElementById('date');
  if (dateElement) {
    dateElement.innerText = `${currentDate}`;
  }
});

function irAPagina_indice() {
  window.location.href = 'indice.html';
}
