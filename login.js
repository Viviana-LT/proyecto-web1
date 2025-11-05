document.addEventListener('DOMContentLoaded', () => {
  const CLAVE_SESION = 'sesion_usuario';

  const formulario = document.getElementById('loginForm');
  const entradaCorreo = document.getElementById('email');
  const entradaContrasena = document.getElementById('password');
  const mensaje = document.getElementById('loginMsg');

  const sesionExistente = sessionStorage.getItem(CLAVE_SESION);
  if (sesionExistente) {
    window.location.href = 'productos.html'; 
    return;
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();


    if (!formulario.reportValidity()) return;


    const correo = entradaCorreo.value.trim();
    const nombre = correo.split('@')[0];
    const usuario = {
      correo: correo,
      nombre: nombre,
      fechaIngreso: Date.now()
    };

    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));

    if (mensaje) {
      mensaje.className = 'msg ok';
      mensaje.textContent = 'Ingreso correcto, redirigiendo…';
    }
    setTimeout(() => {
      window.location.href = 'productos.html'; 
    }, 400);
  });
});

