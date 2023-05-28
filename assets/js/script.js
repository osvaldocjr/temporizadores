const iniciarBtn = document.querySelector(".iniciar-btn");
const reiniciarBtn = document.querySelector(".reiniciar-btn");
const gifContainer = document.querySelector(".gif-container");
const gifImage = document.querySelector(".bob");
const pausarBtn1 = document.querySelector(".pausar-btn1");
const pausarBtn2 = document.querySelector(".pausar-btn2");
const som = document.querySelector(".meuAudio");
const contador1Elemento = document.querySelector(".contador1");
const contador2Elemento = document.querySelector(".contador2");

let worker1;
let worker2;
let tempoTotal1 = 0;
let tempoTotal2 = 0;
let tempoRestante1 = 0;
let tempoRestante2 = 0;
let intervalo1;
let intervalo2;
let pausado = false;
let pausado2 = false;
let duracao1, duracao2, contador1, contador2;

iniciarBtn.addEventListener("click", () => {
    iniciarTemporizadores();
});

function updateTitle() {
    const tempoRestante1 = formatarTempo(contador1);
    const tempoRestante2 = formatarTempo(contador2).split(":").slice(1).join(":");
    document.title = `1° ${tempoRestante1} - 2° ${tempoRestante2}`;
  }

function iniciarTemporizadores() {
    const horas1 = parseInt(document.querySelector(".horas1").value);
    const minutos1 = parseInt(document.querySelector(".minutos1").value);
    const segundos1 = parseInt(document.querySelector(".segundos1").value);
    const horas2 = parseInt(document.querySelector(".horas2").value);
    const minutos2 = parseInt(document.querySelector(".minutos2").value);
    const segundos2 = parseInt(document.querySelector(".segundos2").value);

    const duracaoTotal =
        horas1 * 3600 +
        minutos1 * 60 +
        segundos1 +
        horas2 * 3600 +
        minutos2 * 60 +
        segundos2;
    if (duracaoTotal === 0) {
        return;
    }

    if (horas1 > 99 || horas2 > 99) {
        alert("A hora deve ser menor ou igual a 99");
        return;
    }

    if (minutos1 > 59 || minutos2 > 59 || segundos1 > 59 || segundos2 > 59) {
        alert("Os minutos e/ou segundos devem ser menores ou iguais a 59");
        return;
    }

    if (horas1 === 0 && minutos1 === 0 && segundos1 === 0) {
        alert("Valores inválidos");
        return;
    }

    duracao1 = minutos1 * 60 + segundos1;
    if (horas1 > 0) {
        duracao1 += horas1 * 3600;
    }

    duracao2 = minutos2 * 60 + segundos2;
    if (horas2 > 0) {
        duracao2 += horas2 * 3600;
    }

    contador1 = duracao1;
    contador2 = duracao2;

    // Criar um novo Web Worker para o primeiro temporizador
    worker1 = new Worker("assets/js/timer-worker.js");
    worker2 = new Worker("assets/js/timer-worker.js");

    // Definir a mensagem do título da página
    document.title = `1° ${formatarTempo(
        contador1
    )} - 2° ${formatarTempo(contador2)}`;

    // Definir o comportamento do Web Worker para atualizar os contadores
    worker1.onmessage = function (event) {
        if (!pausado) {
            contador1 = event.data;
            contador1Elemento.textContent = formatarTempo(contador1);
            updateTitle();
        }
    };

    worker2.onmessage = function (event) {
        if (!pausado2) {
            contador2 = event.data;
            contador2Elemento.textContent = formatarTempo(contador2);
            updateTitle();
        }
    };

    // Definir o comportamento do Web Worker para receber comandos de pausa e continuar
    worker1.onmessage = function (event) {
        if (event.data === "pause") {
            pausado = true;
        } else if (event.data === "resume") {
            pausado = false;
        }
    };

    worker2.onmessage = function (event) {
        if (event.data === "pause") {
            pausado2 = true;
        } else if (event.data === "resume") {
            pausado2 = false;
        }
    };

    // Iniciar os temporizadores
    iniciarTemporizador1();
}

