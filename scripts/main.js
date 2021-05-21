import Player from "./modules/Player.js";
import Game from "./modules/Game.js";

export const host = 'https://chinczyk.limanowa.org';
export const main = document.getElementById("main");

export function createPlayer() {
    player = new Player(document.getElementById("nick").value);
    player.joinLobby();
};
export function createGame(lobby) {
    clearInterval(update);
    game = new Game(lobby);
    game.start();
};
export function startUpdatingLobby(lobby) {
    lobby.updateData();
    update = setInterval(function () {
        lobby.updateData();
    }, 3000);
};
export function startUpdatingGame() {
    game.updateData(false);
    update = setInterval(function () {
        game.updateData(false);
    }, 3000);
};

let update,
    player,
    game;

document.getElementById("joinBtn").addEventListener('click', createPlayer);



// let rand = Math.random();
// player = new Player((rand) + "", main);
// player.joinLobby();


// setTimeout(() => {
//     player.ready();

// }, 50);
// setTimeout(() => {
//     game.start();
// }, 300);



