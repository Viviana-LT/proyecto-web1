document.addEventListener("DOMContentLoaded", function () {
  const formResenas = document.getElementById("formResenas");
  const ratingStars = document.getElementById("ratingStars");
  const calificacionInput = document.getElementById("calificacion");
  const mensajeDiv = document.getElementById("mensaje"); 

  if (ratingStars && calificacionInput) {
    ratingStars.addEventListener("click", (e) => {
      if (!e.target.dataset.value) return;

      const value = parseInt(e.target.dataset.value);
      calificacionInput.value = value;

      const spans = ratingStars.querySelectorAll("span");
      spans.forEach((span, index) => {
        if (index < value) span.classList.add("active");
        else span.classList.remove("active");
      });
    });
  }

  if (formResenas) {
    formResenas.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!calificacionInput.value) {
        alert("Selecciona una calificación con las estrellas.");
        return;
      }

      const datos = {
        nombre_usuario: document.getElementById("nombreUsuario").value,
        titulo: document.getElementById("titulo").value,
        calificacion: parseInt(calificacionInput.value),
        contenido: document.getElementById("contenido").value
      };

      fetch("http://127.0.0.1:5000/resenas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.mensaje) {
            if (mensajeDiv) {
              mensajeDiv.textContent = data.mensaje;
              mensajeDiv.className = "success show";
            } else {
              alert("Reseña guardada");
            }
            formResenas.reset();
            calificacionInput.value = "";
            if (ratingStars) {
              ratingStars
                .querySelectorAll("span")
                .forEach((span) => span.classList.remove("active"));
            }
          } else {
            if (mensajeDiv) {
              mensajeDiv.textContent = data.error || "Error al guardar reseña";
              mensajeDiv.className = "error show";
            } else {
              alert("Error: " + (data.error || "No se pudo guardar"));
            }
          }
        })
        .catch((error) => {
          if (mensajeDiv) {
            mensajeDiv.textContent = "Error de conexión: " + error;
            mensajeDiv.className = "error show";
          } else {
            alert("Error de conexión: " + error);
          }
        });
    });
  }
});
