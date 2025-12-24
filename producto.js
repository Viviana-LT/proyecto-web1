const carrito = document.querySelector(".contenedor-info-carrito");
const contenedorCarrito = document.querySelector(".contenedor-carrito");

carrito.addEventListener('click', () => {
    contenedorCarrito.classList.toggle("oculto")
});

const cartInfo = document.querySelector(".carro-productos")
const rowProduct = document.querySelector(".row-productos")

const productList = document.querySelector(".contenedor-productos")

let allProducts = []

const valorTotal = document.querySelector(".total-pagar")
const countProducts = document.querySelector("#contador-productos")

productList.addEventListener('click', e => {
    if(e.target.classList.contains("add-carrito")){
        const product = e.target.parentElement

        const infoProduct = {
            cantidad: 1,
            title: product.previousElementSibling.querySelector("h3").textContent,
            price: e.target.previousElementSibling.textContent
        }
        const existe = allProducts.some(product => product.title === infoProduct.title)

        if(existe){
            const products = allProducts.map(product => {
                if(product.title === infoProduct.title){
                    product.cantidad++;
                    return product;
                } else {
                    return product
                }
            })
            allProducts = [...products]
        } else {
            allProducts = [...allProducts, infoProduct]
        }
        

        showHTML();
    };

})

rowProduct.addEventListener('click', (e) => {
    if (e.target.classList.contains("icon-x")){
        console.log(e.target.parentElement)
        const product = e.target.parentElement;
        const title = product.querySelector('p').textContent;

        console.log(product.querySelector('p').textContent)

        allProducts = allProducts.filter(
            prod => prod.title !== title
        );
        showHTML();
    }
})

const showHTML = () => {
    rowProduct.innerHTML = "";

    let total = 0;
    let totalProducts = 0;

    allProducts.forEach(product => {
        const contenedorProduct = document.createElement("div")
        contenedorProduct.classList.add("carro-productos")
        contenedorProduct.innerHTML = `
            <div class="info-carro-producto">
                <span class="cantidad-producto-carrito">${product.cantidad}</span>
                <p class="nombre-producto-carrito">${product.title}</p>
                <span class="precio-producto-carrito">${product.price}</span>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="icon-x">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
        `
        rowProduct.append(contenedorProduct);

        total += parseFloat(product.cantidad * product.price.slice(3));

        totalProducts += product.cantidad;
    });

    valorTotal.innerText = `PEN ${total}`;
    countProducts.innerText = totalProducts;
}

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

// -- MODIFICAR PRODUCTOS --
const contenedor = document.getElementById('lista-productos-js');

async function cargarProductos() {
    try {
        const respuesta = await fetch('/api/productos');
        const productos = await respuesta.json();

        contenedor.innerHTML = ''; 

        productos.forEach(prod => {
            // CONDICIÓN: Si la cantidad es 0 o menor, saltamos este producto
            if (prod.stock <= 0) {
                return; // No hace nada y pasa al siguiente producto de la lista
            }

            const article = document.createElement('article');
            article.className = 'producto';
            article.innerHTML = `
                <figure>
                    <img class="item" src="${prod.imagen_url}" width="120">
                </figure>
                <div class="info-producto">
                    <header><h3>${prod.nombre}</h3></header>
                    <div class="anadir-carrito">
                        <p>PEN ${prod.precio}</p>
                        <button class="add-carrito" onclick="agregarAlCarrito('${prod.nombre}', ${prod.precio})"> + </button>
                    </div>
                    <p><strong>Stock disponible:</strong> ${prod.stock} unidades</p>
                    <h4>Descripción</h4>
                    <p>${prod.descripcion}</p>
                </div>
            `;
            contenedor.appendChild(article);
        });
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

window.onload = cargarProductos;

// Busca el botón de pagar en tu HTML y añade el evento

btnListo.addEventListener('click', async () => {
    // 'allProducts' debe ser la variable donde guardas lo que hay en tu carrito
    // Si tu código de carrito usa otra variable, cámbiala aquí
    if (allProducts.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    try {
        const respuesta = await fetch('/api/pagar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(allProducts) // Enviamos la lista de productos
        });

        if (respuesta.ok) {
            alert("¡Compra realizada! El stock ha sido actualizado.");
            
            // 1. Abrir tu ventana emergente de "Pago" (la que ya tienes)
            const modal = document.getElementById('miModal');
            modal.style.display = 'flex';

            // 2. Limpiar el carrito en el HTML
            allProducts = []; 
            showHTML(); // Función que actualiza la vista de tu carrito
            
            // 3. Recargar los productos para ocultar los que se quedaron sin stock
            cargarProductos(); 
        } else {
            alert("Hubo un error al procesar el pago.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
});