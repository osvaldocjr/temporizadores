let tempoRestante = 0;
let intervalo = null;

function iniciarContador() {
  intervalo = setInterval(() => {
    postMessage(tempoRestante);
    tempoRestante--;
  }, 1000);
}

onmessage = function (event) {
  if (event.data === "pause") {
    clearInterval(intervalo);
  } else if (event.data === "resume") {
    iniciarContador();
  }
};

iniciarContador();
