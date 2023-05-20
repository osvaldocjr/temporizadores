const btnMobile = document.querySelector(".btn-mobile");

function toogleMenu(e) {
    if(e.type === 'touchstart') e.preventDefault();
    const nav = document.querySelector(".nav");
    nav.classList.toggle("active");
}

btnMobile.addEventListener("click", toogleMenu);
btnMobile.addEventListener("touchstart", toogleMenu);