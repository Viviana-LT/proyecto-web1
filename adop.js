function abrirFormulario(nombre, edad, caracteristicas) {
    document.getElementById("modalAdopcion").style.display = "block";

    document.getElementById("nombreGatito").textContent = nombre;
    document.getElementById("edadGatito").textContent = edad;
    document.getElementById("caracGatito").textContent = caracteristicas;

    document.getElementById("nombreGatoHidden").value = nombre;
}

function cerrarFormulario() {
    document.getElementById("modalAdopcion").style.display = "none";
    document.getElementById("formAdopcion").reset();
}

window.onclick = function(event) {
    const modal = document.getElementById("modalAdopcion");
    if (event.target === modal) {
        cerrarFormulario();
    }
};

document.getElementById("formAdopcion").addEventListener("submit", async function(e) {
    e.preventDefault();

    const datos = {
        nombreGato: document.getElementById("nombreGatoHidden").value,
        nombreAdoptante: document.getElementById("nombreAdoptante").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value,
        direccion: document.getElementById("direccion").value,
        motivacion: document.getElementById("motivacion").value
    };

    try {
        const res = await fetch("/adoptar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

        const resultado = await res.json();
        console.log("Respuesta servidor:", resultado);

        alert("Solicitud enviada y guardada correctamente 🐾❤️");
        cerrarFormulario();

    } catch (err) {
        console.error("Error:", err);
        alert("Error al enviar la solicitud 😿");
    }
});
