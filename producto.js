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