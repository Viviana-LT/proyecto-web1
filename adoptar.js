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

document.querySelector('#modalAdopcion .close')
    .addEventListener('click', cerrarFormulario);

window.addEventListener('click', function(e) {
    const modal = document.getElementById('modalAdopcion');
    if (e.target === modal) cerrarFormulario();
});
