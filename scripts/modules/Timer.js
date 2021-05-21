export default class Timer {
    constructor(player) {
        this.player = player;
        this.update = null;
        this.time = null;
    }
    makeDOM() {
        const timerDiv = document.createElement('div');
        timerDiv.id = 'timer';
        document.getElementById(this.player).appendChild(timerDiv);

        const hidden = document.createElement('div');
        hidden.id = 'hidden';
        document.getElementById(this.player).appendChild(hidden);
    }
    startTimer() {
        const start = Date.now();
        this.countdown(start);
        this.update = setInterval(() => {
            this.countdown(start);
        }, 500);
    }
    countdown(start) {
        const display = document.getElementById('timer');
        if (this.time > 0 || display.innerText == "") {
            const duration = 60;
            let seconds = (duration - (((Date.now() - start) / 1000))) | 0;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            display.innerText = seconds;
            this.time = parseInt(seconds);

        } else {
            this.clear();
        }
    }
    clear() {
        clearInterval(this.update);
    }
}