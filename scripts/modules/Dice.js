import { host } from '../main.js';

export default class Dice {
    constructor(game) {
        this.game = game;
        this.min = 1;
        this.max = 6;
        this.value = 0;
        this.voices = window.speechSynthesis.getVoices();
    }
    roll(container) {
        this.value = Math.floor(Math.random() * this.max) + this.min;
        this.removeDOM(container);

        const dice = document.createElement('div');
        dice.classList.add('dice')
        // console.log(this.value)
        dice.style.backgroundImage = `url("${host}/gfx/dice${this.value}.png")`;
        container.appendChild(dice);

        const synth = new SpeechSynthesisUtterance(this.value);
        // console.log(window.speechSynthesis.getVoices())
        synth.voice = this.voices.find(item => item.lang == 'pl-PL');
        speechSynthesis.speak(synth);

        this.game.showPossibleMoves();
    }
    makeDice(container) {
        const rollBtn = document.createElement('button');
        rollBtn.classList = 'roll';
        rollBtn.innerHTML = 'Roll a dice'
        rollBtn.addEventListener('click', () => { this.roll(container) })
        container.appendChild(rollBtn);
    }
    removeDOM(container) {
        while (container.firstChild) {
            container.firstChild.remove();
        }
    }
}