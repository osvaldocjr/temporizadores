// timer-worker2.js

// Função para formatar o tempo no formato hh:mm:ss
function formatTime(hours, minutes, seconds) {
  return `${padNumber(hours)}:${padNumber(minutes)}:${padNumber(seconds)}`;
}

// Função auxiliar para adicionar um zero à esquerda se o número for menor que 10
function padNumber(number) {
  return number < 10 ? `0${number}` : number;
}

// Função para iniciar o temporizador
self.onmessage = function (event) {
  const { hours, minutes, seconds } = event.data;

  // Converte as strings para números inteiros
  const targetTime = {
    hours: parseInt(hours, 10),
    minutes: parseInt(minutes, 10),
    seconds: parseInt(seconds, 10),
  };

  // Calcula o tempo total em segundos
  const targetSeconds =
    targetTime.hours * 3600 + targetTime.minutes * 60 + targetTime.seconds;

  let remainingSeconds = targetSeconds;

  // Cria um intervalo para enviar atualizações de tempo para o script principal
  const interval = setInterval(() => {
    remainingSeconds--;

    if (remainingSeconds >= 0) {
      const remainingTime = {
        hours: Math.floor(remainingSeconds / 3600),
        minutes: Math.floor((remainingSeconds % 3600) / 60),
        seconds: remainingSeconds % 60,
      };

      const formattedTime = formatTime(
        remainingTime.hours,
        remainingTime.minutes,
        remainingTime.seconds
      );

      // Envia uma mensagem com o tempo restante para o script principal
      self.postMessage(formattedTime);
    } else {
      // Envia uma mensagem indicando que o temporizador chegou a zero
      self.postMessage('done');
      clearInterval(interval);
    }
  }, 1000);
};