function iniciarTemporizador1() {
    clearInterval(intervalo1);
    intervalo1 = setInterval(() => {
        if (contador1 > 0) {
            contador1--;
        } else {
            clearInterval(intervalo1);
            gifImage.src = "assets/img/estudos-gif/0bob-esponja.gif";
            som.play();
            iniciarTemporizador2();
        }
        contador1Elemento.textContent = `1° tempo restante: ${formatarTempo(contador1)}`
        document.title = `1° ${formatarTempo(
            contador1
        )} - 2° ${formatarTempo(contador2)}`;

        // Verificar o estado do contador1 e atualizar os estilos dos botões de pausa
        if (contador1 > 0) {
            pausarBtn1.style.display = "inline-block";
            pausarBtn2.style.display = "none";
        }
        
        if (contador1 <= 600) {
            gifImage.src = "assets/img/estudos-gif/1bob-comecou-estudar.gif";
        } else if (contador1 <= 1200) {
            gifImage.src = "assets/img/estudos-gif/2bob-lapis.gif";
        } else if (contador1 <= 1800) {
            gifImage.src = "assets/img/estudos-gif/3homer-estudando.gif";
        } else if (contador1 <= 2700) {
            gifImage.src = "assets/img/estudos-gif/4bob-nao-aguenta-mais.gif";
        }
    }, 1000);
}

function iniciarTemporizador2() {
    clearInterval(intervalo2);
    intervalo2 = setInterval(() => {
        if (contador2 > 0) {
            contador2--;
        } else {
            clearInterval(intervalo2);
            som.play();
        }
        contador2Elemento.textContent = `2º tempo restante: ${formatarTempo(contador2)}`;
        document.title = `1° ${formatarTempo(
            contador1
        )} - 2° ${formatarTempo(contador2)}`;

        // Verificar o estado do contador2 e atualizar os estilos dos botões de pausa
        if (contador2 > 0) {
            pausarBtn1.style.display = "none";
            pausarBtn2.style.display = "inline-block";
            gifImage.src = "assets/img/estudos-gif/0bob-esponja.gif";
        }
    }, 1000);
}

reiniciarBtn.addEventListener("click", () => {
    reiniciarTemporizadores();
});

function reiniciarTemporizadores() {
    clearInterval(intervalo1);
    clearInterval(intervalo2);
    worker1.terminate();
    worker2.terminate();
    contador1 = duracao1;
    contador2 = duracao2;
    tempoRestante1 = 0;
    tempoRestante2 = 0;
    contador1Elemento.textContent = formatarTempo(contador1);
    contador2Elemento.textContent = formatarTempo(contador2);
    document.title = "Temporizador";
    gifImage.src = "assets/img/estudos-gif/0bob-esponja.gif";
    som.pause();
    som.currentTime = 0;
    pausarBtn1.style.display = "inline-block";
    pausarBtn2.style.display = "none";

    contador1Elemento.textContent = "1º tempo restante: 00:00:00";
    contador2Elemento.textContent = "2º tempo restante: 00:00:00";

    document.querySelector(".horas1").value = "00";
    document.querySelector(".minutos1").value = "00";
    document.querySelector(".segundos1").value = "00";
    document.querySelector(".horas2").value = "00";
    document.querySelector(".minutos2").value = "00";
    document.querySelector(".segundos2").value = "00";
}

pausarBtn1.addEventListener("click", () => {
    pausarTemporizador1();
});

function pausarTemporizador1() {
    if (!pausado) {
        clearInterval(intervalo1);
        worker1.postMessage("pause");
        pausado = true;
        pausarBtn1.textContent = "Continuar 1° tempo";
    } else {
        iniciarTemporizador1();
        worker1.postMessage("resume");
        pausado = false;
        pausarBtn1.textContent = "Pausar 1° tempo";
    }
}

pausarBtn2.addEventListener("click", () => {
    pausarTemporizador2();
});

function pausarTemporizador2() {
    if (!pausado2) {
        clearInterval(intervalo2);
        worker2.postMessage("pause");
        pausado2 = true;
        pausarBtn2.textContent = "Continuar 2° tempo";
    } else {
        iniciarTemporizador2();
        worker2.postMessage("resume");
        pausado2 = false;
        pausarBtn2.textContent = "Pausar 2° tempo";
    }
}

function formatarTempo(tempo) {
    const horas = Math.floor(tempo / 3600);
    const minutos = Math.floor((tempo % 3600) / 60);
    const segundos = tempo % 60;

    return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
}

function ajustarVolume() {
    const volume = document.querySelector(".controleVolume").value;
    som.volume = volume;
  }
