let seconds = 0;
let timerId;

function startTimer() {
  timerId = setInterval(() => {
    postMessage(seconds++);
  }, 1000);
}

function stopTimer() {
  clearInterval(timerId);
}

self.onmessage = function (e) {
  if (e.data === 'start') {
    startTimer();
  } else if (e.data === 'stop') {
    stopTimer();
  }
};
