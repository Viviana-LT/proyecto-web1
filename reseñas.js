document.addEventListener('DOMContentLoaded', () => {

  let reseñas = JSON.parse(localStorage.getItem("reseñasNekoMori")) || [
    {
      autor: "Ana L.",
      calificacion: 5,
      texto: "Un lugar lindísimo para relajarse con gatos adorables y majos y café delicioso.",
      fecha: "2025-12-20"
    },
    {
      autor: "Carlos M.",
      calificacion: 4,
      texto: "El ambiente es muy tranquilo y los gatos son muy amigables. Estoy considerando adoptar uno de ellos.",
      fecha: "2025-12-19"
    },
    {
      autor: "Patricia G.",
      calificacion: 5,
      texto: "La atención es rápida y el menú tiene opciones de todo tipo. Además, es super instagrameable. Amé.",
      fecha: "2025-12-18"
    }
  ];

  const form = document.getElementById("reviewForm");
  const lista = document.getElementById("reviewsList");
  const msg = document.getElementById("responseMsg");

  function pintarReseñas() {
    lista.innerHTML = '';

    if (reseñas.length === 0) {
      lista.innerHTML = '<p style="text-align:center; color:#777;">Aún no hay reseñas. Sé la primera persona en comentar.</p>';
      return;
    }

    reseñas.forEach(r => {
      const div = document.createElement("div");
      div.className = 'reseña-item';
      div.innerHTML = `
        <h3>${r.autor} - ${r.calificacion}/5</h3>
        <p>${r.texto}</p>
        <small>${r.fecha}</small>
      `;
      lista.appendChild(div);
    });
  }


  function mostrarMensaje(texto, tipo) {
    msg.textContent = texto;
    msg.className = `msg-sencillo ${tipo}`;
    setTimeout(() => {
        msg.textContent = '';
        msg.className = "msg-sencillo";
    }, 3000);
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    const autor = document.getElementById("authorName").value.trim();
    const rating = parseInt(document.getElementById("rating").value);
    const texto = document.getElementById("reviewText").value.trim();

    if (!autor || !rating || !texto) {
        mostrarMensaje("Completa todos los campos.", 'error');
        return;
    }

    if (autor.length < 2) {
        mostrarMensaje("El nombre debe tener al menos 2 caracteres.", 'error');
        return;
    }

    if (texto.length < 10) {
        mostrarMensaje("La reseña debe tener al menos 10 caracteres.", 'error');
        return;
    }

    const nuevaReseña = {
      autor,
      calificacion: rating,
      texto,
      fecha: new Date().toLocaleDateString("es-PE")
    };

    reseñas.unshift(nuevaReseña);

    localStorage.setItem("reseñasNekoMori", JSON.stringify(reseñas));

    pintarReseñas();
    form.reset();
    mostrarMensaje("Reseña guardada correctamente.", "ok");
  });

  pintarReseñas();
});
