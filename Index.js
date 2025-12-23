window.addEventListener("load", function() {
    const modal = document.getElementById("promoModal");
    const closeBtn = modal.querySelector(".close");
    const btn = modal.querySelector(".promo-btn");
    modal.style.display = "block";
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
    btn.addEventListener("click", () => {
        modal.style.display = "none";
        window.location.href = "productos.html";
    });
    window.addEventListener("click", function(e) {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
});
