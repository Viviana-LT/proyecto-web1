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

document.getElementById("formAdopcion").addEventListener("submit", function(e) {
    e.preventDefault();

    const datos = {
        nombreGato: document.getElementById("nombreGatoHidden").value,
        nombreAdoptante: document.getElementById("nombreAdoptante").value,
        email: document.getElementById("email").value,
        telefono: document.getElementById("telefono").value,
        direccion: document.getElementById("direccion").value,
        motivacion: document.getElementById("motivacion").value
    };

    console.log("Solicitud enviada:", datos); // solo para verificar

    alert("Solicitud enviada correctamente 🐾❤️");
    cerrarFormulario();
});

