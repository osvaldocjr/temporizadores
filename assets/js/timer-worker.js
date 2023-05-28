let tempoRestante = 0;

setInterval(() => {
  postMessage(tempoRestante);
  tempoRestante--;
}, 1000);

onmessage = function (event) {
  if (event.data === "pause") {
    clearInterval();
  } else if (event.data === "resume") {
    setInterval(() => {
      postMessage(tempoRestante);
      tempoRestante--;
    }, 1000);
  }
};
