// Obtener los elementos del DOM
const btnAbrir = document.getElementById('pagar');
const btnListo = document.getElementById('btnListo');
const modal = document.getElementById('miModal');

// Función para mostrar la ventana
btnAbrir.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Función para ocultar la ventana (solo cuando se presiona 'Listo')
btnListo.addEventListener('click', () => {
    modal.style.display = 'none';
});