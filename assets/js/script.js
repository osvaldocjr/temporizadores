let timerWorker1; // Variável para o Worker do tempo 1
let timerWorker2; // Variável para o Worker do tempo 2
let isPaused1 = false; // Variável para controlar o estado de pausa do tempo 1
let isPaused2 = false; // Variável para controlar o estado de pausa do tempo 2


function formatTime(hours, minutes, seconds) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Função para iniciar o temporizador do tempo 1
function startTimer1(hours, minutes, seconds) {
    timerWorker1 = new Worker('assets/js/timer-worker1.js');

    timerWorker1.postMessage({
        hours: hours,
        minutes: minutes,
        seconds: seconds,
    });

    timerWorker1.onmessage = function (event) {
        const message = event.data;

        if (message === 'done') {
            contador1Element.textContent = '1° tempo esgotado!';
            updatePageTitle('1° tempo esgotado!');
            reproduzirAudio();

            const horas2 = horas2Input.value;
            const minutos2 = minutos2Input.value;
            const segundos2 = segundos2Input.value;

            // Verifica se o tempo 2 tem algum valor preenchido
            if (horas2 !== '00' || minutos2 !== '00' || segundos2 !== '00') {
                startTimer2();
            }
        } else {
            contador1Element.textContent = `1° tempo restante: ${message}`;
            updatePageTitle(`1° ${message}`);
        }
    };
}

// Função para iniciar o temporizador do tempo 2
function startTimer2() {
    const horas2 = horas2Input.value;
    const minutos2 = minutos2Input.value;
    const segundos2 = segundos2Input.value;

    timerWorker2 = new Worker('assets/js/timer-worker2.js');

    timerWorker2.postMessage({
        hours: horas2,
        minutes: minutos2,
        seconds: segundos2,
    });

    timerWorker2.onmessage = function (event) {
        const message = event.data;

        if (message === 'done') {
            contador2Element.textContent = '2° tempo esgotado!';
            updatePageTitle('2° tempo esgotado!');
            reproduzirAudio();
        } else {
            contador2Element.textContent = `2° tempo restante: ${message}`;
            updatePageTitle(`2° ${message}`);
        }
    };
}

// Função para atualizar o título da página com o tempo restante
function updatePageTitle(time) {
    document.title = time;
}

// Variáveis para os elementos HTML
const horas1Input = document.querySelector('.horas1');
const minutos1Input = document.querySelector('.minutos1');
const segundos1Input = document.querySelector('.segundos1');
const contador1Element = document.querySelector('.contador1');

const horas2Input = document.querySelector('.horas2');
const minutos2Input = document.querySelector('.minutos2');
const segundos2Input = document.querySelector('.segundos2');
const contador2Element = document.querySelector('.contador2');

const iniciarBtn = document.querySelector('.iniciar-btn');
const reiniciarBtn = document.querySelector('.reiniciar-btn');
const pausarBtn1 = document.querySelector('.pausar-btn1');
const pausarBtn2 = document.querySelector('.pausar-btn2');

// Manipula o clique no botão de iniciar
iniciarBtn.addEventListener('click', () => {
    const horas1 = horas1Input.value;
    const minutos1 = minutos1Input.value;
    const segundos1 = segundos1Input.value;

    if (isPaused1) {
        // Se o tempo 1 estiver em pausa, continua a partir do ponto em que parou
        isPaused1 = false;
        timerWorker1.postMessage('resume');
        iniciarBtn.textContent = 'Iniciar tempo';
    } else {
        // Caso contrário, inicia o tempo 1 normalmente
        startTimer1(horas1, minutos1, segundos1);
        iniciarBtn.textContent = 'Pausar tempo';
    }
});

// Manipula o clique no botão de pausar para o primeiro temporizador
pausarBtn1.addEventListener('click', () => {
    if (timerWorker1) {
        if (!isPaused1) {
            // Se o tempo 1 estiver em execução, pausa e altera o rótulo do botão
            isPaused1 = true;
            timerWorker1.postMessage('pause');
            pausarBtn1.textContent = 'Continuar';
        } else {
            // Se o tempo 1 estiver pausado, continua a partir do ponto em que parou
            isPaused1 = false;
            timerWorker1.postMessage('resume');
            pausarBtn1.textContent = 'Pausar tempo';
        }
    }
});


// Manipula o clique no botão de reiniciar
reiniciarBtn.addEventListener('click', () => {
    if (timerWorker1) {
        timerWorker1.terminate();
        timerWorker1 = null;
        contador1Element.textContent = '1° tempo restante: 00:00:00';
        horas1Input.value = '00';
        minutos1Input.value = '00';
        segundos1Input.value = '00';
        iniciarBtn.textContent = 'Iniciar tempo';
        updatePageTitle('Temporizador');
    }

    if (timerWorker2) {
        timerWorker2.terminate();
        timerWorker2 = null;
        contador2Element.textContent = '2° tempo restante: 00:00:00';
        horas2Input.value = '00';
        minutos2Input.value = '00';
        segundos2Input.value = '00';
        updatePageTitle('Temporizador');
    }
});

// Manipula o clique no botão de pausar para o segundo temporizador
pausarBtn2.addEventListener('click', () => {
    if (timerWorker2) {
        if (!isPaused2) {
            // Se o tempo 2 estiver em execução, pausa e altera o rótulo do botão
            isPaused2 = true;
            timerWorker2.postMessage('pause');
            pausarBtn2.textContent = 'Continuar';
        } else {
            // Se o tempo 2 estiver pausado, continua a partir do ponto em que parou
            isPaused2 = false;
            timerWorker2.postMessage('resume');
            pausarBtn2.textContent = 'Pausar tempo';
        }
    }
});

function reproduzirAudio() {
    const audioElement = document.querySelector('.meuAudio');
    audioElement.play(); // Reproduz o áudio
}

function ajustarVolume() {
    const audio = document.querySelector('.meuAudio');
    const controleVolume = document.querySelector('.controleVolume');

    audio.volume = controleVolume.value;
}