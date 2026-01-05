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
const btnAbrir = document.getElementById('pagar');
const btnListo = document.getElementById('btnListo');
const modal = document.getElementById('miModal');

// Función para mostrar la ventana cuando se presiona "Pagar"
btnAbrir.addEventListener('click', async () => {
    // Verificar que hay productos en el carrito
    if (allProducts.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    try {
        // Procesar el pago en el servidor
        const respuesta = await fetch('/api/pagar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(allProducts)
        });

        const data = await respuesta.json();

        if (respuesta.ok) {
            // Mostrar el modal de confirmación
            modal.style.display = 'flex';
        } else {
            // Manejar error de stock insuficiente
            if (data.productos_sin_stock) {
                let mensaje = " No hay suficiente stock para:\n\n";
                
                data.productos_sin_stock.forEach(prod => {
                    mensaje += `📦 ${prod.nombre}\n`;
                    mensaje += `   Solicitado: ${prod.solicitado}\n`;
                    mensaje += `   Disponible: ${prod.disponible}\n\n`;
                });
                
                mensaje += "Por favor, ajusta las cantidades en tu carrito.";
                alert(mensaje);
            } else {
                alert("Hubo un error al procesar el pago: " + (data.error || "Error desconocido"));
            }
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión al procesar el pago");
    }
});

// Función para ocultar la ventana y limpiar el carrito
btnListo.addEventListener('click', () => {
    modal.style.display = 'none';
    
    // Limpiar el carrito
    allProducts = []; 
    showHTML();
    
    // Recargar los productos para actualizar el stock
    cargarProductos();
});

// CARGAR PRODUCTOS DESDE LA BASE DE DATOS
async function cargarProductos() {
    try {
        const respuesta = await fetch('/api/productos');
        if (!respuesta.ok) return;

        const productos = await respuesta.json();
        const contenedor = document.querySelector('.contenedor-productos');
        contenedor.innerHTML = '';

        productos.forEach(prod => {
            const article = document.createElement('article');
            article.className = 'producto';
            article.innerHTML = `
                <figure>
                    <img class="item" src="/recurs/${prod.imagen}" width="120">
                </figure>
                <div class="info-producto">
                    <header><h3>${prod.nombre}</h3></header>
                    <div class="anadir-carrito">
                        <p>PEN ${prod.precio}</p>
                        <button class="add-carrito">+</button>
                    </div>
                    <h4>Descripción</h4>
                    <p>${prod.descripcion || 'Sin descripción disponible'}</p>
                </div>
            `;
            contenedor.appendChild(article);
        });
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}


// Cargar productos cuando la página termine de cargar
window.addEventListener('load', cargarProductos);