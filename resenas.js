document.addEventListener("DOMContentLoaded", function () {
    const contenedorResenas = document.getElementById("contenedorResenas");
    const formResenas = document.getElementById("formResenas");
    const ratingStars = document.getElementById("ratingStars");
    const calificacionInput = document.getElementById("calificacion");
    const mensajeDiv = document.getElementById("mensaje");

    // --- 1. FUNCIÓN PARA CARGAR LAS RESEÑAS ---
    function cargarResenas() {
        console.log("Cargando reseñas desde el servidor...");
        fetch("/api/ver_resenas")
            .then(res => {
                if (!res.ok) throw new Error("Error en el servidor");
                return res.json();
            })
            .then(data => {
                console.log("Reseñas recibidas:", data);
                if (!contenedorResenas) return;

                if (data.length === 0) {
                    contenedorResenas.innerHTML = "<p>Aún no hay reseñas. ¡Sé el primero!</p>";
                    return;
                }

                contenedorResenas.innerHTML = ""; // Limpiar
                data.forEach(r => {
                    const div = document.createElement("div");
                    div.style.borderBottom = "1px solid #eee";
                    div.style.padding = "15px";
                    div.style.marginBottom = "10px";
                    div.style.backgroundColor = "#fff";
                    div.style.borderRadius = "8px";

                    div.innerHTML = `
                        <h3 style="margin:0; color: #d84b6b;">${r.titulo}</h3>
                        <small>Por: <strong>${r.nombre_usuario}</strong> - <span style="color: #ffcc00;">${"★".repeat(r.calificacion)}</span></small>
                        <p style="margin-top: 10px;">${r.contenido}</p>
                    `;
                    contenedorResenas.appendChild(div);
                });
            })
            .catch(err => {
                console.error("Error al cargar:", err);
                if(contenedorResenas) contenedorResenas.innerHTML = "<p>No se pudieron cargar las reseñas.</p>";
            });
    }

    // --- 2. EJECUTAR AL CARGAR LA PÁGINA ---
    cargarResenas();

    // --- 3. LÓGICA DE LAS ESTRELLAS ---
    if (ratingStars && calificacionInput) {
        ratingStars.addEventListener("click", (e) => {
            if (!e.target.dataset.value) return;
            const value = parseInt(e.target.dataset.value);
            calificacionInput.value = value;
            const spans = ratingStars.querySelectorAll("span");
            spans.forEach((span, index) => {
                index < value ? span.classList.add("active") : span.classList.remove("active");
            });
        });
    }

    // --- 4. ENVÍO DEL FORMULARIO ---
    if (formResenas) {
        formResenas.addEventListener("submit", function (e) {
            e.preventDefault();

            if (!calificacionInput.value) {
                alert("Por favor, selecciona una calificación.");
                return;
            }

            const datos = {
                nombre_usuario: document.getElementById("nombreUsuario").value,
                titulo: document.getElementById("titulo").value,
                calificacion: parseInt(calificacionInput.value),
                contenido: document.getElementById("contenido").value
            };

            fetch("/api/resenas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            })
            .then(res => res.json())
            .then(data => {
                if (data.mensaje) {
                    if (mensajeDiv) {
                        mensajeDiv.textContent = data.mensaje;
                        mensajeDiv.className = "success show";
                    }
                    formResenas.reset();
                    calificacionInput.value = "";
                    ratingStars.querySelectorAll("span").forEach(s => s.classList.remove("active"));

                    // Recargar la lista inmediatamente después de guardar
                    cargarResenas();
                } else {
                    throw new Error(data.error || "Error desconocido");
                }
            })
            .catch(error => {
                console.error("Error en POST:", error);
                if (mensajeDiv) {
                    mensajeDiv.textContent = "Error: " + error.message;
                    mensajeDiv.className = "error show";
                }
            });
        });
    }
});

