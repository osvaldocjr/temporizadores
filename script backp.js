const iniciarBtn = document.querySelector(".iniciar-btn");
const pararBtn = document.querySelector(".parar-btn");
const gifContainer = document.querySelector(".gif-container");
const gifImage = document.querySelector(".gif-container img");
const pausarBtn = document.querySelector(".pausar-btn");

let intervalo1;
let intervalo2;

iniciarBtn.addEventListener("click", () => {
    iniciarTemporizadores();
    gifImage.src = "img/1bob-comecou-estudar.gif";
});

function iniciarTemporizadores() {
    const horas1 = parseInt(document.querySelector(".horas1").value);
    const minutos1 = parseInt(document.querySelector(".minutos1").value);
    const segundos1 = parseInt(document.querySelector(".segundos1").value);
    const horas2 = parseInt(document.querySelector(".horas2").value);
    const minutos2 = parseInt(document.querySelector(".minutos2").value);
    const segundos2 = parseInt(document.querySelector(".segundos2").value);

    if (horas1 > 100) {
        alert("A hora deve ser menor ou igual a 99");
        return;
    }

    if (minutos1 > 59) {
        alert("Os minutos devem ser menores ou iguais a 59");
        return;
    }

    const divErro = document.querySelector(".divErro");
let segundosError = divErro.nextElementSibling;

if (segundos1 > 59 || (horas1 !== 0 && minutos1 !== 0 && segundos1 !== 0)) {
    if (segundosError && segundosError.classList.contains("erro")) {
        return;
    }

    if (segundosError) {
        segundosError.remove();
    }

    segundosError = document.createElement("p");
    divErro.after(segundosError);
    segundosError.classList.add("erro");
    segundosError.textContent = "Os segundos devem ser maiores que zero e menores ou iguais a 59";
} else {
    if (segundosError && segundosError.classList.contains("erro")) {
        segundosError.remove();
    }
}



    let duracao1 = minutos1 * 60 + segundos1;
    if (horas1 > 0) {
        duracao1 += horas1 * 3600;
    }

    let duracao2 = minutos2 * 60 + segundos2;
    if (horas2 > 0) {
        duracao2 += horas2 * 3600;
    }

    let contador1 = duracao1;
    let contador2 = duracao2;

    const contador1Elemento = document.querySelector(".contador1");
    const contador2Elemento = document.querySelector(".contador2");

    intervalo1 = setInterval(() => {
        contador1--;
        const horasRestantes1 = Math.floor(contador1 / 3600);
        const minutosRestantes1 = Math.floor((contador1 - horasRestantes1 * 3600) / 60);
        const segundosRestantes1 = contador1 % 60;
        contador1Elemento.textContent = `1º tempo restante: ${horasRestantes1.toString().padStart(2, '0')}:${minutosRestantes1.toString().padStart(2, '0')}:${segundosRestantes1.toString().padStart(2, '0')}`;

        if (contador1 <= 0) {
            clearInterval(intervalo1);
            alert("Temporizador 1 acabou!");

            if (duracao2 > 0) {
                intervalo2 = setInterval(() => {
                    contador2--;
                    const minutos2 = Math.floor(contador2 / 60);
                    const segundosRestantes2 = contador2 % 60;
                    contador2Elemento.textContent = `2º tempo restante: ${horas2.toString().padStart(2, '0')}:${minutos2.toString().padStart(2, '0')}:${segundosRestantes2.toString().padStart(2, '0')}`;

                    if (contador2 <= 0) {
                        clearInterval(intervalo2);
                        alert("Temporizador 2 acabou!");
                        iniciarTemporizadores();
                    } else if (contador2 === duracao2 - (15 * 60)) {
                        // Altera o gif após 15 minutos
                        gifImage.src = "img/2bob-lapis.gif";
                    } else if (contador2 === duracao2 - (30 * 60)) {
                        // Altera o gif após 30 minutos
                        gifImage.src = "img/3homer-estudando.gif";
                    } else if (contador2 === duracao2 - (45 * 60)) {
                        // Altera o gif após 45 minutos
                        gifImage.src = "img/4bob-nao-aguenta-mais.gif";
                    }
                }, 1000);
            }
        } else if (contador1 === duracao1 - (15 * 60)) {
            // Altera o gif após 15 minutos
            gifImage.src = "img/2bob-lapis.gif";
        } else if (contador1 === duracao1 - (30 * 60)) {
            // Altera o gif após 30 minutos
            gifImage.src = "img/3homer-estudando.gif";
        } else if (contador1 === duracao1 - (45 * 60)) {
            // Altera o gif após 45 minutos
            gifImage.src = "img/4bob-nao-aguenta-mais.gif";
        }
    }, 1000);


    pararBtn.addEventListener("click", () => {
        clearInterval(intervalo1);
        clearInterval(intervalo2);
        contador1Elemento.textContent = "1º tempo restante: 00:00:00";
        contador2Elemento.textContent = "2º tempo restante: 00:00:00";

        gifImage.src = "img/0bob-esponja.gif";

        document.querySelector(".horas1").value = "00";
        document.querySelector(".minutos1").value = "00";
        document.querySelector(".segundos1").value = "00";
        document.querySelector(".horas2").value = "00";
        document.querySelector(".minutos2").value = "00";
        document.querySelector(".segundos2").value = "00";
    });
}
