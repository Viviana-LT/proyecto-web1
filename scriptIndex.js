let modal = document.getElementById("promoModal");
let span = document.getElementsByClassName("close")[0];
let btn = document.querySelector(".promo-btn");

window.onload = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

btn.onclick = function() {
    modal.style.display = "none";
    window.location.href = "productos.html";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}