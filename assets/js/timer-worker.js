let timer;
let running = false;
let seconds = 0;

self.onmessage = function (e) {
  if (e.data === 'start' && !running) {
    startTimer();
  } else if (e.data === 'stop') {
    stopTimer();
  }
};

function startTimer() {
  running = true;
  timer = setInterval(() => {
    seconds++;
    self.postMessage(seconds);
  }, 1000);
}

function stopTimer() {
  running = false;
  clearInterval(timer);
}
