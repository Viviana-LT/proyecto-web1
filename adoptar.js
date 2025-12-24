document.addEventListener("DOMContentLoaded", function () {

    function abrirFormulario(nombre, edad, caracteristicas) {
        const modal = document.getElementById('modalAdopcion');
        modal.style.display = 'block';

        document.getElementById('nombreGatito').textContent = nombre;
        document.getElementById('edadGatito').textContent = edad;
        document.getElementById('caracGatito').textContent = caracteristicas;
        document.getElementById('nombreGatoHidden').value = nombre;
    }

    function cerrarFormulario() {
        document.getElementById('modalAdopcion').style.display = 'none';
        document.getElementById('formAdopcion').reset();
    }

    window.abrirFormulario = abrirFormulario;
    window.cerrarFormulario = cerrarFormulario;

    const btnCerrar = document.querySelector('#modalAdopcion .close');
    if (btnCerrar) {
        btnCerrar.addEventListener('click', cerrarFormulario);
    }

    window.addEventListener('click', function(e) {
        const modal = document.getElementById('modalAdopcion');
        if (e.target === modal) cerrarFormulario();
    });

    const form = document.getElementById("formAdopcion");
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            const datos = {
                nombre_gato: document.getElementById("nombreGatoHidden").value,
                nombre_persona: document.getElementById("nombreAdoptante").value,
                email: document.getElementById("email").value,
                telefono: document.getElementById("telefono").value,
                direccion: document.getElementById("direccion").value,
                motivacion: document.getElementById("motivacion").value
            };

            fetch("http://127.0.0.1:5000/adoptar", {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            })
        });
    }

});

