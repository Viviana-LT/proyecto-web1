document.addEventListener('DOMContentLoaded', () => {
  const CLAVE_SESION = 'sesion_usuario';

  const formulario = document.getElementById('loginForm');
  const entradaCorreo = document.getElementById('email');
  const entradaContrasena = document.getElementById('password');
  const mensaje = document.getElementById('loginMsg');
  const btnRegistro = document.getElementById('btnRegistro');

  const sesionExistente = sessionStorage.getItem(CLAVE_SESION);
  if (sesionExistente) {
    window.location.href = 'productos.html'; 
    return;
  }

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const correo = entradaCorreo.value.trim();
    const contrasena = entradaContrasena.value.trim();

    if (!correo || !contrasena) {
      mostrarMensaje("Completa todos los campos", 'error');
      return;
    }

    if (contrasena.length < 6) {
      mostrarMensaje("La contraseña debe tener al menos 6 caracteres", 'error');
      return;
    }
    
    const usuario = {
      correo: correo,
      nombre: correo.split('@')[0],
      fechaIngreso: new Date().toLocaleString()
    };

    sessionStorage.setItem(CLAVE_SESION, JSON.stringify(usuario));
    mostrarMensaje("Inicio de sesión exitoso. Redirigiendo...", 'okay');
    
    setTimeout(() => {
      window.location.href = "productos.html";
    }, 1000);
  });

  btnRegistro.addEventListener('click', () => {
    alert("Para crear una cuenta, contacta con nosotros en la sección de contacto.");
  });

  function mostrarMensaje(texto, tipo) {
    if (mensaje) {
      mensaje.textContent = texto;
      mensaje.className = `msg-sencillo ${tipo}`;
    }
  }
});

