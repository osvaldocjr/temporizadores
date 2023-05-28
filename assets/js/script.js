const iniciarBtn = document.querySelector(".iniciar-btn");
const pararBtn = document.querySelector(".parar-btn");
const reiniciarBtn = document.querySelector(".reiniciar-btn");
const gifContainer = document.querySelector(".gif-container");
const gifImage = document.querySelector(".bob");
const pausarBtn = document.querySelector(".pausar-btn");
const som = document.querySelector(".meuAudio");

let tempoTotal1 = 0;
let tempoTotal2 = 0;
let intervalo1;
let intervalo2;
let pausado = false;
let duracao1, duracao2, contador1, contador2;

iniciarBtn.addEventListener("click", () => {
  iniciarTemporizadores();
});

function iniciarTemporizadores() {
  const horas1 = parseInt(document.querySelector(".horas1").value);
  const minutos1 = parseInt(document.querySelector(".minutos1").value);
  const segundos1 = parseInt(document.querySelector(".segundos1").value);
  const horas2 = parseInt(document.querySelector(".horas2").value);
  const minutos2 = parseInt(document.querySelector(".minutos2").value);
  const segundos2 = parseInt(document.querySelector(".segundos2").value);

  const duracaoTotal = horas1 * 3600 + minutos1 * 60 + segundos1 + horas2 * 3600 + minutos2 * 60 + segundos2;
  if (duracaoTotal === 0) {
    return;
  }

  if (horas1 > 100 || horas2 > 100) {
    alert("A hora deve ser menor ou igual a 99");
    return;
  }

  if (minutos1 > 59 || minutos2 > 59 || segundos1 > 59 || segundos2 > 59) {
    alert("Os minutos e/ou devem ser menores ou iguais a 59");
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

  const contador1Elemento = document.querySelector(".contador1");
  const contador2Elemento = document.querySelector(".contador2");

  // Criar um novo Web Worker para o primeiro temporizador
  const worker1 = new Worker('assets/js/timer-worker.js');
  const worker2 = new Worker('assets/js/timer-worker.js');

  // Manipular a mensagem recebida do Web Worker do primeiro temporizador
  worker1.onmessage = function (e) {
    const seconds = e.data;

    if (seconds <= duracao1) {
      contador1--;
      const horasRestantes1 = Math.floor(contador1 / 3600);
      const minutosRestantes1 = Math.floor((contador1 - horasRestantes1 * 3600) / 60);
      const segundosRestantes1 = contador1 % 60;
      contador1Elemento.textContent = `1º tempo restante: ${horasRestantes1.toString().padStart(2, '0')}:${minutosRestantes1.toString().padStart(2, '0')}:${segundosRestantes1.toString().padStart(2, '0')}`;

      if (contador1 <= 0) {
        clearInterval(intervalo1);
        som.play();

        if (duracao2 > 0) {
          // Iniciar o segundo temporizador
          iniciarTemporizador2();
        }
      } else if (contador1 <= 1200) {
        gifImage.src = "assets/img/estudos-gif/2bob-lapis.gif";
      } else if (contador1 <= 2100) {
        gifImage.src = "assets/img/estudos-gif/3homer-estudando.gif";
      } else if (contador1 <= 2700) {
        gifImage.src = "assets/img/estudos-gif/4bob-nao-aguenta-mais.gif";
      }
    }
  };

  // Criar um novo Web Worker para o segundo temporizador
  function iniciarTemporizador2() {
    // Manipular a mensagem recebida do Web Worker do segundo temporizador
    worker2.onmessage = function (e) {
      const seconds = e.data;

      if (seconds <= duracao2) {
        contador2--;
        const horas2 = Math.floor(contador2 / 3600);
        const minutos2 = Math.floor((contador2 - horas2 * 3600) / 60);
        const segundosRestantes2 = contador2 % 60;
        contador2Elemento.textContent = `2º tempo restante: ${horas2.toString().padStart(2, '0')}:${minutos2.toString().padStart(2, '0')}:${segundosRestantes2.toString().padStart(2, '0')}`;

        if (contador2 <= 0) {
          clearInterval(intervalo2);
          som.play();

          if (duracao1 > 0) {
            reiniciarTemporizador();
          }
        }
      }
    };

    // Iniciar o temporizador do segundo Web Worker
    worker2.postMessage('start');
  }

  // Iniciar o temporizador do primeiro Web Worker
  worker1.postMessage('start');

  pararBtn.addEventListener("click", () => {
    gifImage.src = "assets/img/estudos-gif/0bob-esponja.gif";
    clearInterval(intervalo1);
    clearInterval(intervalo2);
    contador1Elemento.textContent = "1º tempo restante: 00:00:00";
    contador2Elemento.textContent = "2º tempo restante: 00:00:00";

    document.querySelector(".horas1").value = "00";
    document.querySelector(".minutos1").value = "00";
    document.querySelector(".segundos1").value = "00";
    document.querySelector(".horas2").value = "00";
    document.querySelector(".minutos2").value = "00";
    document.querySelector(".segundos2").value = "00";

    // Parar os temporizadores dos Web Workers
    worker1.postMessage('stop');
    worker2.postMessage('stop');

    reiniciarBtn.disabled = false;
  });

  reiniciarBtn.addEventListener("click", () => {
    reiniciarTemporizador();
  });

  function reiniciarTemporizador() {
    pararBtn.click();
    iniciarBtn.click();
    reiniciarBtn.disabled = true;
  }
}
