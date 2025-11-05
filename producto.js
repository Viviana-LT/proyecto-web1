const carrito = document.querySelector(".icon-car");
const contenedorCarrito = document.querySelector(".contenedor-carrito");

carrito.addEventListener('click', () => {
    contenedorCarrito.classList.toggle("oculto")
});