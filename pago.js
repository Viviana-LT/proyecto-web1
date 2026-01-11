// Obtener los elementos del DOM
const btnAbrir = document.getElementById('pagar');
const btnListo = document.getElementById('btnListo');
const modal = document.getElementById('miModal');

// Función para mostrar la ventana
btnAbrir.addEventListener('click', () => {
    modal.style.display = 'flex';
});

// Función para ocultar la ventana y ENVIAR PEDIDO
btnListo.addEventListener('click', async () => {

    // 🔹 Obtener datos del cliente
    const email = document.getElementById("clienteEmail").value;
    const telefono = document.getElementById("clienteTelefono").value;
    const direccion = document.getElementById("clienteDireccion").value;
    const tipoEntrega = document.getElementById("tipoEntrega").value;

    if (!email || !telefono || !direccion) {
        alert("Por favor completa todos los datos del cliente");
        return;
    }

    // 🔹 El carrito debe existir (lo maneja producto.js)
    // Normalmente es una variable global llamada carrito
    if (typeof carrito === "undefined" || carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    const datosPedido = {
        cliente: {
            email: email,
            telefono: telefono,
            direccion: direccion,
            tipoEntrega: tipoEntrega
        },
        productos: carrito
    };

    try {
        const res = await fetch("/api/pagar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosPedido)
        });

        const resultado = await res.json();
        console.log("Respuesta servidor:", resultado);

        if (resultado.success) {
            alert("Pedido realizado correctamente 🐾☕");
            modal.style.display = 'none';

            // Opcional: vaciar carrito y recargar
            // carrito = [];
            // localStorage.removeItem("carrito");
            // location.reload();
        } else {
            alert("Error al procesar el pedido");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("Error de conexión con el servidor");
    }
});
